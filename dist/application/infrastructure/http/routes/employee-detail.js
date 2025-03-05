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
exports.employeeDetailRoutes = employeeDetailRoutes;
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function employeeDetailRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/employees/:id", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const employee = yield prisma_client_1.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    employeeRole: true,
                    hireDate: true,
                    workDays: true,
                    profilePhoto: true,
                    status: true,
                    address: true,
                    createdAt: true,
                    type: true,
                },
            });
            if (!employee || employee.type !== "EMPLOYEE") {
                return reply.status(404).send({ error: "Funcionário não encontrado" });
            }
            return reply.send(employee);
        }));
    });
}
