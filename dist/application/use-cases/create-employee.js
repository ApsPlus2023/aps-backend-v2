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
exports.createEmployee = createEmployee;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
const sendgrid_1 = require("../infrastructure/email/sendgrid");
/**
 * Converte o valor de cargo recebido para o valor do enum EmployeeRole.
 */
function mapEmployeeRole(role) {
    switch (role.toLowerCase()) {
        case 'médico':
        case 'medico':
            return 'MEDICO';
        case 'enfermeiro':
            return 'ENFERMEIRO';
        case 'administrador':
            return 'ADMINISTRADOR';
        case 'atendente':
            return 'ATENDENTE';
        default:
            throw new Error(`Cargo inválido: ${role}`);
    }
}
function createEmployee(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const employee = yield prisma_client_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                type: 'EMPLOYEE',
                employeeRole: mapEmployeeRole(data.employeeRole),
                hireDate: data.hireDate,
                workDays: data.workDays,
                profilePhoto: data.profilePhoto,
                address: data.address,
                coren: data.coren,
                crm: data.crm,
                password: null,
            },
        });
        yield (0, sendgrid_1.sendPasswordCreationEmail)(employee.email, employee.id);
        return employee;
    });
}
