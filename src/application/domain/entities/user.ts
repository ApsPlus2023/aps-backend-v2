export class User {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      public phone: string,
      public address: string,
      public password: string,
      public type: "EMPLOYEE" | "PATIENT",
      public profilePhoto?: string,
      public cpf?: string,
      public rg?: string,
      public profession?: string,
      public bloodType?: string,
      public dateOfBirth?: Date,
      public employeeRole?: "ENFERMEIRO" | "MEDICO" | "ADMINISTRADOR" | "ATENDENTE",
      public hireDate?: Date,
      public workDays?: string,
      public createdAt?: Date,
      public updatedAt?: Date
    ) {}
  }
  