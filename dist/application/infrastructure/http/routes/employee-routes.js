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
exports.employeeRoutes = employeeRoutes;
const create_employee_1 = require("../../../use-cases/create-employee");
const prisma_client_1 = require("../../../infrastructure/database/prisma-client");
function employeeRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/employees', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, employeeRole, hireDate, workDays, profilePhoto, address, } = request.body;
                const employee = yield (0, create_employee_1.createEmployee)({
                    name,
                    email,
                    phone,
                    employeeRole,
                    hireDate: new Date(hireDate),
                    workDays,
                    profilePhoto,
                    address,
                });
                return reply.status(201).send(employee);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.get('/employees', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const employees = yield prisma_client_1.prisma.user.findMany({
                    where: { type: 'EMPLOYEE' },
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
                    },
                });
                return reply.send({ employees });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
        fastify.delete('/employees/:id', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.params;
                const employee = yield prisma_client_1.prisma.user.findUnique({ where: { id } });
                if (!employee || employee.type !== 'EMPLOYEE') {
                    return reply.status(404).send({ error: 'Funcionário não encontrado' });
                }
                yield prisma_client_1.prisma.user.delete({ where: { id } });
                return reply.status(204).send();
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                return reply.status(400).send({ error: errorMessage });
            }
        }));
    });
}
