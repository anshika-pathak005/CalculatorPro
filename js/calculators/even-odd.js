/* ============================================================
   even-odd.js — Logic for Even / Odd checker
   ============================================================ */

function checkEvenOdd() {
    const input = document.getElementById("eo-input");
    const area = document.getElementById("result-area");
    const n = parseInt(input.value.trim());

    if (isNaN(n) || input.value.trim() === "") {
        area.innerHTML = `<div class="error-box">⚠️ Please enter a valid whole number.</div>`;
        return;
    }

    const isEven = n % 2 === 0;
    const label = isEven ? "Even" : "Odd";
    const color = isEven ? "var(--color-secondary)" : "#c05621";
    const emoji = isEven ? "🔵" : "🟠";

    const detail = isEven
        ? `${n} ÷ 2 = ${n / 2} (no remainder), so it is even.`
        : `${n} ÷ 2 leaves remainder 1, so it is odd.`;

    const nearby = isEven
        ? [n - 2, n, n + 2].map(x => `<span class="chip">${x}</span>`).join("")
        : [n - 2, n, n + 2].map(x => `<span class="chip">${x}</span>`).join("");

    area.innerHTML = `
    <div class="result-box">
      <div class="result-label">${emoji} Result</div>
      <div class="result-value" style="color:${color}">${label}</div>
      <div class="result-detail">${detail}</div>
      <div class="result-detail">Nearest ${label.toLowerCase()} numbers:
        <div class="chips">${nearby}</div>
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("eo-input")
        .addEventListener("keydown", e => { if (e.key === "Enter") checkEvenOdd(); });
});


