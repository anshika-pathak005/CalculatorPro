/* ============================================================
   prime.js — Logic for Prime / Composite checker
   ============================================================ */

function getFactors(n) {
    const factors = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) factors.push(i);
    }
    return factors;
}

function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function checkPrimeComposite() {
    const input = document.getElementById("num-input");
    const area = document.getElementById("result-area");
    const n = parseInt(input.value.trim());

    if (isNaN(n) || input.value.trim() === "") {
        area.innerHTML = `<div class="error-box">Please enter a valid number.</div>`;
        return;
    }
    if (n < 1) {
        area.innerHTML = `<div class="error-box">Please enter a positive whole number (1 or more).</div>`;
        return;
    }
    if (n > 1_000_000) {
        area.innerHTML = `<div class="error-box"> Please enter a number up to 1,000,000.</div>`;
        return;
    }

    const factors = getFactors(n);
    const chipsHtml = factors.map(f => `<span class="chip">${f}</span>`).join("");

    if (n === 1) {
        area.innerHTML = `
      <div class="result-box">
        <div class="result-label"> Result</div>
        <div class="result-value">Neither</div>
        <div class="result-detail">1 is neither prime nor composite.</div>
        <div class="result-detail">Factors: <div class="chips">${chipsHtml}</div></div>
      </div>`;
        return;
    }

    if (isPrime(n)) {
        area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Result</div>
        <div class="result-value">Prime ✓</div>
        <div class="result-detail">${n} has exactly 2 factors — 1 and itself.</div>
        <div class="result-detail">Factors: <div class="chips">${chipsHtml}</div></div>
      </div>`;
    } else {
        area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Result</div>
        <div class="result-value">Composite</div>
        <div class="result-detail">${n} has ${factors.length} factors, so it is composite.</div>
        <div class="result-detail">Factors: <div class="chips">${chipsHtml}</div></div>
      </div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("num-input")
        .addEventListener("keydown", e => { if (e.key === "Enter") checkPrimeComposite(); });
});