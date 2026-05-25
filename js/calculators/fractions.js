/* ============================================================
   fractions.js — Logic for Fraction Simplifier
   ============================================================ */

function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b !== 0) [a, b] = [b, a % b];
    return a;
}

function simplifyFraction() {
    const area = document.getElementById("result-area");
    const num = parseInt(document.getElementById("numerator").value.trim());
    const den = parseInt(document.getElementById("denominator").value.trim());

    if (isNaN(num) || isNaN(den)) {
        area.innerHTML = `<div class="error-box">⚠️ Please enter both numerator and denominator.</div>`;
        return;
    }
    if (den === 0) {
        area.innerHTML = `<div class="error-box">⚠️ Denominator cannot be zero — division by zero is undefined.</div>`;
        return;
    }

    const cf = gcd(Math.abs(num), Math.abs(den));
    let sn = num / cf;
    let sd = den / cf;

    // Keep negative sign on numerator only
    if (sd < 0) { sn = -sn; sd = Math.abs(sd); }

    const alreadySimplified = cf === 1;
    const isWhole = sd === 1;

    const displayValue = isWhole ? `${sn}` : `${sn} / ${sd}`;
    const detailText = alreadySimplified
        ? "This fraction is already in its simplest form."
        : `Divided numerator and denominator by their HCF, which is <strong>${cf}</strong>.`;

    area.innerHTML = `
    <div class="result-box">
      <div class="result-label"> Simplified Form</div>
      <div class="result-value large">${displayValue}</div>
      <div class="result-detail">${detailText}${isWhole && !alreadySimplified ? " The result is a whole number!" : ""}</div>
      ${!alreadySimplified ? `
        <div class="result-detail">
          <div class="chips">
            <span class="chip">${num} / ${den}</span>
            <span style="color:var(--color-muted);font-weight:700;align-self:center">→</span>
            <span class="chip">${sn} / ${sd}</span>
          </div>
        </div>` : ""}
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    ["numerator", "denominator"].forEach(id => {
        document.getElementById(id)
            .addEventListener("keydown", e => { if (e.key === "Enter") simplifyFraction(); });
    });
});