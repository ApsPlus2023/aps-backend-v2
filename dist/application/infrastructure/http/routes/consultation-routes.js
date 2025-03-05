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
                const { patientId, scheduledAt, doctorId } = request.body;
                const patient = yield prisma_client_1.prisma.user.findUnique({ where: { id: patientId } });
                if (!patient) {
                    return reply.status(404).send({ error: 'Paciente não encontrado' });
                }
                if (patient.type !== 'PATIENT') {
                    return reply.status(400).send({ error: 'Usuário não é do tipo PATIENT' });
                }
                const jitsiRoom = `meet-${Math.floor(Math.random() * 100000)}`;
                const jitsiLink = `https://meet.jit.si/${jitsiRoom}`;
                const [datePart, timePart] = scheduledAt.split(' ');
                // Cuidado: dependendo do formato da data, talvez seja melhor utilizar parseLocalDateTime
                const newDate = new Date(`${datePart}T${timePart}:00.000Z`);
                const created = yield prisma_client_1.prisma.consultation.create({
                    data: {
                        patientId,
                        scheduledAt: newDate,
                        jitsiLink,
                        doctorId: doctorId || null,
                    },
                });
                return reply.status(201).send(created);
            }
            catch (error) {
                console.error(error);
                return reply.status(400).send({ error: 'Erro ao criar consulta' });
            }
        }));
        // Atualizamos a rota DELETE para fazer soft delete (definir canceled: true)
        fastify.delete('/consultations/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const existing = yield prisma_client_1.prisma.consultation.findUnique({ where: { id } });
                if (!existing) {
                    return reply.status(404).send({ error: 'Consulta não encontrada' });
                }
                // Em vez de deletar, atualizamos o campo "canceled" para true
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
                const whereClause = patientId ? { patientId } : {};
                const consultations = yield prisma_client_1.prisma.consultation.findMany({
                    where: whereClause,
                    include: {
                        patient: {
                            select: { id: true, name: true },
                        },
                        doctor: {
                            select: { id: true, name: true },
                        },
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
                    const formatted = `${year}-${month}-${day} ${hours}:${mins}`;
                    return {
                        id: cons.id,
                        scheduledAt: formatted,
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
