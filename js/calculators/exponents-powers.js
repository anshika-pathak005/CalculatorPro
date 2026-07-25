/* ============================================================
   exponents-powers.js- Logic for Exponents & Powers Calculator
   ============================================================ */

function switchExponentTab(mode) {
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("panel-" + mode).classList.remove("hidden");
  document.querySelector(`[data-tab="${mode}"]`).classList.add("active");
  document.getElementById("result-area").innerHTML = "";
}

function toggleSecondTerm() {
  const op = document.getElementById("exp-op").value;
  const container = document.getElementById("second-term-container");
  if (op === "add" || op === "sub" || op === "mul" || op === "div" || op === "pow") {
    container.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
  }
}

function calculateExponent() {
  const area = document.getElementById("result-area");
  const a = parseFloat(document.getElementById("exp-a").value.trim());
  const m = parseFloat(document.getElementById("exp-m").value.trim());
  const op = document.getElementById("exp-op").value;

  if (isNaN(a) || isNaN(m)) {
    area.innerHTML = `<div class="error-box">Please fill in Base (a) and Exponent (m).</div>`;
    return;
  }

  let html = "";

  if (op === "single") {
    const res = Math.pow(a, m);
    html = `
      <div class="result-box">
        <div class="result-label">Power Evaluation</div>
        <div class="result-value">${a}<sup>${m}</sup> = ${res}</div>
        <div class="mt-3 text-sm space-y-1">
          <p class="font-bold text-purple-900">Explanation & Steps:</p>
          ${m === 0 ? `<p>1. <strong>Zero Exponent Rule:</strong> Any non-zero number to power 0 equals 1 (<code class="font-mono bg-purple-50 px-1.5 rounded">${a}⁰ = 1</code>).</p>` : ""}
          ${m < 0 ? `<p>1. <strong>Negative Exponent Rule:</strong> <code class="font-mono bg-purple-50 px-1.5 rounded">${a}^(${m}) = 1 / (${a}^${Math.abs(m)}) = 1 / ${Math.pow(a, Math.abs(m))} = ${res}</code></p>` : ""}
          ${m > 0 ? `<p>1. Multiplying base <strong>${a}</strong> by itself <strong>${m}</strong> times: <code class="font-mono bg-purple-50 px-1.5 rounded">${Array(Math.min(m, 10)).fill(a).join(" × ")}${m > 10 ? "..." : ""} = ${res}</code></p>` : ""}
        </div>
      </div>`;
  } else {
    const bInput = document.getElementById("exp-b").value.trim();
    const nInput = document.getElementById("exp-n").value.trim();
    const b = bInput !== "" ? parseFloat(bInput) : a;
    const n = parseFloat(nInput);

    if (isNaN(n)) {
      area.innerHTML = `<div class="error-box">Please enter Second Exponent (n).</div>`;
      return;
    }

    const termA = Math.pow(a, m);

    if (op === "add") {
      const termB = Math.pow(b, n);
      const sum = termA + termB;
      html = `
        <div class="result-box">
          <div class="result-label">Exponent Addition Results</div>
          <div class="result-value">${a}<sup>${m}</sup> + ${b}<sup>${n}</sup> = ${sum}</div>
          <div class="mt-3 text-sm space-y-1">
            <p class="font-bold text-purple-900">Step-by-step Solution:</p>
            <p>1. Evaluate first term: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${a}<sup>${m}</sup> = ${termA}</code></p>
            <p>2. Evaluate second term: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${b}<sup>${n}</sup> = ${termB}</code></p>
            <p>3. Add both values: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${termA} + ${termB} = ${sum}</code></p>
          </div>
        </div>`;
    } else if (op === "sub") {
      const termB = Math.pow(b, n);
      const diff = termA - termB;
      html = `
        <div class="result-box">
          <div class="result-label">Exponent Subtraction Results</div>
          <div class="result-value">${a}<sup>${m}</sup> - ${b}<sup>${n}</sup> = ${diff}</div>
          <div class="mt-3 text-sm space-y-1">
            <p class="font-bold text-purple-900">Step-by-step Solution:</p>
            <p>1. Evaluate first term: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${a}<sup>${m}</sup> = ${termA}</code></p>
            <p>2. Evaluate second term: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${b}<sup>${n}</sup> = ${termB}</code></p>
            <p>3. Subtract second from first: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${termA} - ${termB} = ${diff}</code></p>
          </div>
        </div>`;
    } else if (op === "mul") {
      const totalPower = m + n;
      const res = Math.pow(a, totalPower);
      html = `
        <div class="result-box">
          <div class="result-label">Product Law of Exponents</div>
          <div class="result-value">${a}<sup>${m}</sup> × ${a}<sup>${n}</sup> = ${a}<sup>${totalPower}</sup> = ${res}</div>
          <div class="mt-3 text-sm space-y-1">
            <p class="font-bold text-purple-900">Step-by-step Solution:</p>
            <p>1. <strong>Product Law:</strong> <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">aᵐ × aⁿ = aᵐ⁺ⁿ</code></p>
            <p>2. Add exponents: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${m} + ${n} = ${totalPower}</code></p>
            <p>3. Final result: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${a}<sup>${totalPower}</sup> = ${res}</code></p>
          </div>
        </div>`;
    } else if (op === "div") {
      const diffPower = m - n;
      const res = Math.pow(a, diffPower);
      html = `
        <div class="result-box">
          <div class="result-label">Quotient Law of Exponents</div>
          <div class="result-value">${a}<sup>${m}</sup> ÷ ${a}<sup>${n}</sup> = ${a}<sup>${diffPower}</sup> = ${res}</div>
          <div class="mt-3 text-sm space-y-1">
            <p class="font-bold text-purple-900">Step-by-step Solution:</p>
            <p>1. <strong>Quotient Law:</strong> <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">aᵐ ÷ aⁿ = aᵐ⁻ⁿ</code></p>
            <p>2. Subtract exponents: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${m} - ${n} = ${diffPower}</code></p>
            <p>3. Final result: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${a}<sup>${diffPower}</sup> = ${res}</code></p>
          </div>
        </div>`;
    } else if (op === "pow") {
      const prodPower = m * n;
      const res = Math.pow(a, prodPower);
      html = `
        <div class="result-box">
          <div class="result-label">Power of a Power Law</div>
          <div class="result-value">(${a}<sup>${m}</sup>)<sup>${n}</sup> = ${a}<sup>${prodPower}</sup> = ${res}</div>
          <div class="mt-3 text-sm space-y-1">
            <p class="font-bold text-purple-900">Step-by-step Solution:</p>
            <p>1. <strong>Power of Power Law:</strong> <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">(aᵐ)ⁿ = aᵐˣⁿ</code></p>
            <p>2. Multiply exponents: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${m} × ${n} = ${prodPower}</code></p>
            <p>3. Final result: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded text-purple-800">${a}<sup>${prodPower}</sup> = ${res}</code></p>
          </div>
        </div>`;
    }
  }

  area.innerHTML = html;
}

