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
exports.patientConsultationRoutes = patientConsultationRoutes;
const patient_consultation_info_1 = require("../../../use-cases/patient-consultation-info");
function patientConsultationRoutes(fastify) {
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
        fastify.get("/consultation-info", {
            preHandler: [fastify.authenticate],
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = request.user;
                if (!(payload === null || payload === void 0 ? void 0 : payload.id)) {
                    return reply.status(401).send({ error: "Usuário não autenticado" });
                }
                if (payload.type !== "PATIENT") {
                    return reply
                        .status(403)
                        .send({ error: "Apenas usuários do tipo PATIENT podem ver isto" });
                }
                const info = yield (0, patient_consultation_info_1.getPatientConsultationInfo)({ patientId: payload.id });
                return reply.send(info);
            }
            catch (err) {
                console.error(err);
                return reply
                    .status(400)
                    .send({ error: "Erro ao buscar consultas do paciente" });
            }
        }));
    });
}
