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
exports.getPatientsRoutes = getPatientsRoutes;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function getPatientsRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
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
                        status: true,
                        bloodType: true,
                    },
                });
                return reply.send({ patients });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
    });
}
