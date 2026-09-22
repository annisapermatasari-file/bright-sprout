"use client";

import { useEffect, useMemo, useState } from "react";
import { WeeklyLeaderboard } from "@/components/learning/WeeklyLeaderboard";
import { CharacterPicker } from "@/components/learning/CharacterPicker";

type Language = "id" | "en";
type Question = { prompt: Record<Language, string>; visual: string; options: Record<Language, string[]>; answerIndex: number; pronunciation?: string };
type GameKey = "math" | "science" | "english";

const GAMES: Record<GameKey, { label: Record<Language, string>; kicker: string; title: Record<Language, string>; questions: Question[] }> = {
  math: { label: { id: "Matematika", en: "Math" }, kicker: "MATH GARDEN", title: { id: "Matematika kecil, kemenangan besar.", en: "Tiny math, big win." }, questions: [
    { prompt: { id: "Ada berapa bintang yang bersinar?", en: "How many stars are shining?" }, visual: "⭐ ⭐ ⭐", options: { id: ["2", "3", "4"], en: ["2", "3", "4"] }, answerIndex: 1 },
    { prompt: { id: "Ada 2 apel. Tambah 1 lagi. Jadi berapa?", en: "You have 2 apples. Add 1 more. How many now?" }, visual: "🍎 🍎 + 🍎", options: { id: ["2", "3", "4"], en: ["2", "3", "4"] }, answerIndex: 1 },
    { prompt: { id: "Angka mana yang lebih besar?", en: "Which number is bigger?" }, visual: "4  ·  2", options: { id: ["2", "3", "4"], en: ["2", "3", "4"] }, answerIndex: 2 },
    { prompt: { id: "Kurangi 1 dari 5. Tersisa berapa?", en: "Take 1 away from 5. What is left?" }, visual: "🍪 🍪 🍪 🍪 🍪 − 🍪", options: { id: ["3", "4", "5"], en: ["3", "4", "5"] }, answerIndex: 1 },
  ] },
  science: { label: { id: "Sains", en: "Science" }, kicker: "CURIOSITY LAB", title: { id: "Lihat lebih dekat.", en: "Look closer." }, questions: [
    { prompt: { id: "Mana yang termasuk tumbuhan?", en: "Which one is a plant?" }, visual: "🌿  🪨  👟", options: { id: ["Daun", "Batu", "Sepatu"], en: ["Leaf", "Rock", "Shoe"] }, answerIndex: 0 },
    { prompt: { id: "Apa yang kita perlukan untuk bernapas?", en: "What do we need to breathe?" }, visual: "🌬️  💧  🍎", options: { id: ["Air", "Air minum", "Apel"], en: ["Air", "Water", "Apple"] }, answerIndex: 0 },
    { prompt: { id: "Hewan mana yang bermula sebagai ulat?", en: "Which animal starts as a caterpillar?" }, visual: "🐛  🐶  🐟", options: { id: ["Kupu-kupu", "Anjing", "Ikan"], en: ["Butterfly", "Dog", "Fish"] }, answerIndex: 0 },
  ] },
  english: { label: { id: "Kosa kata Inggris", en: "English words" }, kicker: "WORD TRAIL", title: { id: "Temukan kata yang tepat.", en: "Find the right word." }, questions: [
    { prompt: { id: "Apa arti kata “cat”?", en: "What does “cat” mean?" }, visual: "🐱  ·  CAT", options: { id: ["Kucing", "Buku", "Matahari"], en: ["Kucing", "Book", "Sun"] }, answerIndex: 0, pronunciation: "cat" },
    { prompt: { id: "Apa lawan kata “big”?", en: "What is the opposite of “big”?" }, visual: "BIG  ↔  ?", options: { id: ["Cepat", "Kecil", "Biru"], en: ["Fast", "Small", "Blue"] }, answerIndex: 1, pronunciation: "big" },
    { prompt: { id: "Kata mana yang berarti “air”?", en: "Which word means “air”?" }, visual: "💧  ·  ?", options: { id: ["Water", "Window", "Winter"], en: ["Water", "Window", "Winter"] }, answerIndex: 0, pronunciation: "water" },
  ] },
};

