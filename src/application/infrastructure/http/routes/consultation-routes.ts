import { FastifyInstance } from 'fastify';
import { prisma } from '../../../infrastructure/database/prisma-client';

export async function consultationRoutes(fastify: FastifyInstance) {
  fastify.post('/consultations', async (request, reply) => {
    try {
      const {
        patientId,
        scheduledAt,
        doctorId,
        // Campos do SOAP (Subjetivo, Objetivo, Avaliação e Plano)
        motivoPrincipal,
        infoAdicionaisSubjetivo,
        alergias,
        pressaoSistolica,
        pressaoDiastolica,
        freqRespiratoria,
        freqCardiaca,
        perimetroCefalico,
        saturacaoOxigenio,
        circAbdominal,
        temperatura,
        glicemia,
        peso,
        altura,
        imc,
        problemasCondicoesCID,
        infoAdicionaisAvaliacao,
        solicitacaoExames,
        pedidoEncaminhamento,
        prescricaoManual,
        infoAdicionaisPlano,
        lembretes,
      } = request.body as {
        patientId: string;
        scheduledAt: string;
        doctorId?: string;
        motivoPrincipal?: string;
        infoAdicionaisSubjetivo?: string;
        alergias?: string;
        pressaoSistolica?: string;
        pressaoDiastolica?: string;
        freqRespiratoria?: string;
        freqCardiaca?: string;
        perimetroCefalico?: string;
        saturacaoOxigenio?: string;
        circAbdominal?: string;
        temperatura?: string;
        glicemia?: string;
        peso?: string;
        altura?: string;
        imc?: string;
        problemasCondicoesCID?: string;
        infoAdicionaisAvaliacao?: string;
        solicitacaoExames?: string;
        pedidoEncaminhamento?: string;
        prescricaoManual?: string;
        infoAdicionaisPlano?: string;
        lembretes?: string;
      };

      // Valida o paciente
      const patient = await prisma.user.findUnique({ where: { id: patientId } });
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente não encontrado' });
      }
      if (patient.type !== 'PATIENT') {
        return reply.status(400).send({ error: 'Usuário não é do tipo PATIENT' });
      }

      // Gera link para Jitsi
      const jitsiRoom = `meet-${Math.floor(Math.random() * 100000)}`;
      const jitsiLink = `https://meet.jit.si/${jitsiRoom}`;

      // Converte a data/hora informada
      const [datePart, timePart] = scheduledAt.split(' ');
      const newDate = new Date(`${datePart}T${timePart}:00.000Z`);

      // Cria a consulta
      const createdConsultation = await prisma.consultation.create({
        data: {
          patientId,
          scheduledAt: newDate,
          jitsiLink,
          doctorId: doctorId || null,
        },
      });

      // Obtém ou cria o prontuário do paciente
      let medicalRecord = await prisma.medicalRecord.findUnique({
        where: { patientId },
      });
      if (!medicalRecord) {
        const recordNumber = "PRT-" + Date.now().toString();
        medicalRecord = await prisma.medicalRecord.create({
          data: {
            patientId,
            recordNumber,
          },
        });
      }

      // Se houver algum campo do SOAP, cria o registro em SoapNote
      if (
        motivoPrincipal ||
        infoAdicionaisSubjetivo ||
        alergias ||
        pressaoSistolica ||
        pressaoDiastolica ||
        freqRespiratoria ||
        freqCardiaca ||
        perimetroCefalico ||
        saturacaoOxigenio ||
        circAbdominal ||
        temperatura ||
        glicemia ||
        peso ||
        altura ||
        imc ||
        problemasCondicoesCID ||
        infoAdicionaisAvaliacao ||
        solicitacaoExames ||
        pedidoEncaminhamento ||
        prescricaoManual ||
        infoAdicionaisPlano ||
        lembretes
      ) {
        await prisma.soapNote.create({
          data: {
            medicalRecordId: medicalRecord.id,
            chiefComplaint: motivoPrincipal,
            additionalInfo: infoAdicionaisSubjetivo,
            allergies: alergias,
            bloodPressureSystolic: pressaoSistolica ? parseInt(pressaoSistolica) : undefined,
            bloodPressureDiastolic: pressaoDiastolica ? parseInt(pressaoDiastolica) : undefined,
            respiratoryRate: freqRespiratoria ? parseInt(freqRespiratoria) : undefined,
            heartRate: freqCardiaca ? parseInt(freqCardiaca) : undefined,
            headCircumference: perimetroCefalico ? parseFloat(perimetroCefalico) : undefined,
            oxygenSaturation: saturacaoOxigenio ? parseFloat(saturacaoOxigenio) : undefined,
            abdominalCircumference: circAbdominal ? parseFloat(circAbdominal) : undefined,
            temperature: temperatura ? parseFloat(temperatura) : undefined,
            glycemia: glicemia ? parseFloat(glicemia) : undefined,
            weight: peso ? parseFloat(peso) : undefined,
            height: altura ? parseFloat(altura) : undefined,
            bmi: imc ? parseFloat(imc) : undefined,
            previousProblems: problemasCondicoesCID,
            additionalAssessment: infoAdicionaisAvaliacao,
            requestedExams: solicitacaoExames,
            referral: pedidoEncaminhamento,
            manualPrescription: prescricaoManual,
            planAdditionalInfo: infoAdicionaisPlano,
            reminders: lembretes,
          },
        });
      }

      return reply.status(201).send(createdConsultation);
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
