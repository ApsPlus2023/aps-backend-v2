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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordRoutes = changePasswordRoutes;
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function changePasswordRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.decorate("authenticate", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Certifique-se de que o token seja extraído do cookie configurado
                    yield request.jwtVerify();
                }
                catch (err) {
                    return reply.status(401).send({ error: "Token inválido ou ausente" });
                }
            });
        });
        fastify.patch("/change-password", { preHandler: [fastify.authenticate] }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = request.user;
                if (!payload || !payload.id) {
                    return reply.status(401).send({ error: "Usuário não autenticado" });
                }
                const userId = payload.id;
                const { currentPassword, newPassword } = request.body;
                const userFromDb = yield prisma_client_1.prisma.user.findUnique({ where: { id: userId } });
                if (!userFromDb) {
                    return reply.status(404).send({ error: "Usuário não encontrado" });
                }
                if (!userFromDb.password) {
                    return reply.status(400).send({ error: "Usuário não possui senha cadastrada" });
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, userFromDb.password);
                if (!isPasswordValid) {
                    return reply.status(400).send({ error: "Senha atual incorreta" });
                }
                const newHashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                yield prisma_client_1.prisma.user.update({
                    where: { id: userId },
                    data: { password: newHashedPassword },
                });
                return reply.status(204).send();
            }
            catch (error) {
                console.error("Erro ao alterar senha:", error);
                return reply.status(400).send({ error: "Erro ao alterar senha" });
            }
        }));
    });
}
