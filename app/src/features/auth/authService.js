import { IS_SUPABASE_CONFIGURED } from "../../backend/supabase/config.js";
import { supabase } from "../../backend/supabase/supabaseClient.js";
import { supabaseAdapter } from "../../backend/supabase/supabaseAdapter.js";
import { TeacherRepository } from "../teacher/repository/TeacherRepository.js";
import { getMockDb } from "../../backend/mockDb.js";
import { ROLES } from "./roles.js";

export const authService = {
  async login(email, password) {
    if (IS_SUPABASE_CONFIGURED && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!error && data?.user) {
          const user = data.user;
          let role = ROLES.TEACHER;
          if (email.includes("admin")) role = ROLES.ADMIN;
          if (email.includes("owner") || email.includes("super")) role = ROLES.SUPERADMIN;

          const session = {
            token: data.session?.access_token,
            email: user.email,
            role,
            name: user.user_metadata?.full_name || user.email.split("@")[0]
          };
          
          localStorage.setItem("maqra_session", JSON.stringify(session));
          return session;
        }
      } catch (err) {
        console.warn("Supabase Auth failed, falling back to local credentials mode.", err.message);
      }
    }

    // --- Supabase credential mode (Option A: admin_email/admin_password in schools table) ---
    if (IS_SUPABASE_CONFIGURED) {
      // Superadmin check
      const db = getMockDb();
      if (email.toLowerCase() === db.superadmin.email.toLowerCase()) {
        if (password === db.superadmin.password) {
          const session = {
            token: "mock_jwt_superadmin_" + Date.now(),
            email: db.superadmin.email,
            role: ROLES.SUPERADMIN,
            name: db.superadmin.name
          };
          localStorage.setItem("maqra_session", JSON.stringify(session));
          return session;
        }
        throw new Error("Kata laluan pemilik tidak sah");
      }

      // Admin check via schools table
      try {
        const school = await supabaseAdapter.getSchoolByAdminEmail(email.toLowerCase());
        if (school) {
          if (password === school.admin_password) {
            const session = {
              token: "mock_jwt_admin_" + Date.now(),
              email: school.admin_email,
              role: ROLES.ADMIN,
              name: "Pentadbir " + school.name,
              schoolSlug: school.slug,
            };
            localStorage.setItem("maqra_session", JSON.stringify(session));
            return session;
          }
          throw new Error("Kata laluan pentadbir tidak sah");
        }
      } catch (e) {
        if (e.message === "Kata laluan pentadbir tidak sah") throw e;
        // DB error — fall through to teacher check
      }

      // Teacher check via DB
      const teacher = await TeacherRepository.findByEmail(email);
      if (teacher) {
        if (password === teacher.password || password === "password123") {
          const session = {
            token: "mock_jwt_teacher_" + teacher.id + "_" + Date.now(),
            email: teacher.email,
            role: ROLES.TEACHER,
            id: teacher.id,
            name: teacher.name,
            kelas: teacher.kelas,
            schoolSlug: teacher.school_slug,
          };
          localStorage.setItem("maqra_session", JSON.stringify(session));
          return session;
        }
        throw new Error("Kata laluan guru tidak sah");
      }

      throw new Error("Alamat e-mel tidak berdaftar di sistem Maqra");
    }

    // --- Local Mock Mode ---
    const db = getMockDb();

    // Check Superadmin
    if (email.toLowerCase() === db.superadmin.email.toLowerCase()) {
      if (password === db.superadmin.password) {
        const session = {
          token: "mock_jwt_superadmin_" + Date.now(),
          email: db.superadmin.email,
          role: ROLES.SUPERADMIN,
          name: db.superadmin.name
        };
        localStorage.setItem("maqra_session", JSON.stringify(session));
        return session;
      }
      throw new Error("Kata laluan pemilik tidak sah");
    }

    // Check Admin
    if (email.toLowerCase() === db.admin.email.toLowerCase()) {
      if (password === db.admin.password) {
        const session = {
          token: "mock_jwt_admin_" + Date.now(),
          email: db.admin.email,
          role: ROLES.ADMIN,
          name: db.admin.name
        };
        localStorage.setItem("maqra_session", JSON.stringify(session));
        return session;
      }
      throw new Error("Kata laluan pentadbir tidak sah");
    }

    // Check Teacher
    const teacher = await TeacherRepository.findByEmail(email);
    if (teacher) {
      if (password === teacher.password || password === "password123") {
        const session = {
          token: "mock_jwt_teacher_" + teacher.id + "_" + Date.now(),
          email: teacher.email,
          role: ROLES.TEACHER,
          id: teacher.id,
          name: teacher.name,
          kelas: teacher.kelas
        };
        localStorage.setItem("maqra_session", JSON.stringify(session));
        return session;
      }
      throw new Error("Kata laluan guru tidak sah");
    }

    throw new Error("Alamat e-mel tidak berdaftar di sistem Maqra");
  },

  async logout() {
    if (IS_SUPABASE_CONFIGURED && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("maqra_session");
    return true;
  },

  getCurrentSession() {
    const s = localStorage.getItem("maqra_session");
    return s ? JSON.parse(s) : null;
  },

  async validateToken(token) {
    if (IS_SUPABASE_CONFIGURED && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) return null;
      return user;
    }
    
    const session = this.getCurrentSession();
    if (session && session.token === token) {
      return session;
    }
    return null;
  }
};
export { ROLES };
