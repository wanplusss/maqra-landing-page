import { SchoolRepository } from "../school/repository/SchoolRepository.js";
import { IS_SUPABASE_CONFIGURED } from "../../backend/supabase/config.js";
import { supabaseAdapter } from "../../backend/supabase/supabaseAdapter.js";

export const SuperAdminService = {
  async getPlatformDashboardData() {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getSchoolStats();
    }
    const schools = await SchoolRepository.listAllSchools();
    return schools.map((sch) => ({
      slug: sch.slug,
      name: sch.name,
      city: sch.city || "Selangor",
      students: sch.students || 6,
      teachers: sch.teachers || 3,
      avgProg: sch.avgProg || 45.2,
      plan: sch.plan || "Premium",
      status: sch.status || "aktif",
      since: sch.since || "2024"
    }));
  }
};
