export const sijilTemplate = {
  render(pdf, studentName, milestoneTitle, schoolName, dateStr) {
    // Landscape A4 size: 297mm x 210mm
    const w = 297;
    const h = 210;

    // Background fill (light cream)
    pdf.setFillColor(253, 251, 247);
    pdf.rect(0, 0, w, h, "F");

    // Elegant outer border (pine emerald color)
    pdf.setDrawColor(47, 125, 87);
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, w - 20, h - 20, "S");

    // Gold inner border
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(0.8);
    pdf.rect(13, 13, w - 26, h - 26, "S");

    // Floral corner indicators
    const cornerSize = 8;
    pdf.setFillColor(212, 175, 55);
    // Top-Left
    pdf.rect(13, 13, cornerSize, 1.5, "F");
    pdf.rect(13, 13, 1.5, cornerSize, "F");
    // Top-Right
    pdf.rect(w - 13 - cornerSize, 13, cornerSize, 1.5, "F");
    pdf.rect(w - 13, 13, 1.5, cornerSize, "F");
    // Bottom-Left
    pdf.rect(13, h - 13 - 1.5, cornerSize, 1.5, "F");
    pdf.rect(13, h - 13 - cornerSize, 1.5, cornerSize, "F");
    // Bottom-Right
    pdf.rect(w - 13 - cornerSize, h - 13 - 1.5, cornerSize, 1.5, "F");
    pdf.rect(w - 13, h - 13 - cornerSize, 1.5, cornerSize, "F");

    // Certificate Header
    pdf.setTextColor(47, 125, 87);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(26);
    pdf.text("SIJIL PENGHARGAAN HAFAZAN", w / 2, 45, { align: "center" });

    // Sub-header divider line
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(1);
    pdf.line(w / 2 - 40, 52, w / 2 + 40, 52);

    // Body texts
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.text("Dengan ini diperakui dan disahkan bahawa", w / 2, 70, { align: "center" });

    // Student Name
    pdf.setTextColor(47, 125, 87);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(studentName.toUpperCase(), w / 2, 88, { align: "center" });

    // Divider
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(w / 2 - 70, 94, w / 2 + 70, 94);

    // Milestone details
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(13);
    pdf.text("telah dengan jayanya menyelesaikan ujian bacaan & hafazan bertulis bagi", w / 2, 110, { align: "center" });

    // The Milestone Target (e.g. Juzuk 30, Khatam Quran)
    pdf.setTextColor(172, 128, 47); // Dark Gold
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(milestoneTitle, w / 2, 125, { align: "center" });

    // School details
    pdf.setTextColor(41, 38, 27);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(13);
    pdf.text(`di institusi tahfiz ${schoolName}`, w / 2, 140, { align: "center" });

    pdf.setFontSize(11);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Tarikh Penganugerahan: ${dateStr}`, w / 2, 154, { align: "center" });

    // Footer signature slots
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.5);
    // Principal signature
    pdf.line(40, 186, 100, 186);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(41, 38, 27);
    pdf.text("Tandatangan Mudir / Principal", 70, 192, { align: "center" });

    // Seal indicator
    pdf.setDrawColor(212, 175, 55);
    pdf.setLineWidth(1);
    pdf.circle(w / 2, 178, 10, "S");
    pdf.setFontSize(8);
    pdf.setTextColor(212, 175, 55);
    pdf.text("MATRA", w / 2, 179.5, { align: "center" });
    pdf.text("METERAI", w / 2, 182, { align: "center" });

    // Teacher signature
    pdf.setDrawColor(180, 180, 180);
    pdf.line(w - 100, 186, w - 40, 186);
    pdf.setTextColor(41, 38, 27);
    pdf.text("Tandatangan Guru Tasmi'", w - 70, 192, { align: "center" });
  }
};
