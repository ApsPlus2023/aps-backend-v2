import { FastifyInstance } from 'fastify';
import { authRoutes } from '../infrastructure/http/routes/auth-routes';
import { employeeRoutes } from '../infrastructure/http/routes/employee-routes';
import { patientRoutes } from '../infrastructure/http/routes/patient-routes';
import { logoutRoutes } from '../infrastructure/http/routes/logout-routes';
import { updatePasswordRoutes } from '../infrastructure/http/routes/update-password'
import { medicalRecordRoutes } from '../infrastructure/http/routes/medical-record-routes'
import { userRoutes } from '../infrastructure/http/routes/user-routes'
import { consultationRoutes } from '../infrastructure/http/routes/consultation-routes'
import { profileRoutes } from '../infrastructure/http/routes/profile-routes'
import { profileGeneralRoutes } from '../infrastructure/http/routes/profile-general'
import { dashboardStatsRoutes } from '../infrastructure/http/routes/dashboard-stats'
import { employeeDetailRoutes } from '../infrastructure/http/routes/employee-detail'
import { consultationsByMonthRoutes } from "../infrastructure/http/routes/consultations-by-month";
import {dashboardExtraStatsRoutes  } from '../infrastructure/http/routes/dashboard-extra-stats'
import { changePasswordRoutes  } from '../infrastructure/http/routes/change-password-routes'

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes);
  app.register(employeeRoutes);
  app.register(patientRoutes);
  app.register(logoutRoutes);
  app.register(updatePasswordRoutes);
  app.register(medicalRecordRoutes);
  app.register(userRoutes);
  app.register(profileRoutes);
  app.register(consultationRoutes);
  app.register(profileGeneralRoutes);
  app.register(dashboardStatsRoutes);
  app.register(employeeDetailRoutes);
  app.register(consultationsByMonthRoutes);
  app.register(dashboardExtraStatsRoutes);
  app.register(changePasswordRoutes);
}
