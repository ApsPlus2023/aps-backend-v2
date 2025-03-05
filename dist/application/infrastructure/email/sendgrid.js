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
exports.sendPasswordCreationEmail = sendPasswordCreationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
function sendPasswordCreationEmail(email, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `https://aps-frontend-v2-dq9o.vercel.app/criar-senha?userId=${userId}`;
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Crie sua senha no APS Plus',
            text: `Olá, acesse o link para criar sua senha: ${link}`,
            html: `<p>Olá, acesse o link para criar sua senha: <a href="${link}">Criar Senha</a></p>`,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log('E-mail de criação de senha enviado para:', email, info.response);
        }
        catch (error) {
            console.error('Erro ao enviar e-mail:', error);
        }
    });
}
