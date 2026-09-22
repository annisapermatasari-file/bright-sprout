export type PlanId = "child" | "family";

export type Plan = {
  id: PlanId;
  name: string;
  amount: number;
  amountLabel: string;
  eyebrow: string;
  description: string;
  benefits: string[];
};

// Single source of truth for pricing. The checkout API route re-reads the
// amount from here by planId — the amount is never trusted from the client.
export const PLANS: Record<PlanId, Plan> = {
  child: {
    id: "child",
    name: "Paket Anak",
    amount: 35000,
    amountLabel: "Rp35.000",
    eyebrow: "UNTUK 1 ANAK",
    description: "Aktivitas belajar seru untuk satu anak, dengan buddy hewan dan hadiah kecil setiap kali berhasil.",
    benefits: ["Minigame matematika, sains, dan kosa kata", "Buddy hewan dan achievement", "Satu profil anak"],
  },
  family: {
    id: "family",
    name: "Paket Keluarga",
    amount: 100000,
    amountLabel: "Rp100.000",
    eyebrow: "UNTUK KELUARGA",
    description: "Dapatkan seluruh fitur BrightSprout, dengan ringkasan progres orang tua dan satu profil anak tambahan untuk dipakai bersama.",
    benefits: ["Seluruh fitur BrightSprout", "Ringkasan progres untuk orang tua", "Tambah 1 profil anak lagi (total 2 anak)"],
  },
};

export function isPlanId(value: string): value is PlanId {
  return value === "child" || value === "family";
}
