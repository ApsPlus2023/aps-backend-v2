import { prisma } from "../infrastructure/database/prisma-client";

export async function getConsultationsByMonth() {
  const today = new Date();
  // Define o início como o primeiro dia do mês de 6 meses atrás (incluindo o mês atual)
  const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  // Consulta agrupada pelo mês usando a extração do número do mês
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
