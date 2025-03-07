import { FastifyInstance } from 'fastify';
import { prisma } from '../../../infrastructure/database/prisma-client';

export async function consultationRoutes(fastify: FastifyInstance) {
  fastify.post('/consultations', async (request, reply) => {
    try {
      const { patientId, scheduledAt, doctorId } = request.body as {
        patientId: string;
        scheduledAt: string;
        doctorId?: string;
      };

      const patient = await prisma.user.findUnique({ where: { id: patientId } });
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente não encontrado' });
      }
      if (patient.type !== 'PATIENT') {
        return reply.status(400).send({ error: 'Usuário não é do tipo PATIENT' });
      }

      const jitsiRoom = `meet-${Math.floor(Math.random() * 100000)}`;
      const jitsiLink = `https://meet.jit.si/${jitsiRoom}`;

      const [datePart, timePart] = scheduledAt.split(' ');
      const newDate = new Date(`${datePart}T${timePart}:00.000Z`);

      const created = await prisma.consultation.create({
        data: {
          patientId,
          scheduledAt: newDate,
          jitsiLink,
          doctorId: doctorId || null,
        },
      });

      return reply.status(201).send(created);
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: 'Erro ao criar consulta' });
    }
  });

  fastify.delete('/consultations/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const existing = await prisma.consultation.findUnique({ where: { id } });
      if (!existing) {
        return reply.status(404).send({ error: 'Consulta não encontrada' });
      }

      await prisma.consultation.update({
        where: { id },
        data: { canceled: true },
      });

      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: 'Erro ao cancelar consulta' });
    }
  });

  fastify.get('/consultations', async (request, reply) => {
    try {
      const { patientId } = request.query as { patientId?: string };

      const whereClause = patientId ? { patientId, canceled: false } : { canceled: false };

      const consultations = await prisma.consultation.findMany({
        where: whereClause,
        include: {
          patient: { select: { id: true, name: true } },
          doctor: { select: { id: true, name: true } },
        },
      });

      const result = consultations.map((cons) => {
        const d = cons.scheduledAt;
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const hours = String(d.getUTCHours()).padStart(2, '0');
        const mins = String(d.getUTCMinutes()).padStart(2, '0');
        const rawFormatted = `${year}-${month}-${day} ${hours}:${mins}`;
        const displayFormatted = `${day}/${month}/${year} ${hours}:${mins}`;

        return {
          id: cons.id,
          scheduledAt: rawFormatted,
          scheduledAtFormatted: displayFormatted,
          patientId: cons.patientId,
          patientName: cons.patient?.name ?? 'Paciente',
          doctorId: cons.doctor?.id ?? null,
          doctorName: cons.doctor?.name ?? null,
          jitsiLink: cons.jitsiLink,
          canceled: cons.canceled,
        };
      });

      return reply.send({ consultations: result });
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: 'Erro ao buscar consultas' });
    }
  });
}
