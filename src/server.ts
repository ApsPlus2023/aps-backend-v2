import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerRoutes } from './application/routes/index';
import { env } from './application/config/env'; // ou onde você define sua secret

const app = fastify();

// Registra o cookie
app.register(cookie, {
  secret: 'V`cW_WcXY',
  parseOptions: {}
});

// Registra o JWT para usar cookies
app.register(jwt, {
  secret: env.JWT_SECRET, // sua secret definida no env
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  sign: {
    expiresIn: '1d',
  },
});

// Registra as rotas (incluindo login, profile, etc.)
registerRoutes(app);

app.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
});

app.listen({ port: 3030 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em http://localhost:3030`);
});
