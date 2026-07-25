/* ============================================================
   interest-calculator.js- Logic for SI and CI Calculator
   ============================================================ */

function switchInterestTab(mode) {
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("panel-" + mode).classList.remove("hidden");
  document.querySelector(`[data-tab="${mode}"]`).classList.add("active");
  document.getElementById("result-area").innerHTML = "";
}

function calculateSI() {
  const area = document.getElementById("result-area");
  const p = parseFloat(document.getElementById("si-p").value.trim());
  const r = parseFloat(document.getElementById("si-r").value.trim());
  const t = parseFloat(document.getElementById("si-t").value.trim());

  if (isNaN(p) || isNaN(r) || isNaN(t)) {
    area.innerHTML = `<div class="error-box">Please fill in Principal (P), Rate (R), and Time (T).</div>`;
    return;
  }

  if (p < 0 || r < 0 || t < 0) {
    area.innerHTML = `<div class="error-box">Values cannot be negative.</div>`;
    return;
  }

  const si = (p * r * t) / 100;
  const amount = p + si;

  area.innerHTML = `
    <div class="result-box">
      <div class="result-label">Simple Interest Results</div>
      <div class="result-value">Interest (SI) = ${si.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
      <div class="mt-2 text-lg font-semibold text-emerald-700">Total Amount (A) = ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
      
      <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
        <p class="font-bold text-purple-900">Step-by-step Solution:</p>
        <p>1. Formula: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">SI = (P × R × T) / 100</code></p>
        <p>2. Calculation: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">SI = (${p} × ${r} × ${t}) / 100 = ${si}</code></p>
        <p>3. Total Amount: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">A = P + SI = ${p} + ${si} = ${amount}</code></p>
      </div>
    </div>`;
}

function calculateCI() {
  const area = document.getElementById("result-area");
  const p = parseFloat(document.getElementById("ci-p").value.trim());
  const r = parseFloat(document.getElementById("ci-r").value.trim());
  const t = parseFloat(document.getElementById("ci-t").value.trim());
  const n = parseInt(document.getElementById("ci-n").value, 10);

  if (isNaN(p) || isNaN(r) || isNaN(t)) {
    area.innerHTML = `<div class="error-box">Please fill in Principal (P), Rate (R), and Time (T).</div>`;
    return;
  }

  if (p < 0 || r < 0 || t < 0) {
    area.innerHTML = `<div class="error-box">Values cannot be negative.</div>`;
    return;
  }

  const rateFraction = r / (100 * n);
  const totalPeriods = n * t;
  const amount = p * Math.pow(1 + rateFraction, totalPeriods);
  const ci = amount - p;

  const freqLabels = {
    1: "Annually",
    2: "Half-Yearly",
    4: "Quarterly",
    12: "Monthly",
  };

  area.innerHTML = `
    <div class="result-box">
      <div class="result-label">Compound Interest Results (${freqLabels[n]})</div>
      <div class="result-value">Compound Interest (CI) = ${ci.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
      <div class="mt-2 text-lg font-semibold text-emerald-700">Total Amount (A) = ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
      
      <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
        <p class="font-bold text-purple-900">Step-by-step Solution:</p>
        <p>1. Formula: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">A = P × (1 + R / (100 × n))^(n × t)</code></p>
        <p>2. Periodic Rate: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">r' = ${r} / (100 × ${n}) = ${rateFraction.toFixed(6)}</code></p>
        <p>3. Total Compounding Periods: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">N = ${n} × ${t} = ${totalPeriods}</code></p>
        <p>4. Amount: <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">A = ${p} × (1 + ${rateFraction.toFixed(6)})^${totalPeriods} = ${amount.toFixed(2)}</code></p>
        <p>5. CI = Amount - Principal = <code class="bg-purple-50 px-2 py-0.5 rounded text-purple-800 font-mono">${amount.toFixed(2)} - ${p} = ${ci.toFixed(2)}</code></p>
      </div>
    </div>`;
}
