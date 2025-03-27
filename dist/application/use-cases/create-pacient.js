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
exports.createPatient = createPatient;
const prisma_client_1 = require("../infrastructure/database/prisma-client");
const sendgrid_1 = require("../infrastructure/email/sendgrid");
function mapBloodType(value) {
    switch (value) {
        case 'O+':
            return 'O_PLUS';
        case 'O-':
            return 'O_MINUS';
        case 'A+':
            return 'A_PLUS';
        case 'A-':
            return 'A_MINUS';
        case 'B+':
            return 'B_PLUS';
        case 'B-':
            return 'B_MINUS';
        case 'AB+':
            return 'AB_PLUS';
        case 'AB-':
            return 'AB_MINUS';
        default:
            throw new Error(`Tipo sanguíneo inválido: ${value}`);
    }
}
function createPatient(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const finalBloodType = data.bloodType ? mapBloodType(data.bloodType) : null;
        // 1) Cria o paciente, agora incluindo os dados de endereço detalhados
        const patient = yield prisma_client_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                // Armazenamos os novos campos de endereço:
                cep: data.cep,
                rua: data.rua,
                bairro: data.bairro,
                numero: data.numero,
                complemento: data.complemento,
                password: null,
                type: 'PATIENT',
                cpf: data.cpf,
                rg: data.rg,
                profession: data.profession,
                bloodType: finalBloodType,
                dateOfBirth: data.dateOfBirth,
            },
        });
        // 2) Gera o recordNumber (prontuário)
        const recordNumber = 'PRT-' + Date.now().toString();
        // 3) Cria o prontuário associado ao paciente
        yield prisma_client_1.prisma.medicalRecord.create({
            data: {
                recordNumber,
                patientId: patient.id,
            },
        });
        // 4) Envia e-mail para criação de senha
        yield (0, sendgrid_1.sendPasswordCreationEmail)(patient.email, patient.id);
        return patient;
    });
}
