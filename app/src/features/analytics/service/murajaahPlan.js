import { TasmikRepository } from "../../tasmik/repository/TasmikRepository.js";
import { StudentRepository } from "../../student/repository/StudentRepository.js";
import { getJuzukPages } from "../../maqra/domain/pageMapping.js";

export const MurajaahPlan = {
  async getMurajaahPlan(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) return [];

    const records = await TasmikRepository.getRecordsForStudent(studentId);
    const today = new Date(2026, 4, 30); // system Baseline Date

    const plan = [];

    // Loop through each of the 30 juz'
    for (let j = 1; j <= 30; j++) {
      const [startPage, endPage] = getJuzukPages(j);
      
      // If student hasn't memorized or started this juz yet, skip it or mark it as unstarted
      if (student.frontier < startPage) {
        continue;
      }

      // Filter records within this juzuk
      const juzRecords = records.filter(
        (r) => (r.from >= startPage && r.from <= endPage) || (r.to >= startPage && r.to <= endPage)
      );

      let strength = 30; // base strength for memorized but un-murajaah-ed
      let lastRevised = "Tiada Rekod";
      let totalRevisions = 0;

      if (juzRecords.length > 0) {
        // Sort newest first
        const sortedJuzRecs = [...juzRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = sortedJuzRecs[0];
        const latestDate = new Date(latest.date);
        
        const daysSince = Math.max(0, (today - latestDate) / (1000 * 60 * 60 * 24));
        totalRevisions = juzRecords.length;

        // Exponential decay algorithm: halflife of ~30 days
        const baseDecay = 100 * Math.exp(-0.02 * daysSince);
        
        // Grade bonuses
        let gradeBonus = 0;
        if (latest.gred === "Mumtaz") gradeBonus = 15;
        else if (latest.gred === "Jayyid Jiddan") gradeBonus = 10;
        else if (latest.gred === "Jayyid") gradeBonus = 5;
        else if (latest.gred === "Maqbul") gradeBonus = -10;

        strength = Math.min(100, Math.max(5, Math.round(baseDecay + gradeBonus)));
        
        // Format relative date
        if (daysSince === 0) lastRevised = "Hari ini";
        else if (daysSince === 1) lastRevised = "Semalam";
        else lastRevised = `${Math.floor(daysSince)} hari lepas`;
      }

      plan.push({
        juzuk: j,
        pages: `${startPage} - ${endPage}`,
        strength,
        lastRevised,
        totalRevisions,
        status: strength > 75 ? "Kuat" : strength > 45 ? "Sederhana" : "Lemah"
      });
    }

    // Sort by strength ascending (weakest first - needs revision most)
    return plan.sort((a, b) => a.strength - b.strength);
  },

  async getDecayScores(studentId) {
    const plan = await this.getMurajaahPlan(studentId);
    // returns mapping of juzNumber -> strength
    const scores = {};
    plan.forEach((p) => {
      scores[p.juzuk] = p.strength;
    });
    return scores;
  }
};

export const getMurajaahPlan = MurajaahPlan.getMurajaahPlan.bind(MurajaahPlan);
export const getDecayScores = MurajaahPlan.getDecayScores.bind(MurajaahPlan);
