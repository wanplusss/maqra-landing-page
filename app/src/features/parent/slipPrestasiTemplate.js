export const slipPrestasiTemplate = {
  render(pdf, student, school, grid, prediction, tasmikLog) {
    const w = 210;
    const h = 297;

    // Outer border
    pdf.setDrawColor(47, 125, 87);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, w - 20, h - 20, "S");

    // Gold inner border
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(0.4);
    pdf.rect(12, 12, w - 24, h - 24, "S");

    // 1. School Letterhead Header
    pdf.setTextColor(47, 125, 87);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(school.name.toUpperCase(), w / 2, 26, { align: "center" });

    pdf.setTextColor(80, 80, 80);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(school.address, w / 2, 31, { align: "center" });
    pdf.text(`Tel: ${school.phone}   |   E-mel: ${school.email}`, w / 2, 36, { align: "center" });

    pdf.setDrawColor(47, 125, 87);
    pdf.setLineWidth(0.8);
    pdf.line(16, 40, w - 16, 40);
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(0.3);
    pdf.line(16, 41.5, w - 16, 41.5);

    // 2. Report Card Title
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("SLIP PRESTASI HAFAZAN (KAD LAPORAN)", w / 2, 50, { align: "center" });

    // 3. Student Bio Block (Table box)
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.25);
    pdf.rect(16, 56, w - 32, 28, "S");

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.text("Nama Pelajar:", 20, 62);
    pdf.setFont("helvetica", "normal");
    pdf.text(student.name, 48, 62);

    pdf.setFont("helvetica", "bold");
    pdf.text("No. ID:", 20, 68);
    pdf.setFont("helvetica", "normal");
    pdf.text(student.id, 48, 68);

    pdf.setFont("helvetica", "bold");
    pdf.text("Kelas / Umur:", 20, 74);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${student.kelas}   |   ${student.umur} Tahun`, 48, 74);

    pdf.setFont("helvetica", "bold");
    pdf.text("Sasaran Bulanan:", 20, 80);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${student.target || 15} Muka Surat / bulan`, 48, 80);

    // Right Column in the same box
    pdf.setFont("helvetica", "bold");
    pdf.text("Tarikh Daftar:", 120, 62);
    pdf.setFont("helvetica", "normal");
    pdf.text(student.enroll || "08/01/2024", 146, 62);

    pdf.setFont("helvetica", "bold");
    pdf.text("Muka Terkini:", 120, 68);
    pdf.setFont("helvetica", "normal");
    pdf.text(`m.s. ${student.frontier} (Juzuk ${grid.juzuk})`, 146, 68);

    pdf.setFont("helvetica", "bold");
    pdf.text("Surah Terkini:", 120, 74);
    pdf.setFont("helvetica", "normal");
    pdf.text(student.surah || "Al-Baqarah", 146, 74);

    pdf.setFont("helvetica", "bold");
    pdf.text("Pencapaian:", 120, 80);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${grid.progressPercent}% daripada 30 Juzuk`, 146, 80);

    // 4. Progress Summary (Visual bar)
    pdf.setTextColor(47, 125, 87);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10.5);
    pdf.text("ANALISIS HAFAZAN MUKA SURAT (DARI 604)", 16, 92);

    // Simple drawn Progress Bar
    const barX = 16;
    const barY = 96;
    const barW = w - 32;
    const barH = 5;
    pdf.setDrawColor(220, 220, 220);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(barX, barY, barW, barH, "FD");

    const filledW = (grid.progressPercent / 100) * barW;
    pdf.setFillColor(47, 125, 87);
    pdf.rect(barX, barY, filledW, barH, "F");

    // 5. Page Tallies Breakdown
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Agihan Status Petak Grid:", 16, 110);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const keys = ["hafazan", "talaqqi", "murajaah", "syahadah", "iqra", "tilawah", "bacaan", "belum"];
    const labels = ["Hafazan", "Talaqqi", "Murajaah", "Syahadah", "Iqra'", "Tilawah", "Bacaan", "Belum"];
    
    let chipX = 16;
    let chipY = 114;
    keys.forEach((key, idx) => {
      const val = grid.tally[key] || 0;
      pdf.setDrawColor(200, 200, 200);
      pdf.setFillColor(250, 250, 250);
      pdf.rect(chipX, chipY, 21, 10, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.text(String(val), chipX + 10.5, chipY + 7.5, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text(labels[idx], chipX, chipY + 14);

      chipX += 22.5;
    });

    // 6. Projections
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(253, 251, 247);
    pdf.rect(16, 136, w - 32, 18, "FD");

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(47, 125, 87);
    pdf.text("ANGGARAN PENYELESAIAN KHATAM (PROJEKSI)", 20, 142);
    
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Kelajuan semasa: ${prediction.pace} m.s. / bulan   |   Anggaran tamat 30 Juzuk: ${prediction.khatamDate}`, 20, 148);

    // 7. Recent Log Table (Recent 5 records)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10.5);
    pdf.setTextColor(47, 125, 87);
    pdf.text("LOG TASMIK TERKINI (AKTIVITI HARIAN)", 16, 166);

    const startY = 171;
    const colW = [22, 24, 20, 15, 65, 30]; // total = 176
    const headers = ["Tarikh", "Kategori", "Halaman", "Gred", "Ulasan Guru", "Guru Penguji"];
    
    // Draw header row
    pdf.setFillColor(47, 125, 87);
    pdf.rect(16, startY, w - 32, 7, "F");
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    let cellX = 16;
    headers.forEach((h, idx) => {
      pdf.text(h, cellX + 2, startY + 5);
      cellX += colW[idx];
    });

    // Draw data rows
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "normal");
    let rowY = startY + 7;
    
    tasmikLog.slice(0, 5).forEach((rec, idx) => {
      // Row box
      pdf.setDrawColor(220, 220, 220);
      pdf.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 248);
      pdf.rect(16, rowY, w - 32, 9, "FD");

      const dateStr = new Date(rec.date).toLocaleDateString("ms-MY", { day: "numeric", month: "numeric" });
      const pages = `${rec.from}-${rec.to}`;
      const vals = [dateStr, rec.kategori, pages, rec.gred, rec.ulasan, rec.guru];

      let cellValX = 16;
      vals.forEach((val, cIdx) => {
        let printVal = String(val);
        // Truncate comments if too long
        if (cIdx === 4 && printVal.length > 34) {
          printVal = printVal.substring(0, 31) + "...";
        }
        pdf.text(printVal, cellValX + 2, rowY + 6.2);
        cellValX += colW[cIdx];
      });

      rowY += 9;
    });

    // 8. Signatures Footer
    const sigY = 244;
    pdf.setDrawColor(180, 180, 180);
    pdf.line(30, sigY + 22, 80, sigY + 22);
    pdf.line(w - 80, sigY + 22, w - 30, sigY + 22);

    pdf.setFontSize(9);
    pdf.text("Disediakan oleh,", 30, sigY);
    pdf.text("Tandatangan Guru Tasmi'", 30, sigY + 26);

    pdf.text("Disahkan oleh,", w - 80, sigY);
    pdf.text("Mudir (Pengetua)", w - 80, sigY + 26);

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("Generated by Maqra' Tahfiz Management Suite", w / 2, h - 14, { align: "center" });
  }
};
