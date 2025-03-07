import { prisma } from '../infrastructure/database/prisma-client';

export async function deleteCancelledConsultations() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count } = await prisma.consultation.deleteMany({
      where: {
        canceled: true,
        updatedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`Deleted ${count} cancelled consultations older than 30 days.`);
    return count;
  } catch (error) {
    console.error("Error deleting cancelled consultations:", error);
    throw error;
  }
}
