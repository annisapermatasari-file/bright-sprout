"use client";

import { useState } from "react";

const answers = [3, 4, 5];

export function PlayDemo() {
  const [selected, setSelected] = useState<number | null>(4);
  const [streak, setStreak] = useState(3);

  function choose(answer: number) {
    setSelected(answer);
    if (answer === 4) setStreak((value) => Math.min(value + 1, 9));
    else setStreak(0);
  }

  return (
    <div className="demo-window" aria-label="Pratinjau permainan berhitung">
      <div className="demo-topbar">
        <div className="demo-dots" aria-hidden="true"><span /><span /><span /></div>
        <span className="demo-label">PLAY LAB · MISI BERHITUNG</span>
        <span className="demo-level">LEVEL 03</span>
      </div>
      <div className="demo-body">
        <div className="demo-score-row">
          <span className="demo-pill">⭐ {streak} hari berturut-turut</span>
          <span className="demo-xp">+10 XP</span>
        </div>
        <div className="demo-question">
          <span className="demo-eyebrow">TEMAN HUTAN</span>
          <h3>Ada berapa apel?</h3>
          <div className="apple-row" aria-label="Empat apel merah" role="img">
            <span>🍎</span><span>🍎</span><span>🍎</span><span>🍎</span>
          </div>
        </div>
        <div className="answer-grid" role="group" aria-label="Pilih jawaban">
          {answers.map((answer) => (
            <button
              type="button"
              key={answer}
              onClick={() => choose(answer)}
              className={selected === answer ? "answer selected" : "answer"}
              aria-pressed={selected === answer}
            >
              {answer}
            </button>
          ))}
        </div>
        <div className={selected === 4 ? "feedback correct" : "feedback"} aria-live="polite">
          {selected === 4 ? "Benar! Kamu menemukan semua apelnya." : "Coba lihat lagi — hitung setiap apel."}
        </div>
      </div>
    </div>
  );
}

export function ProgressPreview() {
  return (
    <div className="progress-card">
      <div className="progress-heading">
        <div>
          <span className="eyebrow dark-eyebrow">MINGGU INI</span>
          <h3>Taman belajar Maya</h3>
        </div>
        <div className="avatar-sun">M</div>
      </div>
      <div className="big-progress"><span>72%</span><small>target mingguan</small></div>
      <div className="progress-track"><span /></div>
      <div className="skill-list">
        <div><span className="skill-icon purple">✦</span><span>Berhitung sampai 10</span><b>80%</b></div>
        <div><span className="skill-icon teal">◒</span><span>Teman angka</span><b>55%</b></div>
        <div><span className="skill-icon orange">◆</span><span>Lebih atau kurang</span><b>30%</b></div>
      </div>
      <p className="parent-note">Maya sudah belajar 3 hari berturut-turut. Sedikit demi sedikit, hasilnya terasa.</p>
    </div>
  );
}

export function FeatureTabs() {
  const [active, setActive] = useState("kids");
  const content = active === "kids"
    ? { title: "Dunia untuk pikiran yang ingin tahu", body: "Permainan singkat membuat matematika dasar terasa seperti petualangan harian — dengan tombol besar, feedback ceria, dan tanpa tekanan.", icon: "✦" }
    : { title: "Jendela tenang untuk melihat progres", body: "Lihat keterampilan yang sedang dilatih anak, rayakan streak-nya, dan tahu apa yang bisa dicoba berikutnya.", icon: "◌" };
  return (
    <div className="feature-tabs">
      <div className="tab-row" role="tablist" aria-label="BrightSprout untuk siapa?">
        <button type="button" role="tab" aria-selected={active === "kids"} className={active === "kids" ? "tab active" : "tab"} onClick={() => setActive("kids")}>Untuk anak</button>
        <button type="button" role="tab" aria-selected={active === "parents"} className={active === "parents" ? "tab active" : "tab"} onClick={() => setActive("parents")}>Untuk orang tua</button>
      </div>
      <div className="tab-content" key={active}>
        <span className="feature-icon">{content.icon}</span>
        <div><h3>{content.title}</h3><p>{content.body}</p></div>
      </div>
    </div>
  );
}

export function FAQAccordion() {
  const [open, setOpen] = useState(0);
  const items = [
    ["BrightSprout cocok untuk usia berapa?", "BrightSprout dirancang untuk usia 4–7 tahun, dengan aktivitas dari mengenali angka hingga penjumlahan dasar."],
    ["Apakah saya bisa memantau lebih dari satu anak?", "Bisa. Setiap anak memiliki profil bermain, jalur belajar, dan ringkasan progres sendiri."],
    ["Apakah BrightSprout aman untuk anak?", "BrightSprout tanpa iklan, tidak memiliki chat publik, dan memisahkan dasbor orang tua dari mode bermain."],
  ];
  return <div className="faq-list">{items.map(([question, answer], index) => <div className="faq-item" key={question}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{question}</span><span>{open === index ? "−" : "+"}</span></button>{open === index && <p>{answer}</p>}</div>)}</div>;
}

export default PlayDemo;
