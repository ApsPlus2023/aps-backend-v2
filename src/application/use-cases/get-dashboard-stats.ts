import { prisma } from "../infrastructure/database/prisma-client";

export async function getDashboardStats() {
  const totalPatients = await prisma.user.count({
    where: { type: "PATIENT" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const totalConsultationsToday = await prisma.consultation.count({
    where: {
      scheduledAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newPatientsLast7Days = await prisma.user.count({
    where: {
      type: "PATIENT",
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  const canceledConsultations = await prisma.consultation.count({
    where: {
      canceled: true,
    },
  });

  return {
    totalPatients,
    totalConsultationsToday,
    newPatientsLast7Days,
    canceledConsultations,
  };
}
