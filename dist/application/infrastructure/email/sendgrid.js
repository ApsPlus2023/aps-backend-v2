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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordCreationEmail = sendPasswordCreationEmail;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
    throw new Error("A variável de ambiente SENDGRID_API_KEY não está definida.");
}
mail_1.default.setApiKey(SENDGRID_API_KEY);
const SENDGRID_FROM_EMAIL = (_a = process.env.SENDGRID_FROM_EMAIL) !== null && _a !== void 0 ? _a : '';
if (!SENDGRID_FROM_EMAIL) {
    throw new Error("A variável de ambiente SENDGRID_FROM_EMAIL não está definida.");
}
function sendPasswordCreationEmail(email, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `https://aps-frontend-v2-dq9o.vercel.app/criar-senha?userId=${userId}`;
        const msg = {
            to: email,
            from: { email: SENDGRID_FROM_EMAIL, name: "APS Plus" },
            subject: 'Crie sua senha no APS Plus',
            text: `Olá, acesse o link para criar sua senha: ${link}`,
            html: `<p>Olá, acesse o link para criar sua senha: <a href="${link}">Criar Senha</a></p>`,
        };
        try {
            yield mail_1.default.send(msg);
            console.log(`E-mail de criação de senha enviado para: ${email}`);
        }
        catch (error) {
            console.error('Erro ao enviar e-mail:', error);
        }
    });
}
