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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authenticateUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ email, password }) {
        const user = yield prisma_client_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        if (!user.password) {
            throw new Error('Usuário não possui senha definida');
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Senha inválida');
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            type: user.type,
            employeeRole: user.employeeRole,
        }, env_1.env.JWT_SECRET, { expiresIn: '1d' });
        return { token };
    });
}
