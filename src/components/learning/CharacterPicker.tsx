"use client";

type Character = { id: string; emoji: string; name: { id: string; en: string } };

export const CHARACTERS: Character[] = [
  { id: "panda", emoji: "🐼", name: { id: "Panda", en: "Panda" } },
  { id: "fox", emoji: "🦊", name: { id: "Rubah", en: "Fox" } },
  { id: "bunny", emoji: "🐰", name: { id: "Kelinci", en: "Bunny" } },
  { id: "cat", emoji: "🐱", name: { id: "Kucing", en: "Cat" } },
  { id: "axolotl", emoji: "🦎", name: { id: "Axolotl", en: "Axolotl" } },
];

export function CharacterPicker({ selected, language, onChange }: { selected: string; language: "id" | "en"; onChange: (id: string) => void }) {
  return <div className="character-picker" aria-label={language === "id" ? "Pilih buddy belajar" : "Choose a learning buddy"}><div className="character-picker-title">{language === "id" ? "Pilih teman belajarmu" : "Choose your study buddy"}</div><div className="character-options" role="list">{CHARACTERS.map((character) => <button type="button" role="listitem" key={character.id} className={selected === character.id ? "character-option active" : "character-option"} onClick={() => onChange(character.id)} aria-pressed={selected === character.id} aria-label={language === "id" ? character.name.id : character.name.en}><span aria-hidden="true">{character.emoji}</span><small>{language === "id" ? character.name.id : character.name.en}</small></button>)}</div></div>;
}
