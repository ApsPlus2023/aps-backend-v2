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
exports.getConsultationsByMonth = getConsultationsByMonth;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function getConsultationsByMonth() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        const result = yield prisma_client_1.prisma.$queryRaw `
    SELECT EXTRACT(MONTH FROM "scheduledAt") as "monthNumber", COUNT(*) as consultas
    FROM "Consultation"
    WHERE "scheduledAt" >= ${startDate}
    GROUP BY "monthNumber", date_trunc('month', "scheduledAt")
    ORDER BY date_trunc('month', "scheduledAt")
  `;
        const monthNames = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];
        return result.map(item => ({
            month: monthNames[item.monthNumber - 1],
            consultas: Number(item.consultas)
        }));
    });
}