function convertScientific() {
  const area = document.getElementById("result-area");
  const num = parseFloat(document.getElementById("sci-num").value.trim());

  if (isNaN(num)) {
    area.innerHTML = `<div class="error-box">Please enter a valid number.</div>`;
    return;
  }

  if (num === 0) {
    area.innerHTML = `<div class="result-box"><div class="result-value">0</div></div>`;
    return;
  }

  const expString = num.toExponential(); // e.g. "4.5e+6" or "7.8e-4"
  const [mantissa, exponent] = expString.split("e");
  const expNum = parseInt(exponent, 10);

  area.innerHTML = `
    <div class="result-box">
      <div class="result-label">Scientific Notation Result</div>
      <div class="result-value">${parseFloat(mantissa).toFixed(4)} × 10<sup>${expNum}</sup></div>
      <div class="mt-3 text-sm space-y-1">
        <p class="font-bold text-purple-900">Explanation:</p>
        <p>1. Scientific Form is written as <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">a × 10ⁿ</code> where 1 ≤ |a| < 10.</p>
        <p>2. Mantissa (a) = <strong>${parseFloat(mantissa).toFixed(4)}</strong></p>
        <p>3. Exponent (n) = <strong>${expNum}</strong> (moved decimal point by ${Math.abs(expNum)} places ${expNum >= 0 ? "left" : "right"}).</p>
      </div>
    </div>`;
}
