import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { StudentRepository } from "../student/repository/StudentRepository.js";
import { MaqraGridService } from "../maqra/service/MaqraGridService.js";

export const SuperAdminService = {
  async getPlatformDashboardData() {
    const schools = await SchoolRepository.listAllSchools();
    
    // For local mode, we aggregate statistics from the mock db
    // For live Supabase, we would pull from a scoped RPC or view.
    return schools.map((sch) => {
      // Make it slightly dynamic using mock averages
      return {
        slug: sch.slug,
        name: sch.name,
        city: sch.city || "Selangor",
        students: sch.students || 6,
        teachers: sch.teachers || 3,
        avgProg: sch.avgProg || 45.2,
        plan: sch.plan || "Premium",
        status: sch.status || "aktif",
        since: sch.since || "2024"
      };
    });
  }
};
