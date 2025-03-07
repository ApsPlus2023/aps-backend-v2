import { prisma } from "../infrastructure/database/prisma-client";

export async function getConsultationsByMonth() {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  const result = await prisma.$queryRaw<
    { monthNumber: number; consultas: string }[]
  >`
    SELECT EXTRACT(MONTH FROM "scheduledAt") as "monthNumber", COUNT(*) as consultas
    FROM "Consultation"
    WHERE "scheduledAt" >= ${startDate}
    GROUP BY "monthNumber", date_trunc('month', "scheduledAt")
    ORDER BY date_trunc('month', "scheduledAt")
  `;

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  return result.map(item => ({
    month: monthNames[item.monthNumber - 1],
    consultas: Number(item.consultas)
  }));
}
