/* ============================================================
   percentage.js- Logic for Percentage Finder
   ============================================================ */

function switchTab(mode) {
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("panel-" + mode).classList.remove("hidden");
  document.querySelector(`[data-tab="${mode}"]`).classList.add("active");
  document.getElementById("result-area").innerHTML = "";
}

function calculatePercentage(mode) {
  const area = document.getElementById("result-area");

  if (mode === "whatpercent") {
    const x = parseFloat(document.getElementById("wp-x").value.trim());
    const y = parseFloat(document.getElementById("wp-y").value.trim());

    if (isNaN(x) || isNaN(y)) {
      area.innerHTML = `<div class="error-box">Please fill in both values.</div>`;
      return;
    }
    if (y === 0) {
      area.innerHTML = `<div class="error-box">Y cannot be zero.</div>`;
      return;
    }

    const result = +(x / y * 100).toFixed(4);
    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Result</div>
        <div class="result-value">${result}%</div>
        <div class="result-detail">${x} is <strong>${result}%</strong> of ${y}.</div>
        <div class="result-detail" style="font-style:italic">Formula: (${x} ÷ ${y}) × 100</div>
      </div>`;

  } else {
    const pct = parseFloat(document.getElementById("po-pct").value.trim());
    const y = parseFloat(document.getElementById("po-y").value.trim());

    if (isNaN(pct) || isNaN(y)) {
      area.innerHTML = `<div class="error-box">Please fill in both values.</div>`;
      return;
    }

    const result = +(pct / 100 * y).toFixed(4);
    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Result</div>
        <div class="result-value">${result}</div>
        <div class="result-detail">${pct}% of ${y} = <strong>${result}</strong>.</div>
        <div class="result-detail" style="font-style:italic">Formula: (${pct} ÷ 100) × ${y}</div>
      </div>`;
  }
}