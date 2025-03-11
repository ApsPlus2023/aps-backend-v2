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
        fastify.get("/medical-records", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const medicalRecords = yield prisma_client_1.prisma.medicalRecord.findMany({
                    include: {
                        patient: true,
                        prescriptions: true,
                        diagnoses: true,
                        soapNotes: true,
                    },
                });
                return reply.send({ medicalRecords });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.get("/medical-records/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const medicalRecord = yield prisma_client_1.prisma.medicalRecord.findUnique({
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.post("/medical-records", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId, recordNumber, soapNote } = request.body;
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
                if (soapNote) {
                    yield prisma_client_1.prisma.soapNote.create({
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.patch("/medical-records/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const { recordNumber, soapNote } = request.body;
                const record = yield prisma_client_1.prisma.medicalRecord.findUnique({ where: { id } });
                if (!record) {
                    return reply.status(404).send({ error: "Prontuário não encontrado" });
                }
                const updated = yield prisma_client_1.prisma.medicalRecord.update({
                    where: { id },
                    data: Object.assign({}, (recordNumber && { recordNumber })),
                });
                if (soapNote) {
                    const latestSoap = yield prisma_client_1.prisma.soapNote.findFirst({
                        where: { medicalRecordId: id },
                        orderBy: { createdAt: 'desc' },
                    });
                    if (latestSoap) {
                        yield prisma_client_1.prisma.soapNote.update({
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
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.delete("/medical-records/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const record = yield prisma_client_1.prisma.medicalRecord.findUnique({ where: { id } });
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
