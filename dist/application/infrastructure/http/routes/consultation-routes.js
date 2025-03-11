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
exports.consultationRoutes = consultationRoutes;
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function consultationRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/consultations', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId, scheduledAt, doctorId, 
                // Campos do SOAP (Subjetivo, Objetivo, Avaliação e Plano)
                motivoPrincipal, infoAdicionaisSubjetivo, alergias, pressaoSistolica, pressaoDiastolica, freqRespiratoria, freqCardiaca, perimetroCefalico, saturacaoOxigenio, circAbdominal, temperatura, glicemia, peso, altura, imc, problemasCondicoesCID, infoAdicionaisAvaliacao, solicitacaoExames, pedidoEncaminhamento, prescricaoManual, infoAdicionaisPlano, lembretes, } = request.body;
                // Valida o paciente
                const patient = yield prisma_client_1.prisma.user.findUnique({ where: { id: patientId } });
                if (!patient) {
                    return reply.status(404).send({ error: 'Paciente não encontrado' });
                }
                if (patient.type !== 'PATIENT') {
                    return reply.status(400).send({ error: 'Usuário não é do tipo PATIENT' });
                }
                // Gera link para Jitsi
                const jitsiRoom = `meet-${Math.floor(Math.random() * 100000)}`;
                const jitsiLink = `https://meet.jit.si/${jitsiRoom}`;
                // Converte a data/hora informada
                const [datePart, timePart] = scheduledAt.split(' ');
                const newDate = new Date(`${datePart}T${timePart}:00.000Z`);
                // Cria a consulta
                const createdConsultation = yield prisma_client_1.prisma.consultation.create({
                    data: {
                        patientId,
                        scheduledAt: newDate,
                        jitsiLink,
                        doctorId: doctorId || null,
                    },
                });
                // Obtém ou cria o prontuário do paciente
                let medicalRecord = yield prisma_client_1.prisma.medicalRecord.findUnique({
                    where: { patientId },
                });
                if (!medicalRecord) {
                    const recordNumber = "PRT-" + Date.now().toString();
                    medicalRecord = yield prisma_client_1.prisma.medicalRecord.create({
                        data: {
                            patientId,
                            recordNumber,
                        },
                    });
                }
                // Se houver algum campo do SOAP, cria o registro em SoapNote
                if (motivoPrincipal ||
                    infoAdicionaisSubjetivo ||
                    alergias ||
                    pressaoSistolica ||
                    pressaoDiastolica ||
                    freqRespiratoria ||
                    freqCardiaca ||
                    perimetroCefalico ||
                    saturacaoOxigenio ||
                    circAbdominal ||
                    temperatura ||
                    glicemia ||
                    peso ||
                    altura ||
                    imc ||
                    problemasCondicoesCID ||
                    infoAdicionaisAvaliacao ||
                    solicitacaoExames ||
                    pedidoEncaminhamento ||
                    prescricaoManual ||
                    infoAdicionaisPlano ||
                    lembretes) {
                    yield prisma_client_1.prisma.soapNote.create({
                        data: {
                            medicalRecordId: medicalRecord.id,
                            chiefComplaint: motivoPrincipal,
                            additionalInfo: infoAdicionaisSubjetivo,
                            allergies: alergias,
                            bloodPressureSystolic: pressaoSistolica ? parseInt(pressaoSistolica) : undefined,
                            bloodPressureDiastolic: pressaoDiastolica ? parseInt(pressaoDiastolica) : undefined,
                            respiratoryRate: freqRespiratoria ? parseInt(freqRespiratoria) : undefined,
                            heartRate: freqCardiaca ? parseInt(freqCardiaca) : undefined,
                            headCircumference: perimetroCefalico ? parseFloat(perimetroCefalico) : undefined,
                            oxygenSaturation: saturacaoOxigenio ? parseFloat(saturacaoOxigenio) : undefined,
                            abdominalCircumference: circAbdominal ? parseFloat(circAbdominal) : undefined,
                            temperature: temperatura ? parseFloat(temperatura) : undefined,
                            glycemia: glicemia ? parseFloat(glicemia) : undefined,
                            weight: peso ? parseFloat(peso) : undefined,
                            height: altura ? parseFloat(altura) : undefined,
                            bmi: imc ? parseFloat(imc) : undefined,
                            previousProblems: problemasCondicoesCID,
                            additionalAssessment: infoAdicionaisAvaliacao,
                            requestedExams: solicitacaoExames,
                            referral: pedidoEncaminhamento,
                            manualPrescription: prescricaoManual,
                            planAdditionalInfo: infoAdicionaisPlano,
                            reminders: lembretes,
                        },
                    });
                }
                return reply.status(201).send(createdConsultation);
            }
            catch (error) {
                console.error(error);
                return reply.status(400).send({ error: 'Erro ao criar consulta' });
            }
        }));
        fastify.delete('/consultations/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const existing = yield prisma_client_1.prisma.consultation.findUnique({ where: { id } });
                if (!existing) {
                    return reply.status(404).send({ error: 'Consulta não encontrada' });
                }
                yield prisma_client_1.prisma.consultation.update({
                    where: { id },
                    data: { canceled: true },
                });
                return reply.status(204).send();
            }
            catch (error) {
                console.error(error);
                return reply.status(400).send({ error: 'Erro ao cancelar consulta' });
            }
        }));
        fastify.get('/consultations', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { patientId } = request.query;
                const whereClause = patientId ? { patientId, canceled: false } : { canceled: false };
                const consultations = yield prisma_client_1.prisma.consultation.findMany({
                    where: whereClause,
                    include: {
                        patient: { select: { id: true, name: true } },
                        doctor: { select: { id: true, name: true } },
                    },
                });
                const result = consultations.map((cons) => {
                    var _a, _b, _c, _d, _e, _f;
                    const d = cons.scheduledAt;
                    const year = d.getUTCFullYear();
                    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(d.getUTCDate()).padStart(2, '0');
                    const hours = String(d.getUTCHours()).padStart(2, '0');
                    const mins = String(d.getUTCMinutes()).padStart(2, '0');
                    const rawFormatted = `${year}-${month}-${day} ${hours}:${mins}`;
                    const displayFormatted = `${day}/${month}/${year} ${hours}:${mins}`;
                    return {
                        id: cons.id,
                        scheduledAt: rawFormatted,
                        scheduledAtFormatted: displayFormatted,
                        patientId: cons.patientId,
                        patientName: (_b = (_a = cons.patient) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Paciente',
                        doctorId: (_d = (_c = cons.doctor) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null,
                        doctorName: (_f = (_e = cons.doctor) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : null,
                        jitsiLink: cons.jitsiLink,
                        canceled: cons.canceled,
                    };
                });
                return reply.send({ consultations: result });
            }
            catch (error) {
                console.error(error);
                return reply.status(400).send({ error: 'Erro ao buscar consultas' });
            }
        }));
    });
}
