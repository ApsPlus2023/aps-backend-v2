import { prisma } from '../infrastructure/database/prisma-client';
import { sendPasswordCreationEmail } from '../infrastructure/email/sendgrid';

interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  employeeRole: string; // cargo, por exemplo: "Médico", "Enfermeiro", etc.
  hireDate: Date;
  workDays: string;
  profilePhoto?: string;
  address: string;
}

/**
 * Converte o valor de cargo recebido para o valor do enum EmployeeRole.
 */
function mapEmployeeRole(
  role: string
): 'ENFERMEIRO' | 'MEDICO' | 'ADMINISTRADOR' | 'ATENDENTE' {
  switch (role.toLowerCase()) {
    case 'médico':
    case 'medico':
      return 'MEDICO';
    case 'enfermeiro':
      return 'ENFERMEIRO';
    case 'administrador':
      return 'ADMINISTRADOR';
    case 'atendente':
      return 'ATENDENTE';
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
      type: 'EMPLOYEE',
      employeeRole: mapEmployeeRole(data.employeeRole),
      hireDate: data.hireDate,
      workDays: data.workDays,
      profilePhoto: data.profilePhoto,
      address: data.address,
      password: null,
    },
  });

  await sendPasswordCreationEmail(employee.email, employee.id);

  return employee;
}
