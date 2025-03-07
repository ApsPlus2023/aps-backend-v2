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
exports.getDashboardExtraStats = getDashboardExtraStats;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function getDashboardExtraStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        // Definir o início e o fim do mês atual
        const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        // Atendimentos do mês atual
        const atendimentosMes = yield prisma_client_1.prisma.consultation.findMany({
            where: { scheduledAt: { gte: startMonth, lt: endMonth } },
            select: { id: true, scheduledAt: true, jitsiLink: true },
        });
        // Produtividade: % de teleconsultas no mês
        const totalConsultationsMes = atendimentosMes.length;
        const teleConsultationsMes = atendimentosMes.filter(c => c.jitsiLink !== null).length;
        const produtividade = totalConsultationsMes > 0 ? (teleConsultationsMes / totalConsultationsMes) * 100 : 0;
        // Total de consultas agendadas do dia
        const startToday = new Date(today);
        startToday.setHours(0, 0, 0, 0);
        const endToday = new Date(today);
        endToday.setHours(23, 59, 59, 999);
        const totalConsultasHoje = yield prisma_client_1.prisma.consultation.count({
            where: { scheduledAt: { gte: startToday, lte: endToday } }
        });
        // Médicos com maior taxa de teleconsultas no mês
        const medicos = yield prisma_client_1.prisma.user.findMany({
            where: { type: "EMPLOYEE", employeeRole: "MEDICO" },
            select: { id: true, name: true, profilePhoto: true }
        });
        const medicosTaxa = yield Promise.all(medicos.map((medico) => __awaiter(this, void 0, void 0, function* () {
            const total = yield prisma_client_1.prisma.consultation.count({
                where: {
                    doctorId: medico.id,
                    scheduledAt: { gte: startMonth, lt: endMonth }
                }
            });
            const tele = yield prisma_client_1.prisma.consultation.count({
                where: {
                    doctorId: medico.id,
                    jitsiLink: { not: null },
                    scheduledAt: { gte: startMonth, lt: endMonth }
                }
            });
            const taxa = total > 0 ? (tele / total) * 100 : 0;
            return {
                id: medico.id,
                name: medico.name,
                profilePhoto: medico.profilePhoto,
                totalConsultations: total,
                taxaTeleconsultas: taxa
            };
        })));
        medicosTaxa.sort((a, b) => b.taxaTeleconsultas - a.taxaTeleconsultas);
        const medicosMaiorTaxaTeleconsultas = medicosTaxa.slice(0, 3);
        // Últimos 5 pacientes cadastrados: retornar nome e data de cadastro (formatada)
        const ultimos5PacientesRaw = yield prisma_client_1.prisma.user.findMany({
            where: { type: "PATIENT" },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, name: true, createdAt: true }
        });
        const ultimos5Pacientes = ultimos5PacientesRaw.map(patient => ({
            id: patient.id,
            name: patient.name,
            dataCadastro: patient.createdAt.toLocaleDateString("pt-BR")
        }));
        return {
            atendimentosMes,
            produtividade,
            totalConsultasHoje,
            medicosMaiorTaxaTeleconsultas,
            ultimos5Pacientes
        };
    });
}
