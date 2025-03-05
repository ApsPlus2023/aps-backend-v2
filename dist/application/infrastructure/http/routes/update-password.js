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
exports.updatePasswordRoutes = updatePasswordRoutes;
const update_password_1 = require("../../../use-cases/update-password");
function updatePasswordRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/update-password', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, password } = request.body;
                const updatedUser = yield (0, update_password_1.updatePassword)({ userId, password });
                return reply.send({
                    message: "Senha atualizada com sucesso",
                    updatedUser
                });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
    });
}
