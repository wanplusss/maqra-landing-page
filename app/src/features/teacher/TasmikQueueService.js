import { StudentRepository } from "../student/repository/StudentRepository.js";
import { TasmikRepository } from "../tasmik/repository/TasmikRepository.js";
import { AnalyticsService } from "../analytics/service/AnalyticsService.js";

export const TasmikQueueService = {
  async getTasmikQueue() {
    const students = await StudentRepository.listAll();
    const queue = [];

    for (const student of students) {
      const recentRecs = await TasmikRepository.getRecentActivity(student.id, 1);
      const lastTasmikDate = recentRecs.length > 0 ? recentRecs[0].date : "Tiada Rekod";

      const decayScores = await AnalyticsService.getDecayScores(student.id);
      
      // Find the weakest score (the lowest strength value)
      let weakestScore = 100;
      let weakestJuz = student.juzuk || 1;

      for (const juzStr in decayScores) {
        const score = decayScores[juzStr];
        if (score < weakestScore) {
          weakestScore = score;
          weakestJuz = parseInt(juzStr);
        }
      }

      // If they have no memorized juzuk scores, they default to 100 strength
      if (Object.keys(decayScores).length === 0) {
        weakestScore = 100;
      }

      queue.push({
        studentId: student.id,
        name: student.name,
        kelas: student.kelas,
        page: student.frontier,
        juzNumber: weakestJuz,
        priorityScore: weakestScore,
        lastTasmikDate
      });
    }

    // Sort by priorityScore ascending (weakest first = highest urgency!)
    return queue.sort((a, b) => a.priorityScore - b.priorityScore);
  }
};
