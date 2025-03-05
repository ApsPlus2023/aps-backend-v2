import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerRoutes } from './application/routes/index';
import { env } from './application/config/env';

const app = fastify();

app.register(cookie, {
  secret: 'V`cW_WcXY',
  parseOptions: {}
});

app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false,
  },
  sign: {
    expiresIn: '1d',
  },
});

registerRoutes(app);

app.register(cors, {
  origin: [
    'https://aps-frontend-v2-dq9o.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
});

const port = process.env.PORT || 3030;

app.listen({ port: 3030, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em ${address}`);
});
