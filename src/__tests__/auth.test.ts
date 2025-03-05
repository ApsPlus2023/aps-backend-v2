import fastify from 'fastify';
import { authRoutes } from '../application/infrastructure/http/routes/auth-routes';
import request from 'supertest';

const app = fastify();

app.register(authRoutes);

jest.setTimeout(15000);

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('POST /login', () => {
  it('deve retornar um token para credenciais válidas', async () => {
    const response = await request(app.server)
      .post('/login')
      .send({ email: 'user@example.com', password: 'senha_valida' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('deve retornar erro para credenciais inválidas', async () => {
    const response = await request(app.server)
      .post('/login')
      .send({ email: 'user@example.com', password: 'senha_incorreta' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Senha inválida');
  });
});
