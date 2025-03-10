import { prisma } from "../infrastructure/database/prisma-client";

interface PatientConsultationInfoInput {
  patientId: string;
}

export async function getPatientConsultationInfo({
  patientId,
}: PatientConsultationInfoInput) {

  const consultations = await prisma.consultation.findMany({
    where: {
      patientId,
      canceled: false,
    },
    include: {
      doctor: {
        select: { name: true, id: true },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });


  const lastConsultation = await prisma.consultation.findFirst({
    where: {
      patientId,
      canceled: false,
      scheduledAt: { lte: new Date() },
    },
    include: {
      doctor: { select: { name: true, id: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });

  let lastProfessional = null;
  if (lastConsultation?.doctor) {
    lastProfessional = lastConsultation.doctor.name;
  }

  const totalDone = await prisma.consultation.count({
    where: {
      patientId,
      canceled: false,
      scheduledAt: { lte: new Date() },
    },
  });

  return {
    consultations,
    lastConsultation,
    lastProfessional,
    totalDone,
  };
}
