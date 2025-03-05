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
const fastify_1 = __importDefault(require("fastify"));
const auth_routes_1 = require("../application/infrastructure/http/routes/auth-routes");
const supertest_1 = __importDefault(require("supertest"));
const app = (0, fastify_1.default)();
app.register(auth_routes_1.authRoutes);
jest.setTimeout(15000);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.ready();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield app.close();
}));
describe('POST /login', () => {
    it('deve retornar um token para credenciais válidas', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app.server)
            .post('/login')
            .send({ email: 'user@example.com', password: 'senha_valida' });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    }));
    it('deve retornar erro para credenciais inválidas', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app.server)
            .post('/login')
            .send({ email: 'user@example.com', password: 'senha_incorreta' });
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Senha inválida');
    }));
});
