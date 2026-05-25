/* ============================================================
   lcm-hcf.js — Logic for LCM & HCF calculator
   ============================================================ */

function gcd(a, b) {
    while (b !== 0) [a, b] = [b, a % b];
    return a;
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function calculateLCMHCF() {
    const area = document.getElementById("result-area");
    const n1 = parseInt(document.getElementById("num1").value.trim());
    const n2 = parseInt(document.getElementById("num2").value.trim());
    const n3raw = document.getElementById("num3").value.trim();
    const has3 = n3raw !== "";
    const n3 = has3 ? parseInt(n3raw) : null;

    if (isNaN(n1) || isNaN(n2)) {
        area.innerHTML = `<div class="error-box">Please enter at least two valid numbers.</div>`;
        return;
    }
    if (n1 < 1 || n2 < 1 || (has3 && (isNaN(n3) || n3 < 1))) {
        area.innerHTML = `<div class="error-box">All numbers must be positive whole numbers.</div>`;
        return;
    }
    if ([n1, n2, n3].some(x => x !== null && x > 10_000)) {
        area.innerHTML = `<div class="error-box">Please enter numbers up to 10,000.</div>`;
        return;
    }

    let hcfResult, lcmResult, numsLabel;

    if (has3) {
        hcfResult = gcd(gcd(n1, n2), n3);
        lcmResult = lcm(lcm(n1, n2), n3);
        numsLabel = `${n1}, ${n2}, and ${n3}`;
    } else {
        hcfResult = gcd(n1, n2);
        lcmResult = lcm(n1, n2);
        numsLabel = `${n1} and ${n2}`;
    }

    area.innerHTML = `
    <div class="result-pair">
      <div class="result-box">
        <div class="result-label">HCF — Highest Common Factor</div>
        <div class="result-value">${hcfResult}</div>
        <div class="result-detail">Largest number that divides ${numsLabel} exactly.</div>
      </div>
      <div class="result-box">
        <div class="result-label">LCM — Lowest Common Multiple</div>
        <div class="result-value">${lcmResult}</div>
        <div class="result-detail">Smallest number that is a multiple of ${numsLabel}.</div>
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    ["num1", "num2", "num3"].forEach(id => {
        document.getElementById(id)
            .addEventListener("keydown", e => { if (e.key === "Enter") calculateLCMHCF(); });
    });
});