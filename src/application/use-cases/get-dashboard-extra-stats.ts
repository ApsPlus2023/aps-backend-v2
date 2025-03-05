import { prisma } from "../infrastructure/database/prisma-client";

export async function getDashboardExtraStats() {
  const today = new Date();
  
  // Definir o início e o fim do mês atual
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  // Atendimentos do mês atual
  const atendimentosMes = await prisma.consultation.findMany({
    where: { scheduledAt: { gte: startMonth, lt: endMonth } },
    select: { id: true, scheduledAt: true, jitsiLink: true },
  });
  
  // Produtividade: % de teleconsultas no mês
  const totalConsultationsMes = atendimentosMes.length;
  const teleConsultationsMes = atendimentosMes.filter(c => c.jitsiLink !== null).length;
  const produtividade = totalConsultationsMes > 0 ? (teleConsultationsMes / totalConsultationsMes) * 100 : 0;
  
  // Total de consultas agendadas do dia
  const startToday = new Date(today);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(today);
  endToday.setHours(23, 59, 59, 999);
  const totalConsultasHoje = await prisma.consultation.count({
    where: { scheduledAt: { gte: startToday, lte: endToday } }
  });
  
  // Médicos com maior taxa de teleconsultas no mês
  const medicos = await prisma.user.findMany({
    where: { type: "EMPLOYEE", employeeRole: "MEDICO" },
    select: { id: true, name: true, profilePhoto: true }
  });
  
  const medicosTaxa = await Promise.all(medicos.map(async (medico) => {
    const total = await prisma.consultation.count({
      where: {
        doctorId: medico.id,
        scheduledAt: { gte: startMonth, lt: endMonth }
      }
    });
    const tele = await prisma.consultation.count({
      where: {
        doctorId: medico.id,
        jitsiLink: { not: null },
        scheduledAt: { gte: startMonth, lt: endMonth }
      }
    });
    const taxa = total > 0 ? (tele / total) * 100 : 0;
    return {
      id: medico.id,
      name: medico.name,
      profilePhoto: medico.profilePhoto,
      totalConsultations: total,
      taxaTeleconsultas: taxa
    };
  }));
  medicosTaxa.sort((a, b) => b.taxaTeleconsultas - a.taxaTeleconsultas);
  const medicosMaiorTaxaTeleconsultas = medicosTaxa.slice(0, 3);
  
  // Últimos 5 pacientes cadastrados: retornar nome e data de cadastro (formatada)
  const ultimos5PacientesRaw = await prisma.user.findMany({
    where: { type: "PATIENT" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, createdAt: true }
  });
  
  const ultimos5Pacientes = ultimos5PacientesRaw.map(patient => ({
    id: patient.id,
    name: patient.name,
    dataCadastro: patient.createdAt.toLocaleDateString("pt-BR")
  }));
  
  return {
    atendimentosMes,
    produtividade,
    totalConsultasHoje,
    medicosMaiorTaxaTeleconsultas,
    ultimos5Pacientes
  };
}
