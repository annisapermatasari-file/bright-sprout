"use client";

import { useMemo, useState } from "react";

type Entry = { name: string; icon: string; xp: number };

const WEEKLY_PLAYERS: Entry[] = [
  { name: "Bintang Kecil", icon: "⭐", xp: 120 },
  { name: "Panda Ceria", icon: "🐼", xp: 95 },
  { name: "Komet Biru", icon: "☄️", xp: 80 },
  { name: "Kamu", icon: "🌱", xp: 0 },
];

export function WeeklyLeaderboard({ currentXp }: { currentXp: number }) {
  const [joined, setJoined] = useState(true);
  const entries = useMemo(() => WEEKLY_PLAYERS.map((entry) => entry.name === "Kamu" ? { ...entry, xp: currentXp } : entry).sort((a, b) => b.xp - a.xp), [currentXp]);
  const myPosition = entries.findIndex((entry) => entry.name === "Kamu") + 1;

  return (
    <section className="weekly-leaderboard" aria-labelledby="leaderboard-title">
      <div className="leaderboard-heading"><div><span className="math-game-kicker">MINGGU INI · PAKAI NAMA SAMARAN</span><h3 id="leaderboard-title">Papan bintang</h3></div><span className="leaderboard-trophy" aria-hidden="true">🏆</span></div>
      {joined ? <div className="leaderboard-list" role="list" aria-label="Peringkat mingguan"><div className="leaderboard-me">Posisimu minggu ini: <strong>#{myPosition}</strong></div>{entries.map((entry, index) => <div className={`leaderboard-row ${entry.name === "Kamu" ? "is-me" : ""}`} role="listitem" key={entry.name}><span className="leaderboard-rank">{index + 1}</span><span className="leaderboard-avatar" aria-hidden="true">{entry.icon}</span><span className="leaderboard-name">{entry.name}</span><strong>{entry.xp} XP</strong></div>)}</div> : <p className="leaderboard-off">Papan bintang disembunyikan. Kamu tetap bisa belajar dan mengumpulkan XP untuk dirimu sendiri.</p>}
      <div className="leaderboard-footer"><span>Tanpa nama asli. Tanpa chat publik.</span><button type="button" onClick={() => setJoined((value) => !value)}>{joined ? "Sembunyikan" : "Ikut papan bintang"}</button></div>
    </section>
  );
}
