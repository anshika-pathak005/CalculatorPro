/* ============================================================
   factors-multiples.js- Logic for Factors & Multiples
   ============================================================ */

function findFactors() {
    const area = document.getElementById("factor-result");
    const n = parseInt(document.getElementById("factor-input").value.trim());

    if (isNaN(n) || n < 1) {
        area.innerHTML = `<div class="error-box">Please enter a positive whole number.</div>`;
        return;
    }
    if (n > 10_000) {
        area.innerHTML = `<div class="error-box">Please enter a number up to 10,000.</div>`;
        return;
    }

    const factors = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) factors.push(i);
    }

    const chipsHtml = factors.map(f => `<span class="chip">${f}</span>`).join("");

    area.innerHTML = `
    <div class="result-box">
      <div class="result-label">All Factors of ${n}</div>
      <div class="result-value" style="font-size:1.1rem">${factors.length} factor${factors.length > 1 ? "s" : ""}</div>
      <div class="chips">${chipsHtml}</div>
    </div>`;
}

function findMultiples() {
    const area = document.getElementById("multiple-result");
    const n = parseInt(document.getElementById("multiple-input").value.trim());
    const count = parseInt(document.getElementById("count-input").value.trim()) || 10;

    if (isNaN(n) || n < 1) {
        area.innerHTML = `<div class="error-box">Please enter a positive whole number.</div>`;
        return;
    }
    if (count < 1 || count > 50) {
        area.innerHTML = `<div class="error-box">Count must be between 1 and 50.</div>`;
        return;
    }

    const multiples = Array.from({ length: count }, (_, i) => (i + 1) * n);
    const chipsHtml = multiples.map(m => `<span class="chip">${m}</span>`).join("");

    area.innerHTML = `
    <div class="result-box">
      <div class="result-label">First ${count} Multiples of ${n}</div>
      <div class="chips">${chipsHtml}</div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("factor-input")
        .addEventListener("keydown", e => { if (e.key === "Enter") findFactors(); });
    document.getElementById("multiple-input")
        .addEventListener("keydown", e => { if (e.key === "Enter") findMultiples(); });
});