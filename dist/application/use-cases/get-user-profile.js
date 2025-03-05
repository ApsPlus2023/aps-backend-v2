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
exports.getUserProfile = getUserProfile;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
function getUserProfile(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId }) {
        const user = yield prisma_client_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
                phone: true,
                address: true,
                type: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                cpf: true,
                rg: true,
                profession: true,
                bloodType: true,
                dateOfBirth: true,
                employeeRole: true,
                hireDate: true,
                workDays: true,
            },
        });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        return user;
    });
}
