"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, email, phone, address, password, type, profilePhoto, cpf, rg, profession, bloodType, dateOfBirth, employeeRole, hireDate, workDays, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.password = password;
        this.type = type;
        this.profilePhoto = profilePhoto;
        this.cpf = cpf;
        this.rg = rg;
        this.profession = profession;
        this.bloodType = bloodType;
        this.dateOfBirth = dateOfBirth;
        this.employeeRole = employeeRole;
        this.hireDate = hireDate;
        this.workDays = workDays;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;
