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
exports.authRoutes = authRoutes;
const authenticate_user_1 = require("../../../use-cases/authenticate-user");
function authRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/login', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const { token } = yield (0, authenticate_user_1.authenticateUser)({ email, password });
                // Envia o token via cookie com opções de segurança para produção
                reply.setCookie("token", token, {
                    path: "/",
                    httpOnly: true,
                    secure: true, // O cookie só é enviado via HTTPS
                    sameSite: "none", // Permite requisições cross-site
                });
                return reply.send({ token });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(401).send({ error: errorMessage });
            }
        }));
    });
}
