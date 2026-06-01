import { StudentRepository } from "../student/repository/StudentRepository.js";
import { MaqraGridService } from "../maqra/service/MaqraGridService.js";
import { PredictionService } from "../analytics/service/prediction.js";
import { getJuzukPages } from "../maqra/domain/pageMapping.js";

export const ClassViewService = {
  async getClassCohortHeatmap(className) {
    const students = await StudentRepository.findByClass(className);
    const heatmap = [];

    const memorizedKeys = ["hafazan", "talaqqi", "murajaah", "syahadah", "iqra", "tilawah"];

    for (const student of students) {
      const grid = await MaqraGridService.getGridForStudent(student.id);
      const pace = await PredictionService.getPace(student.id);
      const target = student.target || 15;
      
      // Calculate completion percentage for each of the 30 juz'
      const juzukCompletions = [];
      for (let j = 1; j <= 30; j++) {
        const [start, end] = getJuzukPages(j);
        const totalPages = end - start + 1;
        let memCount = 0;
        
        for (let p = start; p <= end; p++) {
          if (memorizedKeys.includes(grid.statusMap[p])) {
            memCount++;
          }
        }
        
        const completionPct = Math.round((memCount / totalPages) * 100);
        juzukCompletions.push(completionPct);
      }

      // Count total memorized pages
      let totalMemorized = 0;
      for (let p = 1; p <= 604; p++) {
        if (memorizedKeys.includes(grid.statusMap[p])) {
          totalMemorized++;
        }
      }

      const onTrack = pace >= target;

      heatmap.push({
        studentId: student.id,
        name: student.name,
        frontier: grid.frontier,
        totalMemorized,
        pace,
        target,
        status: onTrack ? "on-track" : "behind",
        juzukCompletions
      });
    }

    return heatmap;
  }
};
