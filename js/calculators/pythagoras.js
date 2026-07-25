/* ============================================================
   pythagoras.js- Logic for Pythagorean Theorem Calculator
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  updatePythFields();
});

function switchPythagorasTab(mode) {
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("panel-" + mode).classList.remove("hidden");
  document.querySelector(`[data-tab="${mode}"]`).classList.add("active");
  document.getElementById("result-area").innerHTML = "";
}

function updatePythFields() {
  const target = document.getElementById("pyth-target").value;
  const container = document.getElementById("pyth-inputs");
  document.getElementById("result-area").innerHTML = "";

  if (target === "c") {
    container.innerHTML = `
      <div>
        <label class="input-label">Leg a</label>
        <input type="number" id="py-a" class="calc-input" placeholder="e.g., 3" step="any">
      </div>
      <div>
        <label class="input-label">Base b</label>
        <input type="number" id="py-b" class="calc-input" placeholder="e.g., 4" step="any">
      </div>`;
  } else if (target === "a") {
    container.innerHTML = `
      <div>
        <label class="input-label">Hypotenuse c (Longest side)</label>
        <input type="number" id="py-c" class="calc-input" placeholder="e.g., 5" step="any">
      </div>
      <div>
        <label class="input-label">Base b</label>
        <input type="number" id="py-b" class="calc-input" placeholder="e.g., 4" step="any">
      </div>`;
  } else if (target === "b") {
    container.innerHTML = `
      <div>
        <label class="input-label">Hypotenuse c (Longest side)</label>
        <input type="number" id="py-c" class="calc-input" placeholder="e.g., 5" step="any">
      </div>
      <div>
        <label class="input-label">Leg a</label>
        <input type="number" id="py-a" class="calc-input" placeholder="e.g., 3" step="any">
      </div>`;
  }
}

function calculatePythagoras() {
  const target = document.getElementById("pyth-target").value;
  const area = document.getElementById("result-area");

  if (target === "c") {
    const a = parseFloat(document.getElementById("py-a").value.trim());
    const b = parseFloat(document.getElementById("py-b").value.trim());

    if (isNaN(a) || isNaN(b)) {
      area.innerHTML = `<div class="error-box">Please enter values for leg a and base b.</div>`;
      return;
    }
    if (a <= 0 || b <= 0) {
      area.innerHTML = `<div class="error-box">Side lengths must be positive.</div>`;
      return;
    }

    const cSq = a * a + b * b;
    const c = Math.sqrt(cSq);

    const perimeter = a + b + c;
    const triArea = 0.5 * a * b;
    const angleA = (Math.atan(a / b) * 180) / Math.PI;
    const angleB = 90 - angleA;

    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Result- Hypotenuse (c)</div>
        <div class="result-value">c = ${c % 1 === 0 ? c : c.toFixed(4)}</div>
        <div class="mt-2 text-sm font-semibold text-purple-800">Perimeter = ${perimeter.toFixed(2)} | Area = ${triArea.toFixed(2)}</div>
        <div class="text-xs text-gray-600">Angles: ∠A = ${angleA.toFixed(1)}°, ∠B = ${angleB.toFixed(1)}°, ∠C = 90°</div>

        <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
          <p class="font-bold text-purple-900">Step-by-step Solution:</p>
          <p>1. Formula: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">c = √(a² + b²)</code></p>
          <p>2. Square sides: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">a² = ${a}² = ${a * a}</code> and <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">b² = ${b}² = ${b * b}</code></p>
          <p>3. Sum of squares: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${a * a} + ${b * b} = ${cSq}</code></p>
          <p>4. Take square root: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">c = √${cSq} = ${c % 1 === 0 ? c : c.toFixed(4)}</code></p>
        </div>
      </div>`;
  } else if (target === "a" || target === "b") {
    const c = parseFloat(document.getElementById("py-c").value.trim());
    const known = target === "a" ? parseFloat(document.getElementById("py-b").value.trim()) : parseFloat(document.getElementById("py-a").value.trim());
    const knownName = target === "a" ? "b" : "a";
    const targetName = target;

    if (isNaN(c) || isNaN(known)) {
      area.innerHTML = `<div class="error-box">Please enter values for Hypotenuse c and side ${knownName}.</div>`;
      return;
    }
    if (c <= 0 || known <= 0) {
      area.innerHTML = `<div class="error-box">Side lengths must be positive.</div>`;
      return;
    }
    if (c <= known) {
      area.innerHTML = `<div class="error-box">Hypotenuse c must be strictly larger than side ${knownName}.</div>`;
      return;
    }

    const missingSq = c * c - known * known;
    const missing = Math.sqrt(missingSq);

    const legA = target === "a" ? missing : known;
    const legB = target === "b" ? missing : known;

    const perimeter = legA + legB + c;
    const triArea = 0.5 * legA * legB;

    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Result- Side (${targetName})</div>
        <div class="result-value">${targetName} = ${missing % 1 === 0 ? missing : missing.toFixed(4)}</div>
        <div class="mt-2 text-sm font-semibold text-purple-800">Perimeter = ${perimeter.toFixed(2)} | Area = ${triArea.toFixed(2)}</div>

        <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
          <p class="font-bold text-purple-900">Step-by-step Solution:</p>
          <p>1. Formula: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${targetName} = √(c² - ${knownName}²)</code></p>
          <p>2. Squares: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">c² = ${c}² = ${c * c}</code> and <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${knownName}² = ${known}² = ${known * known}</code></p>
          <p>3. Subtract squares: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${c * c} - ${known * known} = ${missingSq}</code></p>
          <p>4. Take square root: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${targetName} = √${missingSq} = ${missing % 1 === 0 ? missing : missing.toFixed(4)}</code></p>
        </div>
      </div>`;
  }
}

function checkTriplet() {
  const area = document.getElementById("result-area");
  let a = parseFloat(document.getElementById("trip-a").value.trim());
  let b = parseFloat(document.getElementById("trip-b").value.trim());
  let c = parseFloat(document.getElementById("trip-c").value.trim());

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    area.innerHTML = `<div class="error-box">Please fill in all three side lengths.</div>`;
    return;
  }
  if (a <= 0 || b <= 0 || c <= 0) {
    area.innerHTML = `<div class="error-box">All sides must be positive numbers.</div>`;
    return;
  }

  // Sort so c is max
  const sides = [a, b, c].sort((x, y) => x - y);
  [a, b, c] = sides;

  const leftSum = a * a + b * b;
  const rightVal = c * c;
  const isTriplet = Math.abs(leftSum - rightVal) < 1e-6;

  if (isTriplet) {
    area.innerHTML = `
      <div class="result-box bg-emerald-50 border-emerald-200">
        <div class="result-label text-emerald-800">Pythagorean Triplet Verified!</div>
        <div class="result-value text-emerald-700">(${a}, ${b}, ${c}) is a Valid Triplet</div>
        <div class="mt-3 text-sm text-emerald-900 space-y-1">
          <p>Check: <code class="font-mono bg-white px-2 py-0.5 rounded text-emerald-800">${a}² + ${b}² = ${a * a} + ${b * b} = ${leftSum}</code></p>
          <p>Hypotenuse squared: <code class="font-mono bg-white px-2 py-0.5 rounded text-emerald-800">${c}² = ${rightVal}</code></p>
          <p class="font-semibold text-emerald-700">Since ${leftSum} = ${rightVal}, these sides form a perfect right triangle!</p>
        </div>
      </div>`;
  } else {
    area.innerHTML = `
      <div class="result-box bg-rose-50 border-rose-200">
        <div class="result-label text-rose-800">Not a Pythagorean Triplet</div>
        <div class="result-value text-rose-700">(${a}, ${b}, ${c}) is NOT a Triplet</div>
        <div class="mt-3 text-sm text-rose-900 space-y-1">
          <p>Left side: <code class="font-mono bg-white px-2 py-0.5 rounded text-rose-800">${a}² + ${b}² = ${a * a} + ${b * b} = ${leftSum}</code></p>
          <p>Right side: <code class="font-mono bg-white px-2 py-0.5 rounded text-rose-800">${c}² = ${rightVal}</code></p>
          <p class="font-semibold text-rose-700">${leftSum} ≠ ${rightVal}, so these lengths cannot form a right triangle.</p>
        </div>
      </div>`;
  }
}
