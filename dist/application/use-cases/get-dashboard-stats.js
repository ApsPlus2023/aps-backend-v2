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
exports.getDashboardStats = getDashboardStats;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function getDashboardStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalPatients = yield prisma_client_1.prisma.user.count({
            where: { type: "PATIENT" },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const totalConsultationsToday = yield prisma_client_1.prisma.consultation.count({
            where: {
                scheduledAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newPatientsLast7Days = yield prisma_client_1.prisma.user.count({
            where: {
                type: "PATIENT",
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
        });
        const canceledConsultations = yield prisma_client_1.prisma.consultation.count({
            where: {
                canceled: true,
            },
        });
        return {
            totalPatients,
            totalConsultationsToday,
            newPatientsLast7Days,
            canceledConsultations,
        };
    });
}
