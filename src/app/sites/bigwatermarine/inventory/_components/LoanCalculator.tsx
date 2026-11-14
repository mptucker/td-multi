"use client";

import { useMemo, useState } from "react";
import { money, monthlyPayment } from "@/bigwatermarine/lib/boats/format";

type Props = { price: number; downPercent: number; apr: number; termYears: number; financingUrl: string };

const DOWN_OPTIONS = [0, 5, 10, 15, 20, 25, 30];
const TERM_OPTIONS = [5, 7, 10, 12, 15, 20];

export default function LoanCalculator({ price: initialPrice, downPercent, apr: initialApr, termYears, financingUrl }: Props) {
  const [price, setPrice] = useState(initialPrice);
  const [down, setDown] = useState(downPercent);
  const [apr, setApr] = useState(initialApr);
  const [years, setYears] = useState(termYears);
  const payment = useMemo(() => monthlyPayment(price, down, apr, years), [price, down, apr, years]);
  const loan = Math.max(0, price * (1 - down / 100));

  return (
    <div className="bwm-loan">
      <div className="bwm-loanForm">
        <h3 className="bwm-h3">Calculate your payment</h3>
        <label className="bwm-field">
          <span>Purchase price</span>
          <input type="number" inputMode="numeric" min={0} step={500} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
        </label>
        <div className="bwm-fieldRow">
          <label className="bwm-field">
            <span>Down payment</span>
            <select value={down} onChange={(e) => setDown(Number(e.target.value))}>
              {DOWN_OPTIONS.map((d) => <option key={d} value={d}>{d}%</option>)}
            </select>
          </label>
          <div className="bwm-field bwm-fieldStatic"><span>Down payment amount</span><output>{money(price * down / 100)}</output></div>
        </div>
        <label className="bwm-field">
          <span>Interest rate (APR %)</span>
          <input type="number" inputMode="decimal" min={0} max={30} step={0.01} value={apr} onChange={(e) => setApr(Number(e.target.value) || 0)} />
        </label>
        <div className="bwm-fieldRow">
          <label className="bwm-field">
            <span>Loan term</span>
            <select value={years} onChange={(e) => setYears(Number(e.target.value))}>
              {TERM_OPTIONS.map((t) => <option key={t} value={t}>{t} years</option>)}
            </select>
          </label>
          <div className="bwm-field bwm-fieldStatic"><span>Months</span><output>{years * 12}</output></div>
        </div>
        <p className="bwm-fine bwm-fine--dark">
          Estimate for illustration only. Actual payments vary with credit approval and don&rsquo;t include tax, title, registration or other fees.
        </p>
      </div>
      <div className="bwm-loanResult" aria-live="polite">
        <p className="bwm-loanLabel">Estimated monthly payment</p>
        <p className="bwm-loanPayment">{money(payment)}<span>/month</span></p>
        <p className="bwm-loanTotal">Loan amount: <strong>{money(loan)}</strong></p>
        <a href={financingUrl} className="bwm-btnTeal">Get pre-qualified</a>
      </div>
    </div>
  );
}
