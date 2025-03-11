-- CreateTable
CREATE TABLE "SoapNote" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chiefComplaint" TEXT,
    "additionalInfo" TEXT,
    "allergies" TEXT,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "respiratoryRate" INTEGER,
    "heartRate" INTEGER,
    "headCircumference" DOUBLE PRECISION,
    "oxygenSaturation" DOUBLE PRECISION,
    "abdominalCircumference" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "glycemia" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "previousProblems" TEXT,
    "additionalAssessment" TEXT,
    "requestedExams" TEXT,
    "referral" TEXT,
    "manualPrescription" TEXT,
    "planAdditionalInfo" TEXT,
    "reminders" TEXT,

    CONSTRAINT "SoapNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SoapNote" ADD CONSTRAINT "SoapNote_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
