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
exports.updatePassword = updatePassword;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function updatePassword(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, password }) {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const updatedUser = yield prisma_client_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        return updatedUser;
    });
}
