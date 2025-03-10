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
exports.getPatientConsultationInfo = getPatientConsultationInfo;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function getPatientConsultationInfo(_a) {
    return __awaiter(this, arguments, void 0, function* ({ patientId, }) {
        const consultations = yield prisma_client_1.prisma.consultation.findMany({
            where: {
                patientId,
                canceled: false,
            },
            include: {
                doctor: {
                    select: { name: true, id: true },
                },
            },
            orderBy: { scheduledAt: "asc" },
        });
        const lastConsultation = yield prisma_client_1.prisma.consultation.findFirst({
            where: {
                patientId,
                canceled: false,
                scheduledAt: { lte: new Date() },
            },
            include: {
                doctor: { select: { name: true, id: true } },
            },
            orderBy: { scheduledAt: "desc" },
        });
        let lastProfessional = null;
        if (lastConsultation === null || lastConsultation === void 0 ? void 0 : lastConsultation.doctor) {
            lastProfessional = lastConsultation.doctor.name;
        }
        const totalDone = yield prisma_client_1.prisma.consultation.count({
            where: {
                patientId,
                canceled: false,
                scheduledAt: { lte: new Date() },
            },
        });
        return {
            consultations,
            lastConsultation,
            lastProfessional,
            totalDone,
        };
    });
}
