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
exports.profileGeneralRoutes = profileGeneralRoutes;
const get_user_profile_1 = require("../../../use-cases/get-user-profile");
function profileGeneralRoutes(fastify) {
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
        fastify.get("/profile", { preHandler: [fastify.authenticate] }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const payload = request.user;
            if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                return reply.status(401).send({ error: "Usuário não autenticado" });
            }
            try {
                const userProfile = yield (0, get_user_profile_1.getUserProfile)({ userId: payload.id });
                return reply.send(userProfile);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(404).send({ error: errorMessage });
            }
        }));
    });
}
