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
exports.deleteCancelledConsultations = deleteCancelledConsultations;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function deleteCancelledConsultations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const { count } = yield prisma_client_1.prisma.consultation.deleteMany({
                where: {
                    canceled: true,
                    updatedAt: {
                        lt: thirtyDaysAgo,
                    },
                },
            });
            console.log(`Deleted ${count} cancelled consultations older than 30 days.`);
            return count;
        }
        catch (error) {
            console.error("Error deleting cancelled consultations:", error);
            throw error;
        }
    });
}
