"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const index_1 = require("./application/routes/index");
const env_1 = require("./application/config/env");
const app = (0, fastify_1.default)();
app.register(cookie_1.default, {
    secret: 'V`cW_WcXY',
    parseOptions: {}
});
app.register(jwt_1.default, {
    secret: env_1.env.JWT_SECRET,
    cookie: {
        cookieName: 'token',
        signed: false,
    },
    sign: {
        expiresIn: '1d',
    },
});
(0, index_1.registerRoutes)(app);
app.register(cors_1.default, {
    origin: 'https://aps-frontend-v2-dq9o.vercel.app',
    credentials: true,
});
app.listen({ port: 3030 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando em http://localhost:3030`);
});
