import { FastifyInstance } from "fastify";
import { prisma } from "../../../infrastructure/database/prisma-client";

export async function medicalRecordRoutes(fastify: FastifyInstance) {

  fastify.get("/medical-records", async (request, reply) => {
    try {
      const medicalRecords = await prisma.medicalRecord.findMany({
        include: {
          patient: true,
          prescriptions: true,
          diagnoses: true,
          soapNotes: true,
        },
      });

      return reply.send({ medicalRecords });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });

  fastify.get("/medical-records/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id },
        include: {
          patient: true,
          prescriptions: true,
          diagnoses: true,
          soapNotes: true,
        },
      });

      if (!medicalRecord) {
        return reply.status(404).send({ error: "Prontuário não encontrado" });
      }

      return reply.send({ medicalRecord });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });

  fastify.post("/medical-records", async (request, reply) => {
    try {
      const { patientId, recordNumber, soapNote } = request.body as {
        patientId: string;
        recordNumber?: string;
        soapNote?: {
          chiefComplaint?: string;
          additionalInfo?: string;
          allergies?: string;
          pressaoSistolica?: string;
          pressaoDiastolica?: string;
          freqRespiratoria?: string;
          freqCardiaca?: string;
          perimetroCefalico?: string;
          saturacaoOxigenio?: string;
          circAbdominal?: string;
          temperatura?: string;
          glicemia?: string;
          peso?: string;
          altura?: string;
          imc?: string;
          previousProblems?: string;
          additionalAssessment?: string;
          requestedExams?: string;
          referral?: string;
          manualPrescription?: string;
          planAdditionalInfo?: string;
          reminders?: string;
        };
      };

      const patient = await prisma.user.findUnique({
        where: { id: patientId },
      });
      if (!patient) {
        return reply.status(404).send({ error: "Paciente não encontrado" });
      }

      const existingRecord = await prisma.medicalRecord.findUnique({
        where: { patientId },
      });
      if (existingRecord) {
        return reply
          .status(400)
          .send({ error: "Este paciente já possui um prontuário" });
      }

      const generatedRecordNumber = recordNumber ?? "PRT-" + Date.now().toString();

      const newRecord = await prisma.medicalRecord.create({
        data: {
          recordNumber: generatedRecordNumber,
          patientId: patientId,
        },
      });

      if (soapNote) {
        await prisma.soapNote.create({
          data: {
            medicalRecordId: newRecord.id,
            chiefComplaint: soapNote.chiefComplaint,
            additionalInfo: soapNote.additionalInfo,
            allergies: soapNote.allergies,
            bloodPressureSystolic: soapNote.pressaoSistolica ? parseInt(soapNote.pressaoSistolica) : undefined,
            bloodPressureDiastolic: soapNote.pressaoDiastolica ? parseInt(soapNote.pressaoDiastolica) : undefined,
            respiratoryRate: soapNote.freqRespiratoria ? parseInt(soapNote.freqRespiratoria) : undefined,
            heartRate: soapNote.freqCardiaca ? parseInt(soapNote.freqCardiaca) : undefined,
            headCircumference: soapNote.perimetroCefalico ? parseFloat(soapNote.perimetroCefalico) : undefined,
            oxygenSaturation: soapNote.saturacaoOxigenio ? parseFloat(soapNote.saturacaoOxigenio) : undefined,
            abdominalCircumference: soapNote.circAbdominal ? parseFloat(soapNote.circAbdominal) : undefined,
            temperature: soapNote.temperatura ? parseFloat(soapNote.temperatura) : undefined,
            glycemia: soapNote.glicemia ? parseFloat(soapNote.glicemia) : undefined,
            weight: soapNote.peso ? parseFloat(soapNote.peso) : undefined,
            height: soapNote.altura ? parseFloat(soapNote.altura) : undefined,
            bmi: soapNote.imc ? parseFloat(soapNote.imc) : undefined,
            previousProblems: soapNote.previousProblems,
            additionalAssessment: soapNote.additionalAssessment,
            requestedExams: soapNote.requestedExams,
            referral: soapNote.referral,
            manualPrescription: soapNote.manualPrescription,
            planAdditionalInfo: soapNote.planAdditionalInfo,
            reminders: soapNote.reminders,
          },
        });
      }

      return reply.status(201).send(newRecord);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });

  fastify.patch("/medical-records/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { recordNumber, soapNote } = request.body as {
        recordNumber?: string;
        soapNote?: {
          chiefComplaint?: string;
          additionalInfo?: string;
          allergies?: string;
          pressaoSistolica?: string;
          pressaoDiastolica?: string;
          freqRespiratoria?: string;
          freqCardiaca?: string;
          perimetroCefalico?: string;
          saturacaoOxigenio?: string;
          circAbdominal?: string;
          temperatura?: string;
          glicemia?: string;
          peso?: string;
          altura?: string;
          imc?: string;
          previousProblems?: string;
          additionalAssessment?: string;
          requestedExams?: string;
          referral?: string;
          manualPrescription?: string;
          planAdditionalInfo?: string;
          reminders?: string;
        };
      };

      const record = await prisma.medicalRecord.findUnique({ where: { id } });
      if (!record) {
        return reply.status(404).send({ error: "Prontuário não encontrado" });
      }

      const updated = await prisma.medicalRecord.update({
        where: { id },
        data: {
          ...(recordNumber && { recordNumber }),
        },
      });

      if (soapNote) {
        const latestSoap = await prisma.soapNote.findFirst({
          where: { medicalRecordId: id },
          orderBy: { createdAt: 'desc' },
        });
        if (latestSoap) {
          await prisma.soapNote.update({
            where: { id: latestSoap.id },
            data: {
              chiefComplaint: soapNote.chiefComplaint,
              additionalInfo: soapNote.additionalInfo,
              allergies: soapNote.allergies,
              bloodPressureSystolic: soapNote.pressaoSistolica ? parseInt(soapNote.pressaoSistolica) : undefined,
              bloodPressureDiastolic: soapNote.pressaoDiastolica ? parseInt(soapNote.pressaoDiastolica) : undefined,
              respiratoryRate: soapNote.freqRespiratoria ? parseInt(soapNote.freqRespiratoria) : undefined,
              heartRate: soapNote.freqCardiaca ? parseInt(soapNote.freqCardiaca) : undefined,
              headCircumference: soapNote.perimetroCefalico ? parseFloat(soapNote.perimetroCefalico) : undefined,
              oxygenSaturation: soapNote.saturacaoOxigenio ? parseFloat(soapNote.saturacaoOxigenio) : undefined,
              abdominalCircumference: soapNote.circAbdominal ? parseFloat(soapNote.circAbdominal) : undefined,
              temperature: soapNote.temperatura ? parseFloat(soapNote.temperatura) : undefined,
              glycemia: soapNote.glicemia ? parseFloat(soapNote.glicemia) : undefined,
              weight: soapNote.peso ? parseFloat(soapNote.peso) : undefined,
              height: soapNote.altura ? parseFloat(soapNote.altura) : undefined,
              bmi: soapNote.imc ? parseFloat(soapNote.imc) : undefined,
              previousProblems: soapNote.previousProblems,
              additionalAssessment: soapNote.additionalAssessment,
              requestedExams: soapNote.requestedExams,
              referral: soapNote.referral,
              manualPrescription: soapNote.manualPrescription,
              planAdditionalInfo: soapNote.planAdditionalInfo,
              reminders: soapNote.reminders,
            },
          });
        }
      }

      return reply.send(updated);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });

  fastify.delete("/medical-records/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const record = await prisma.medicalRecord.findUnique({ where: { id } });
      if (!record) {
        return reply.status(404).send({ error: "Prontuário não encontrado" });
      }

      await prisma.medicalRecord.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
