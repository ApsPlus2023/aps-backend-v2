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
exports.consultationsByMonthRoutes = consultationsByMonthRoutes;
const get_consultations_by_month_1 = require("../../../use-cases/get-consultations-by-month");
function consultationsByMonthRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/consultations-by-month", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, get_consultations_by_month_1.getConsultationsByMonth)();
                return reply.send(data);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                return reply.status(400).send({ error: errorMessage });
            }
        }));
    });
}
