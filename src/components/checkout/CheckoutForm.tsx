"use client";

import { useState } from "react";
import { PLANS, type PlanId } from "@/lib/plans";

const PLAN_LIST = Object.values(PLANS);

export function CheckoutForm() {
  const [planId, setPlanId] = useState<PlanId>("family");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = PLANS[planId];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, email }),
      });
      const data = await response.json();

      if (!response.ok || !data.paymentUrl) {
        setError(data.error ?? "Gagal membuat pembayaran. Coba lagi sebentar lagi.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.paymentUrl;
    } catch {
      setError("Gagal terhubung ke server pembayaran. Periksa koneksimu dan coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="plan-picker" role="radiogroup" aria-label="Pilih paket BrightSprout">
        {PLAN_LIST.map((item) => (
          <button
            type="button"
            role="radio"
            aria-checked={planId === item.id}
            key={item.id}
            className={planId === item.id ? "plan-choice active" : "plan-choice"}
            onClick={() => setPlanId(item.id)}
          >
            <span className="plan-choice-top">
              <span className="checkout-kicker">{item.eyebrow}</span>
              <strong>{item.amountLabel}</strong>
            </span>
            <b>{item.name}</b>
            <small>{item.id === "child" ? "Satu anak saja" : "Untuk keluarga"}</small>
          </button>
        ))}
      </div>
      <form className="checkout-card" onSubmit={handleSubmit}>
        <div className="checkout-card-head">
          <div>
            <span className="checkout-kicker">{plan.eyebrow}</span>
            <h2>{plan.name}</h2>
          </div>
          <strong>{plan.amountLabel}</strong>
        </div>
        <p className="checkout-description">{plan.description}</p>
        <div className="checkout-benefits">
          {plan.benefits.map((benefit) => (
            <span key={benefit}>✓ {benefit}</span>
          ))}
        </div>
        <label className="checkout-label" htmlFor="checkout-email">Email orang tua</label>
        <input
          id="checkout-email"
          className="checkout-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nama@contoh.com"
          required
        />
        <div className="checkout-disclaimer">Kamu akan diarahkan ke halaman pembayaran DOKU untuk menyelesaikan transaksi (virtual account, QRIS, e-wallet, dan metode lainnya).</div>
        {error ? <div className="checkout-error" role="alert">{error}</div> : null}
        <button className="button button-primary checkout-submit" type="submit" disabled={submitting}>
          {submitting ? "Menyiapkan pembayaran…" : `Bayar ${plan.amountLabel}`} <span>↗</span>
        </button>
      </form>
    </div>
  );
}
