import { StudentRepository } from "../student/repository/StudentRepository.js";
import { PredictionService } from "../analytics/service/prediction.js";

export const PeerContextService = {
  async getPeerAverage(studentId) {
    const student = await StudentRepository.getById(studentId);
    if (!student) return null;

    const studentPace = await PredictionService.getPace(studentId);
    const classmates = await StudentRepository.findByClass(student.kelas);

    if (classmates.length <= 1) {
      return {
        studentPace,
        classAverage: studentPace,
        comparisonText: "Kadar tasmik anda konsisten dengan sasaran."
      };
    }

    let totalPace = 0;
    let validCount = 0;

    for (const mate of classmates) {
      const pace = await PredictionService.getPace(mate.id);
      totalPace += pace;
      validCount++;
    }

    const classAverage = Math.round((totalPace / validCount) * 10) / 10;
    
    const diff = Math.round((studentPace - classAverage) * 10) / 10;
    let comparisonText;
    if (diff > 2) {
      comparisonText = `${studentPace} m.s./bulan (Sangat Pantas vs Purata Kelas ${classAverage} m.s.) 🚀`;
    } else if (diff > 0) {
      comparisonText = `${studentPace} m.s./bulan (Lebih Laju vs Purata Kelas ${classAverage} m.s.) 👍`;
    } else if (diff < -2) {
      comparisonText = `${studentPace} m.s./bulan (Perlu Perhatian vs Purata Kelas ${classAverage} m.s.) ⚠️`;
    } else {
      comparisonText = `${studentPace} m.s./bulan (Sama Rata vs Purata Kelas ${classAverage} m.s.)`;
    }

    return {
      studentPace,
      classAverage,
      comparisonText
    };
  }
};
