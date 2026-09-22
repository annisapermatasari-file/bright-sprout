"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

type ReportData = {
  childName: string;
  overallProgressPercent: number;
  completedLessonsCount: number;
  totalPublishedLessons: number;
  totalXp: number;
  totalStars: number;
  badgeCount: number;
  streak: number;
  totalAttempts: number;
  accuracy: number;
  skills: { label: string; score: number }[];
  recommendations: string[];
};

export function DownloadReportButton({ data }: { data: ReportData }) {
  const [isCreating, setIsCreating] = useState(false);

  function downloadReport() {
    setIsCreating(true);
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date());
    const coral: [number, number, number] = [255, 111, 97];
    const ink: [number, number, number] = [32, 37, 45];
    const muted: [number, number, number] = [104, 112, 128];

    doc.setFillColor(...coral);
    doc.rect(0, 0, pageWidth, 42, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BRIGHTSPROUT", 18, 16);
    doc.setFontSize(24);
    doc.text("Laporan belajar", 18, 30);
    doc.setTextColor(...ink);
    doc.setFontSize(18);
    doc.text(data.childName, 18, 57);
    doc.setTextColor(...muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Dibuat pada ${date}`, 18, 64);
    doc.setTextColor(...ink);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan minggu ini", 18, 82);

    const metrics = [
      ["Progres kursus", `${data.overallProgressPercent}%`],
      ["XP terkumpul", String(data.totalXp)],
      ["Bintang", String(data.totalStars)],
      ["Streak", `${data.streak} hari`],
    ];
    metrics.forEach(([label, value], index) => {
      const x = 18 + (index % 2) * 88;
      const y = 91 + Math.floor(index / 2) * 25;
      doc.setFillColor(248, 244, 234);
      doc.roundedRect(x, y, 78, 19, 3, 3, "F");
      doc.setTextColor(...muted);
      doc.setFontSize(8);
      doc.text(label, x + 6, y + 7);
      doc.setTextColor(...ink);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(value, x + 6, y + 15);
      doc.setFont("helvetica", "normal");
    });

    let cursorY = 151;
    doc.setTextColor(...ink);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Kebiasaan belajar", 18, cursorY);
    cursorY += 10;
    doc.setTextColor(...muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Pelajaran selesai: ${data.completedLessonsCount} dari ${data.totalPublishedLessons}`, 18, cursorY);
    doc.text(`Soal dijawab: ${data.totalAttempts}`, 18, cursorY + 8);
    doc.text(`Akurasi: ${data.accuracy}%`, 18, cursorY + 16);

    cursorY += 36;
    doc.setTextColor(...ink);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Skill yang sedang tumbuh", 18, cursorY);
    cursorY += 10;
    data.skills.slice(0, 6).forEach((skill) => {
      doc.setTextColor(...ink);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(skill.label, 18, cursorY);
      doc.setTextColor(...muted);
      doc.text(`${skill.score}%`, 178, cursorY, { align: "right" });
      doc.setFillColor(232, 228, 218);
      doc.roundedRect(18, cursorY + 3, 160, 4, 2, 2, "F");
      doc.setFillColor(...coral);
      doc.roundedRect(18, cursorY + 3, 160 * Math.max(0, Math.min(skill.score, 100)) / 100, 4, 2, 2, "F");
      cursorY += 16;
    });

    cursorY += 6;
    doc.setTextColor(...ink);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Langkah berikutnya", 18, cursorY);
    cursorY += 9;
    doc.setTextColor(...muted);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    data.recommendations.slice(0, 3).forEach((recommendation) => { doc.text(`• ${recommendation}`, 20, cursorY, { maxWidth: 168 }); cursorY += 9; });

    doc.setTextColor(...muted);
    doc.setFontSize(8);
    doc.text("Laporan ini merangkum aktivitas belajar yang tersimpan di BrightSprout.", 18, 280);
    doc.save(`brightsprout-${data.childName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-report.pdf`);
    setIsCreating(false);
  }

  return <button type="button" className="report-download-button" onClick={downloadReport} disabled={isCreating}>{isCreating ? "Menyiapkan PDF…" : "Unduh laporan PDF ↗"}</button>;
}
