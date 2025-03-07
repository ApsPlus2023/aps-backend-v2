"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalRecordRoutes = medicalRecordRoutes;
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function medicalRecordRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // (A) Listar todos os prontuários
        fastify.get("/medical-records", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medicalRecords = yield prisma_client_1.prisma.medicalRecord.findMany({
                    include: {
                        patient: true, // Traz informações do Paciente
                        // Se quiser prescrições e diagnósticos resumidos, inclua:
                        prescriptions: true,
                        diagnoses: true,
                    },
                });
                return reply.send({ medicalRecords });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        // (B) Buscar um prontuário específico
        fastify.get("/medical-records/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const medicalRecord = yield prisma_client_1.prisma.medicalRecord.findUnique({
                    where: { id },
                    include: {
                        patient: true,
                        prescriptions: true,
                        diagnoses: true,
                    },
                });
                if (!medicalRecord) {
                    return reply.status(404).send({ error: "Prontuário não encontrado" });
                }
                return reply.send({ medicalRecord });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        // (C) Criar prontuário (POST)
        fastify.post("/medical-records", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId, recordNumber } = request.body;
                const patient = yield prisma_client_1.prisma.user.findUnique({
                    where: { id: patientId },
                });
                if (!patient) {
                    return reply.status(404).send({ error: "Paciente não encontrado" });
                }
                const existingRecord = yield prisma_client_1.prisma.medicalRecord.findUnique({
                    where: { patientId },
                });
                if (existingRecord) {
                    return reply
                        .status(400)
                        .send({ error: "Este paciente já possui um prontuário" });
                }
                const generatedRecordNumber = recordNumber !== null && recordNumber !== void 0 ? recordNumber : "PRT-" + Date.now().toString();
                const newRecord = yield prisma_client_1.prisma.medicalRecord.create({
                    data: {
                        recordNumber: generatedRecordNumber,
                        patientId: patientId,
                    },
                });
                return reply.status(201).send(newRecord);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        // (D) Atualizar prontuário (PATCH)
        fastify.patch("/medical-records/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const { recordNumber } = request.body;
                const record = yield prisma_client_1.prisma.medicalRecord.findUnique({
                    where: { id },
                });
                if (!record) {
                    return reply.status(404).send({ error: "Prontuário não encontrado" });
                }
                const updated = yield prisma_client_1.prisma.medicalRecord.update({
                    where: { id },
                    data: Object.assign({}, (recordNumber && { recordNumber })),
                });
                return reply.send(updated);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        // (E) Deletar prontuário (DELETE)
        fastify.delete("/medical-records/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const record = yield prisma_client_1.prisma.medicalRecord.findUnique({
                    where: { id },
                });
                if (!record) {
                    return reply.status(404).send({ error: "Prontuário não encontrado" });
                }
                yield prisma_client_1.prisma.medicalRecord.delete({
                    where: { id },
                });
                return reply.status(204).send();
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
    });
}
