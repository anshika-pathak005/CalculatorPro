/* ============================================================
   speed-distance-time.js- Logic for Speed, Distance & Time
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  updateSDTFields();
});

function updateSDTFields() {
  const target = document.getElementById("sdt-target").value;
  const container = document.getElementById("sdt-inputs");
  document.getElementById("result-area").innerHTML = "";

  if (target === "speed") {
    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 align-end">
        <div class="sm:col-span-2">
          <label class="input-label">Distance (D)</label>
          <input type="number" id="sdt-dist" class="calc-input" placeholder="e.g., 100" step="any">
        </div>
        <div>
          <label class="input-label">Unit</label>
          <select id="dist-unit" class="calc-input">
            <option value="km">km</option>
            <option value="m">meters (m)</option>
            <option value="mi">miles (mi)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 align-end">
        <div class="sm:col-span-2">
          <label class="input-label">Time (T)</label>
          <input type="number" id="sdt-time" class="calc-input" placeholder="e.g., 2" step="any">
        </div>
        <div>
          <label class="input-label">Unit</label>
          <select id="time-unit" class="calc-input">
            <option value="hr">hours (hr)</option>
            <option value="min">minutes (min)</option>
            <option value="sec">seconds (sec)</option>
          </select>
        </div>
      </div>`;
  } else if (target === "distance") {
    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 align-end">
        <div class="sm:col-span-2">
          <label class="input-label">Speed (S)</label>
          <input type="number" id="sdt-speed" class="calc-input" placeholder="e.g., 60" step="any">
        </div>
        <div>
          <label class="input-label">Unit</label>
          <select id="speed-unit" class="calc-input">
            <option value="kmh">km/h</option>
            <option value="ms">m/s</option>
            <option value="mph">mph</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 align-end">
        <div class="sm:col-span-2">
          <label class="input-label">Time (T)</label>
          <input type="number" id="sdt-time" class="calc-input" placeholder="e.g., 1.5" step="any">
        </div>
        <div>
          <label class="input-label">Unit</label>
          <select id="time-unit" class="calc-input">
            <option value="hr">hours (hr)</option>
            <option value="min">minutes (min)</option>
            <option value="sec">seconds (sec)</option>
          </select>
        </div>
      </div>`;
  } else if (target === "time") {
    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 align-end">
        <div class="sm:col-span-2">
          <label class="input-label">Distance (D)</label>
          <input type="number" id="sdt-dist" class="calc-input" placeholder="e.g., 150" step="any">
        </div>
        <div>
          <label class="input-label">Unit</label>
          <select id="dist-unit" class="calc-input">
            <option value="km">km</option>
            <option value="m">meters (m)</option>
            <option value="mi">miles (mi)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 align-end">
        <div class="sm:col-span-2">
          <label class="input-label">Speed (S)</label>
          <input type="number" id="sdt-speed" class="calc-input" placeholder="e.g., 50" step="any">
        </div>
        <div>
          <label class="input-label">Unit</label>
          <select id="speed-unit" class="calc-input">
            <option value="kmh">km/h</option>
            <option value="ms">m/s</option>
            <option value="mph">mph</option>
          </select>
        </div>
      </div>`;
  }
}

function calculateSDT() {
  const target = document.getElementById("sdt-target").value;
  const area = document.getElementById("result-area");

  // Helper conversions to SI (meters, seconds, m/s)
  const distToMeters = (val, unit) => {
    if (unit === "km") return val * 1000;
    if (unit === "mi") return val * 1609.344;
    return val; // m
  };

  const timeToSeconds = (val, unit) => {
    if (unit === "hr") return val * 3600;
    if (unit === "min") return val * 60;
    return val; // sec
  };

  const speedToMS = (val, unit) => {
    if (unit === "kmh") return val / 3.6; // (val * 1000) / 3600
    if (unit === "mph") return val * 0.44704;
    return val; // m/s
  };

  if (target === "speed") {
    const dVal = parseFloat(document.getElementById("sdt-dist").value.trim());
    const dUnit = document.getElementById("dist-unit").value;
    const tVal = parseFloat(document.getElementById("sdt-time").value.trim());
    const tUnit = document.getElementById("time-unit").value;

    if (isNaN(dVal) || isNaN(tVal)) {
      area.innerHTML = `<div class="error-box">Please fill in both Distance and Time values.</div>`;
      return;
    }
    if (tVal <= 0) {
      area.innerHTML = `<div class="error-box">Time must be greater than zero.</div>`;
      return;
    }

    const dMeters = distToMeters(dVal, dUnit);
    const tSec = timeToSeconds(tVal, tUnit);
    const speedMS = dMeters / tSec;

    const speedKMH = speedMS * 3.6;
    const speedMPH = speedMS / 0.44704;

    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Speed Calculation Result</div>
        <div class="result-value">${speedKMH.toFixed(2)} km/h</div>
        <div class="mt-2 text-sm font-semibold text-purple-800">Equivalent: ${speedMS.toFixed(2)} m/s | ${speedMPH.toFixed(2)} mph</div>

        <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
          <p class="font-bold text-purple-900">Step-by-step Solution:</p>
          <p>1. Formula: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">Speed = Distance ÷ Time</code></p>
          <p>2. Convert Distance to meters: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${dVal} ${dUnit} = ${dMeters} m</code></p>
          <p>3. Convert Time to seconds: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${tVal} ${tUnit} = ${tSec} s</code></p>
          <p>4. Speed in m/s = <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${dMeters} ÷ ${tSec} = ${speedMS.toFixed(4)} m/s</code></p>
          <p>5. Speed in km/h = <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${speedMS.toFixed(4)} × 3.6 = ${speedKMH.toFixed(2)} km/h</code></p>
        </div>
      </div>`;
  } else if (target === "distance") {
    const sVal = parseFloat(document.getElementById("sdt-speed").value.trim());
    const sUnit = document.getElementById("speed-unit").value;
    const tVal = parseFloat(document.getElementById("sdt-time").value.trim());
    const tUnit = document.getElementById("time-unit").value;

    if (isNaN(sVal) || isNaN(tVal)) {
      area.innerHTML = `<div class="error-box">Please fill in both Speed and Time values.</div>`;
      return;
    }
    if (sVal < 0 || tVal < 0) {
      area.innerHTML = `<div class="error-box">Values cannot be negative.</div>`;
      return;
    }

    const sMS = speedToMS(sVal, sUnit);
    const tSec = timeToSeconds(tVal, tUnit);
    const distMeters = sMS * tSec;

    const distKM = distMeters / 1000;
    const distMI = distMeters / 1609.344;

    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Distance Calculation Result</div>
        <div class="result-value">${distKM.toFixed(2)} km</div>
        <div class="mt-2 text-sm font-semibold text-purple-800">Equivalent: ${distMeters.toFixed(2)} meters | ${distMI.toFixed(2)} miles</div>

        <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
          <p class="font-bold text-purple-900">Step-by-step Solution:</p>
          <p>1. Formula: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">Distance = Speed × Time</code></p>
          <p>2. Convert Speed to m/s: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${sVal} ${sUnit} = ${sMS.toFixed(4)} m/s</code></p>
          <p>3. Convert Time to seconds: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${tVal} ${tUnit} = ${tSec} s</code></p>
          <p>4. Distance = <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${sMS.toFixed(4)} m/s × ${tSec} s = ${distMeters.toFixed(2)} meters (${distKM.toFixed(2)} km)</code></p>
        </div>
      </div>`;
  } else if (target === "time") {
    const dVal = parseFloat(document.getElementById("sdt-dist").value.trim());
    const dUnit = document.getElementById("dist-unit").value;
    const sVal = parseFloat(document.getElementById("sdt-speed").value.trim());
    const sUnit = document.getElementById("speed-unit").value;

    if (isNaN(dVal) || isNaN(sVal)) {
      area.innerHTML = `<div class="error-box">Please fill in both Distance and Speed values.</div>`;
      return;
    }
    if (sVal <= 0) {
      area.innerHTML = `<div class="error-box">Speed must be greater than zero.</div>`;
      return;
    }

    const dMeters = distToMeters(dVal, dUnit);
    const sMS = speedToMS(sVal, sUnit);
    const timeSec = dMeters / sMS;

    const timeMin = timeSec / 60;
    const timeHr = timeSec / 3600;

    area.innerHTML = `
      <div class="result-box">
        <div class="result-label">Time Calculation Result</div>
        <div class="result-value">${timeHr < 1 ? `${timeMin.toFixed(2)} minutes` : `${timeHr.toFixed(2)} hours`}</div>
        <div class="mt-2 text-sm font-semibold text-purple-800">Equivalent: ${timeHr.toFixed(2)} hrs | ${timeMin.toFixed(2)} mins | ${timeSec.toFixed(1)} secs</div>

        <div class="mt-4 pt-3 border-t border-purple-100 text-sm space-y-1">
          <p class="font-bold text-purple-900">Step-by-step Solution:</p>
          <p>1. Formula: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">Time = Distance ÷ Speed</code></p>
          <p>2. Convert Distance to meters: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${dVal} ${dUnit} = ${dMeters} m</code></p>
          <p>3. Convert Speed to m/s: <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${sVal} ${sUnit} = ${sMS.toFixed(4)} m/s</code></p>
          <p>4. Time = <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${dMeters} ÷ ${sMS.toFixed(4)} = ${timeSec.toFixed(2)} seconds</code></p>
          <p>5. Time in Hours = <code class="font-mono bg-purple-50 px-1.5 py-0.5 rounded">${timeSec.toFixed(2)} ÷ 3600 = ${timeHr.toFixed(2)} hours</code></p>
        </div>
      </div>`;
  }
}
