import { prisma } from '../infrastructure/database/prisma-client';
import { sendPasswordCreationEmail } from '../infrastructure/email/sendgrid';

interface CreatePatientInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  cpf: string;
  rg?: string;
  profession?: string;
  bloodType?: string;
  dateOfBirth?: Date;
}

function mapBloodType(
  value: string
):
  | 'O_PLUS'
  | 'O_MINUS'
  | 'A_PLUS'
  | 'A_MINUS'
  | 'B_PLUS'
  | 'B_MINUS'
  | 'AB_PLUS'
  | 'AB_MINUS'
{
  switch (value) {
    case 'O+':
      return 'O_PLUS';
    case 'O-':
      return 'O_MINUS';
    case 'A+':
      return 'A_PLUS';
    case 'A-':
      return 'A_MINUS';
    case 'B+':
      return 'B_PLUS';
    case 'B-':
      return 'B_MINUS';
    case 'AB+':
      return 'AB_PLUS';
    case 'AB-':
      return 'AB_MINUS';
    default:
      throw new Error(`Tipo sanguíneo inválido: ${value}`);
  }
}

export async function createPatient(data: CreatePatientInput) {
  const finalBloodType = data.bloodType
    ? mapBloodType(data.bloodType)
    : null as any;

  // 1) Cria o paciente
  const patient = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: null,
      type: 'PATIENT',
      cpf: data.cpf,
      rg: data.rg,
      profession: data.profession,
      bloodType: finalBloodType,
      dateOfBirth: data.dateOfBirth,
    },
  });

  // 2) Cria recordNumber
  const recordNumber = 'PRT-' + Date.now().toString();

  // 3) Cria prontuário
  await prisma.medicalRecord.create({
    data: {
      recordNumber,
      patientId: patient.id,
    },
  });

  // 4) Email de criação de senha
  await sendPasswordCreationEmail(patient.email, patient.id);

  return patient;
}
