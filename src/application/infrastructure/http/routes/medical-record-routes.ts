import { FastifyInstance } from "fastify"
import { prisma } from "../../../infrastructure/database/prisma-client"

export async function medicalRecordRoutes(fastify: FastifyInstance) {
  // (A) Listar todos os prontuários
  fastify.get("/medical-records", async (request, reply) => {
    try {
      const medicalRecords = await prisma.medicalRecord.findMany({
        include: {
          patient: true, // Traz informações do Paciente
          // Se quiser prescrições e diagnósticos resumidos, inclua:
          prescriptions: true,
          diagnoses: true,
        },
      })

      return reply.send({ medicalRecords })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      return reply.status(400).send({ error: errorMessage })
    }
  })

  // (B) Buscar um prontuário específico
  fastify.get("/medical-records/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id },
        include: {
          patient: true,
          prescriptions: true,
          diagnoses: true,
        },
      })

      if (!medicalRecord) {
        return reply.status(404).send({ error: "Prontuário não encontrado" })
      }

      return reply.send({ medicalRecord })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      return reply.status(400).send({ error: errorMessage })
    }
  })

  // (C) Criar prontuário (POST)
  fastify.post("/medical-records", async (request, reply) => {
    try {
      const { patientId, recordNumber } = request.body as {
        patientId: string
        recordNumber?: string
      }

      const patient = await prisma.user.findUnique({
        where: { id: patientId },
      })
      if (!patient) {
        return reply.status(404).send({ error: "Paciente não encontrado" })
      }

      const existingRecord = await prisma.medicalRecord.findUnique({
        where: { patientId },
      })
      if (existingRecord) {
        return reply
          .status(400)
          .send({ error: "Este paciente já possui um prontuário" })
      }

      const generatedRecordNumber = recordNumber ?? "PRT-" + Date.now().toString()

      const newRecord = await prisma.medicalRecord.create({
        data: {
          recordNumber: generatedRecordNumber,
          patientId: patientId,
        },
      })

      return reply.status(201).send(newRecord)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      return reply.status(400).send({ error: errorMessage })
    }
  })

  // (D) Atualizar prontuário (PATCH)
  fastify.patch("/medical-records/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { recordNumber } = request.body as { recordNumber?: string }

      const record = await prisma.medicalRecord.findUnique({
        where: { id },
      })
      if (!record) {
        return reply.status(404).send({ error: "Prontuário não encontrado" })
      }

      const updated = await prisma.medicalRecord.update({
        where: { id },
        data: {
          ...(recordNumber && { recordNumber }),
        },
      })

      return reply.send(updated)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      return reply.status(400).send({ error: errorMessage })
    }
  })

  // (E) Deletar prontuário (DELETE)
  fastify.delete("/medical-records/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const record = await prisma.medicalRecord.findUnique({
        where: { id },
      })
      if (!record) {
        return reply.status(404).send({ error: "Prontuário não encontrado" })
      }

      await prisma.medicalRecord.delete({
        where: { id },
      })

      return reply.status(204).send()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      return reply.status(400).send({ error: errorMessage })
    }
  })
}
