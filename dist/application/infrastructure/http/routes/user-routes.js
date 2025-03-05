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
exports.userRoutes = userRoutes;
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function userRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/users', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_client_1.prisma.user.findMany({
                    where: { type: 'PATIENT' },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        type: true,
                        status: true,
                    },
                });
                return reply.send({ users });
            }
            catch (error) {
                return reply.status(400).send({ error: 'Erro ao buscar usuários' });
            }
        }));
    });
}
