import { prisma } from "../infrastructure/database/prisma-client";
import { sendPasswordCreationEmail } from "../infrastructure/email/sendgrid";

interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  employeeRole: string; // exemplo: "Médico", "Enfermeiro", etc.
  hireDate: Date;
  workDays: string;
  profilePhoto?: string;
  // Novos campos de endereço:
  cep?: string;
  rua?: string;
  bairro?: string;
  numero?: string;
  complemento?: string;
  coren?: string; // opcional para enfermeiros
  crm?: string;   // opcional para médicos
}

/**
 * Converte o valor de cargo recebido para o valor do enum EmployeeRole.
 */
function mapEmployeeRole(
  role: string
): "ENFERMEIRO" | "MEDICO" | "ADMINISTRADOR" | "ATENDENTE" {
  switch (role.toLowerCase()) {
    case "médico":
    case "medico":
      return "MEDICO";
    case "enfermeiro":
      return "ENFERMEIRO";
    case "administrador":
      return "ADMINISTRADOR";
    case "atendente":
      return "ATENDENTE";
    default:
      throw new Error(`Cargo inválido: ${role}`);
  }
}

export async function createEmployee(data: CreateEmployeeInput) {
  const employee = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: "EMPLOYEE",
      employeeRole: mapEmployeeRole(data.employeeRole),
      hireDate: data.hireDate,
      workDays: data.workDays,
      profilePhoto: data.profilePhoto,
      cep: data.cep,
      rua: data.rua,
      bairro: data.bairro,
      numero: data.numero,
      complemento: data.complemento,
      coren: data.coren,
      crm: data.crm,
      password: null,
    },
  });

  await sendPasswordCreationEmail(employee.email, employee.id);

  return employee;
}