export function MathMiniGame() {
  const [language, setLanguage] = useState<Language>("id");
  const [gameKey, setGameKey] = useState<GameKey>("math");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [buddy, setBuddy] = useState("panda");
  const [completedRounds, setCompletedRounds] = useState(0);
  const game = GAMES[gameKey];
  const question = game.questions[index];
  const progress = useMemo(() => ((index + (selected !== null ? 1 : 0)) / game.questions.length) * 100, [game.questions.length, index, selected]);
  const badgeUnlocked = completedRounds >= 5;

  useEffect(() => {
    const savedBuddy = window.localStorage.getItem("brightsprout-buddy");
    const savedRounds = Number(window.localStorage.getItem("brightsprout-quiz-rounds") || "0");
    if (savedBuddy) setBuddy(savedBuddy);
    if (Number.isFinite(savedRounds)) setCompletedRounds(savedRounds);
  }, []);
  const t = language === "id" ? { new: "BARU", xp: "XP", pick: "Pilih jawaban. Buddy-mu sedang menyemangati.", yes: "Benar! Rasa ingin tahumu tumbuh. ✦", no: `Belum tepat. Jawabannya ${question.options.id[question.answerIndex]}. Coba lagi.`, next: "Pertanyaan berikutnya ↗", result: "Lihat hasilku", again: "Main lagi ↗", try: "Setiap usaha tetap dihitung.", complete: "Kamu berhasil!", badge: `Lencana ${game.label.id.toLowerCase()} siap dipakai.`, score: "Kamu menjawab" } : { new: "NEW", xp: "XP", pick: "Pick an answer. Your buddy is cheering quietly.", yes: "Yes! Your curiosity is growing. ✦", no: `Not this time. The answer is ${question.options.en[question.answerIndex]}. You can keep going.`, next: "Next question ↗", result: "See my result", again: "Play again ↗", try: "Every try counts.", complete: "You did it!", badge: `Your ${game.label.en.toLowerCase()} badge is ready.`, score: "You got" };

  function choose(optionIndex: number) { if (selected !== null) return; setSelected(optionIndex); if (optionIndex === question.answerIndex) setCorrect((value) => value + 1); }
  function changeGame(nextGame: GameKey) { setGameKey(nextGame); setIndex(0); setSelected(null); setCorrect(0); setDone(false); }
  function next() {
    if (index === game.questions.length - 1) {
      const nextRounds = completedRounds + 1;
      setCompletedRounds(nextRounds);
      window.localStorage.setItem("brightsprout-quiz-rounds", String(nextRounds));
      setDone(true);
    } else { setIndex((value) => value + 1); setSelected(null); }
  }
  function restart() { setIndex(0); setSelected(null); setCorrect(0); setDone(false); }
  function chooseBuddy(id: string) { setBuddy(id); window.localStorage.setItem("brightsprout-buddy", id); }
  function speakWord() {
    if (!question.pronunciation || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.pronunciation);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  return <section className="math-game" aria-labelledby="math-game-title">
    <div className="math-game-header"><div><span className="math-game-kicker">{t.new} · {game.kicker}</span><h2 id="math-game-title">{done ? t.complete : game.title[language]}</h2></div><div className="math-game-head-actions"><div className="language-toggle" aria-label="Pilih bahasa"><button type="button" className={language === "id" ? "active" : ""} onClick={() => setLanguage("id")}>ID</button><button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button></div><span className="math-game-score">⭐ {correct * 10} {t.xp}</span></div></div>
    <CharacterPicker selected={buddy} language={language} onChange={chooseBuddy} />
    <div className="game-tabs" role="tablist" aria-label={language === "id" ? "Pilih permainan belajar" : "Choose a learning game"}>{(Object.keys(GAMES) as GameKey[]).map((key) => <button type="button" role="tab" aria-selected={gameKey === key} className={gameKey === key ? "game-tab active" : "game-tab"} key={key} onClick={() => changeGame(key)}>{GAMES[key].label[language]}</button>)}</div>
    {done ? <div className="math-game-finished"><div className="math-game-finish-icon" aria-hidden="true">🌟</div><h3>{t.badge}</h3><p>{t.score} <strong>{correct} dari {game.questions.length}</strong> {language === "id" ? "soal benar dan mendapat" : "questions right and earned"} <strong>{correct * 10} XP</strong>.</p>{badgeUnlocked ? <div className="achievement-badge" role="status"><span aria-hidden="true">🏅</span><div><strong>{language === "id" ? "Lencana Lima Kuis!" : "Five Quiz Badge!"}</strong><small>{language === "id" ? "Kamu menyelesaikan 5 kuis berturut-turut." : "You completed 5 quizzes in a row."}</small></div></div> : <p className="achievement-progress">{language === "id" ? `Progres lencana: ${completedRounds}/5 kuis selesai.` : `Badge progress: ${completedRounds}/5 quizzes complete.`}</p>}<div className="math-game-actions"><button type="button" className="math-game-button primary" onClick={restart}>{t.again}</button><span>{t.try}</span></div></div> : <><div className="math-game-progress" aria-label={`${index + 1} / ${game.questions.length}`}><span style={{ width: `${progress}%` }} /></div><div className="math-game-question"><p>{question.prompt[language]}</p><div className="math-game-visual" aria-label={question.prompt[language]} role="img">{question.visual}</div>{gameKey === "english" && question.pronunciation ? <button type="button" className="pronunciation-button" onClick={speakWord} aria-label={`${language === "id" ? "Dengarkan pelafalan" : "Listen to pronunciation"}: ${question.pronunciation}`}>🔊 {language === "id" ? "Dengarkan pelafalan" : "Listen to pronunciation"} <strong>{question.pronunciation}</strong></button> : null}</div><div className="math-game-options" role="group" aria-label={language === "id" ? "Pilih jawaban" : "Choose an answer"}>{question.options[language].map((option, optionIndex) => <button type="button" key={option} className={selected === optionIndex ? optionIndex === question.answerIndex ? "math-option correct" : "math-option wrong" : "math-option"} onClick={() => choose(optionIndex)} aria-pressed={selected === optionIndex} disabled={selected !== null}>{option}</button>)}</div><div className="math-game-feedback" aria-live="polite">{selected === null ? t.pick : selected === question.answerIndex ? t.yes : t.no}</div>{selected !== null ? <button type="button" className="math-game-button" onClick={next}>{index === game.questions.length - 1 ? t.result : t.next}</button> : null}</>}
    <WeeklyLeaderboard currentXp={correct * 10} />
  </section>;
}
