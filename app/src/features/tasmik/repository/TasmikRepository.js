import { IS_SUPABASE_CONFIGURED } from "../../../backend/supabase/config.js";
import { supabaseAdapter } from "../../../backend/supabase/supabaseAdapter.js";
import { getMockDb, saveMockDb } from "../../../backend/mockDb.js";

export const TasmikRepository = {
  async saveRecord(record) {
    if (IS_SUPABASE_CONFIGURED) {
      const full = {
        id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        date: new Date().toISOString(),
        ...record,
      };
      return await supabaseAdapter.saveTasmikRecord(full);
    }
    const db = getMockDb();
    const newRecord = {
      id: "rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      date: new Date().toISOString(),
      ...record
    };
    db.tasmik_records.push(newRecord);
    saveMockDb(db);
    return newRecord;
  },

  async getRecordsForStudent(studentId) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getTasmikRecordsForStudent(studentId);
    }
    const db = getMockDb();
    return db.tasmik_records
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getRecordByPage(studentId, page) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getTasmikRecordByPage(studentId, page);
    }
    const db = getMockDb();
    return db.tasmik_records
      .filter((r) => r.studentId === studentId && r.to === page)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
  },

  async getRecentActivity(studentId, limit = 10) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getRecentTasmikActivity(studentId, limit);
    }
    const db = getMockDb();
    let records = db.tasmik_records;
    if (studentId) {
      records = records.filter((r) => r.studentId === studentId);
    }
    return records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  async deleteRecord(id) {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.deleteTasmikRecord(id);
    }
    const db = getMockDb();
    const filtered = db.tasmik_records.filter(r => r.id !== id);
    if (filtered.length === db.tasmik_records.length) throw new Error("Record not found");
    db.tasmik_records = filtered;
    saveMockDb(db);
    return true;
  },

  async getMonthlyThroughput() {
    if (IS_SUPABASE_CONFIGURED) {
      return await supabaseAdapter.getMonthlyTasmikThroughput();
    }
    const db = getMockDb();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return db.tasmik_records.filter(
      (r) => new Date(r.date) >= thirtyDaysAgo
    );
  }
};
