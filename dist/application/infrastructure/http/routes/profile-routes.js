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
exports.profileRoutes = profileRoutes;
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function profileRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.decorate("authenticate", function (request, reply) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield request.jwtVerify();
                }
                catch (err) {
                    reply.send(err);
                }
            });
        });
        fastify.get("/me", { preHandler: [fastify.authenticate] }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.user;
            if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                return reply.status(401).send({ error: "Usuário não autenticado" });
            }
            const user = yield prisma_client_1.prisma.user.findUnique({
                where: { id: payload.id },
                select: {
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            });
            if (!user) {
                return reply.status(404).send({ error: "Usuário não encontrado" });
            }
            return reply.send(user);
        }));
    });
}
