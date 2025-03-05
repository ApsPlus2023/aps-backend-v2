"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_routes_1 = require("../infrastructure/http/routes/auth-routes");
const employee_routes_1 = require("../infrastructure/http/routes/employee-routes");
const patient_routes_1 = require("../infrastructure/http/routes/patient-routes");
const logout_routes_1 = require("../infrastructure/http/routes/logout-routes");
const update_password_1 = require("../infrastructure/http/routes/update-password");
const medical_record_routes_1 = require("../infrastructure/http/routes/medical-record-routes");
const user_routes_1 = require("../infrastructure/http/routes/user-routes");
const consultation_routes_1 = require("../infrastructure/http/routes/consultation-routes");
const profile_routes_1 = require("../infrastructure/http/routes/profile-routes");
const profile_general_1 = require("../infrastructure/http/routes/profile-general");
const dashboard_stats_1 = require("../infrastructure/http/routes/dashboard-stats");
const employee_detail_1 = require("../infrastructure/http/routes/employee-detail");
const consultations_by_month_1 = require("../infrastructure/http/routes/consultations-by-month");
const dashboard_extra_stats_1 = require("../infrastructure/http/routes/dashboard-extra-stats");
function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.register(auth_routes_1.authRoutes);
        app.register(employee_routes_1.employeeRoutes);
        app.register(patient_routes_1.patientRoutes);
        app.register(logout_routes_1.logoutRoutes);
        app.register(update_password_1.updatePasswordRoutes);
        app.register(medical_record_routes_1.medicalRecordRoutes);
        app.register(user_routes_1.userRoutes);
        app.register(profile_routes_1.profileRoutes);
        app.register(consultation_routes_1.consultationRoutes);
        app.register(profile_general_1.profileGeneralRoutes);
        app.register(dashboard_stats_1.dashboardStatsRoutes);
        app.register(employee_detail_1.employeeDetailRoutes);
        app.register(consultations_by_month_1.consultationsByMonthRoutes);
        app.register(dashboard_extra_stats_1.dashboardExtraStatsRoutes);
    });
}
