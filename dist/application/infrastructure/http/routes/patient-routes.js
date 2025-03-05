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
exports.patientRoutes = patientRoutes;
const create_pacient_1 = require("../../../use-cases/create-pacient");
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function patientRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // (1) Criar um paciente (POST /patients)
        fastify.post('/patients', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, address, cpf, rg, profession, bloodType, dateOfBirth, } = request.body;
                const patient = yield (0, create_pacient_1.createPatient)({
                    name,
                    email,
                    phone,
                    address,
                    cpf,
                    rg,
                    profession,
                    bloodType,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                });
                return reply.status(201).send(patient);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        // (2) Listar todos os pacientes (GET /getPatients)
        fastify.get('/getPatients', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const patients = yield prisma_client_1.prisma.user.findMany({
                    where: { type: 'PATIENT' },
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        cpf: true,
                        dateOfBirth: true,
                        bloodType: true,
                        rg: true,
                        profession: true,
                        status: true,
                        email: true,
                    },
                });
                return reply.send({ patients });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.get('/patients/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const patient = yield prisma_client_1.prisma.user.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        cpf: true,
                        dateOfBirth: true,
                        bloodType: true,
                        rg: true,
                        profession: true,
                        status: true,
                        address: true,
                        email: true,
                        MedicalRecord: {
                            select: {
                                recordNumber: true
                            }
                        }
                    },
                });
                if (!patient) {
                    return reply.status(404).send({ error: 'Paciente não encontrado' });
                }
                return reply.send({ patient });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
    });
}
