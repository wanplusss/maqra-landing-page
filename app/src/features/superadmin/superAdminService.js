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
      since: sch.since || "2024",
    }));
  },

  async getActivityData() {
    if (!IS_SUPABASE_CONFIGURED) return {};
    return await supabaseAdapter.getLastTasmikPerSchool();
  },

  async getGrowthData() {
    if (!IS_SUPABASE_CONFIGURED) {
      const now = new Date();
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        return {
          month: d.toISOString().slice(0, 7),
          count: Math.floor(Math.random() * 15) + 3,
        };
      });
    }
    return await supabaseAdapter.getTasmikGrowthByMonth();
  },

  async updateSchool(slug, updates) {
    if (!IS_SUPABASE_CONFIGURED) return;
    return await supabaseAdapter.updateSchool(slug, updates);
  },
};
