/* ============================================================
   unit-converter.js- Complete Unit Converter
   Supports: Length, Weight, Volume, Time
   ============================================================ */

let currentCategory = 'length';

// Unit definitions and conversion factors (to base unit)
const unitData = {
  length: {
    name: 'Length',
    baseUnit: 'meter',
    units: {
      'kilometer (km)': { factor: 1000, symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      'hectometer (hm)': { factor: 100, symbol: 'hm', toBase: (v) => v * 100, fromBase: (v) => v / 100 },
      'decameter (dam)': { factor: 10, symbol: 'dam', toBase: (v) => v * 10, fromBase: (v) => v / 10 },
      'meter (m)': { factor: 1, symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      'decimeter (dm)': { factor: 0.1, symbol: 'dm', toBase: (v) => v * 0.1, fromBase: (v) => v / 0.1 },
      'centimeter (cm)': { factor: 0.01, symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      'millimeter (mm)': { factor: 0.001, symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 }
    }
  },
  weight: {
    name: 'Weight',
    baseUnit: 'gram',
    units: {
      'kilogram (kg)': { factor: 1000, symbol: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      'hectogram (hg)': { factor: 100, symbol: 'hg', toBase: (v) => v * 100, fromBase: (v) => v / 100 },
      'decagram (dag)': { factor: 10, symbol: 'dag', toBase: (v) => v * 10, fromBase: (v) => v / 10 },
      'gram (g)': { factor: 1, symbol: 'g', toBase: (v) => v, fromBase: (v) => v },
      'decigram (dg)': { factor: 0.1, symbol: 'dg', toBase: (v) => v * 0.1, fromBase: (v) => v / 0.1 },
      'centigram (cg)': { factor: 0.01, symbol: 'cg', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      'milligram (mg)': { factor: 0.001, symbol: 'mg', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 }
    }
  },
  volume: {
    name: 'Volume',
    baseUnit: 'liter',
    units: {
      'kiloliter (kL)': { factor: 1000, symbol: 'kL', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      'hectoliter (hL)': { factor: 100, symbol: 'hL', toBase: (v) => v * 100, fromBase: (v) => v / 100 },
      'decaliter (daL)': { factor: 10, symbol: 'daL', toBase: (v) => v * 10, fromBase: (v) => v / 10 },
      'liter (L)': { factor: 1, symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      'deciliter (dL)': { factor: 0.1, symbol: 'dL', toBase: (v) => v * 0.1, fromBase: (v) => v / 0.1 },
      'centiliter (cL)': { factor: 0.01, symbol: 'cL', toBase: (v) => v * 0.01, fromBase: (v) => v / 0.01 },
      'milliliter (mL)': { factor: 0.001, symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 }
    }
  },
  time: {
    name: 'Time',
    baseUnit: 'second',
    units: {
      'day (d)': { factor: 86400, symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      'hour (h)': { factor: 3600, symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      'minute (min)': { factor: 60, symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      'second (s)': { factor: 1, symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      'millisecond (ms)': { factor: 0.001, symbol: 'ms', toBase: (v) => v * 0.001, fromBase: (v) => v / 0.001 }
    }
  }
};

// Switch category
function switchCategory(category) {
  currentCategory = category;

  // Update tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-cat') === category) {
      tab.classList.add('active');
    }
  });

  // Update unit dropdowns
  updateUnitDropdowns();

  // Recalculate
  convert();
}

// Update unit dropdowns based on selected category
function updateUnitDropdowns() {
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');

  if (!fromSelect || !toSelect) return;

  const units = unitData[currentCategory].units;
  const unitNames = Object.keys(units);

  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  unitNames.forEach(unit => {
    const option1 = document.createElement('option');
    option1.value = unit;
    option1.textContent = unit;
    fromSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = unit;
    option2.textContent = unit;
    toSelect.appendChild(option2);
  });

  // Set default selections
  if (unitNames.length >= 2) {
    fromSelect.value = unitNames[0];
    toSelect.value = unitNames[unitNames.length - 1];
  }
}

// Swap units
function swapUnits() {
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');

  const fromValue = fromSelect.value;
  const toValue = toSelect.value;

  fromSelect.value = toValue;
  toSelect.value = fromValue;

  convert();
}

// Clear all
function clearConverter() {
  document.getElementById('input-value').value = '';
  document.getElementById('result-area').innerHTML = '';
  document.getElementById('preview-result').innerHTML = '<span class="placeholder">Enter value to convert</span>';
}

// Format number
function formatNumber(num, precision = 6) {
  if (isNaN(num)) return '0';
  if (Math.abs(num) < 0.000001 && num !== 0) return num.toExponential(6);
  const fixed = parseFloat(num.toFixed(precision));
  return fixed.toString();
}

// Convert function
function convert() {
  const inputValue = document.getElementById('input-value').value;
  const fromUnit = document.getElementById('from-unit').value;
  const toUnit = document.getElementById('to-unit').value;
  const previewDiv = document.getElementById('preview-result');
  const resultArea = document.getElementById('result-area');

  if (!fromUnit || !toUnit) return;

  const value = parseFloat(inputValue);

  if (isNaN(value) || inputValue === '') {
    previewDiv.innerHTML = '<span class="placeholder">Enter a valid number</span>';
    resultArea.innerHTML = '';
    return;
  }

  const units = unitData[currentCategory].units;
  const fromUnitData = units[fromUnit];
  const toUnitData = units[toUnit];

  if (!fromUnitData || !toUnitData) return;

  // Convert to base unit first, then to target unit
  const baseValue = fromUnitData.toBase(value);
  const result = toUnitData.fromBase(baseValue);

  const formattedResult = formatNumber(result);

  // Update preview
  previewDiv.innerHTML = `
    <span class="preview-value">${value} ${fromUnitData.symbol} = ${formattedResult} ${toUnitData.symbol}</span>
  `;

  // Get step-by-step explanation
  const steps = getConversionSteps(value, fromUnit, toUnit, fromUnitData, toUnitData, result);

  // Get common conversions
  const commonConversions = getCommonConversions(value, fromUnit, toUnit);

  // Build steps HTML
  let stepsHtml = '';
  steps.forEach((step, idx) => {
    stepsHtml += `
      <div class="step-item">
        <span class="step-number">${idx + 1}.</span>
        <span class="step-text">${step}</span>
      </div>
    `;
  });

  // Display result
  resultArea.innerHTML = `
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:math" data-width="16"></span>
        Conversion Result
      </div>
      <div class="result-value">${value} ${fromUnitData.symbol} = ${formattedResult} ${toUnitData.symbol}</div>
    </div>
    
    <div class="result-card formula-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:formula" data-width="16"></span>
        Conversion Formula
      </div>
      <div class="formula-text">
        ${value} ${fromUnitData.symbol} × ${getConversionFactor(fromUnitData, toUnitData)} = ${formattedResult} ${toUnitData.symbol}
      </div>
    </div>
    
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:list-numbers" data-width="16"></span>
        Step-by-Step Conversion
      </div>
      <div class="steps-container">
        ${stepsHtml}
      </div>
    </div>
    
    <div class="result-card" style="background: var(--color-surface);">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
        Common ${unitData[currentCategory].name} Conversions
      </div>
      <div class="conversions-table">
        ${commonConversions}
      </div>
    </div>
  `;
}

// Get conversion factor
function getConversionFactor(fromUnitData, toUnitData) {
  const factor = fromUnitData.factor / toUnitData.factor;
  if (factor >= 1) {
    return factor.toString();
  } else {
    return `1/${(1 / factor).toString()}`;
  }
}

// Get step-by-step explanation
function getConversionSteps(value, fromUnit, toUnit, fromUnitData, toUnitData, result) {
  const steps = [];

  steps.push(`Start with ${value} ${fromUnit}`);

  if (fromUnitData.factor !== 1) {
    steps.push(`Convert ${fromUnit} to ${unitData[currentCategory].baseUnit}: ${value} × ${fromUnitData.factor} = ${fromUnitData.toBase(value)} ${unitData[currentCategory].baseUnit}`);
  } else {
    steps.push(`${value} ${fromUnit} is already in ${unitData[currentCategory].baseUnit}`);
  }

  const baseValue = fromUnitData.toBase(value);

  if (toUnitData.factor !== 1) {
    steps.push(`Convert ${unitData[currentCategory].baseUnit} to ${toUnit}: ${baseValue} ÷ ${toUnitData.factor} = ${result} ${toUnit}`);
  } else {
    steps.push(`${baseValue} ${unitData[currentCategory].baseUnit} is the final result in ${toUnit}`);
  }

  steps.push(`Final result: ${value} ${fromUnit} = ${formatNumber(result)} ${toUnit}`);

  return steps;
}

// Get common conversions
function getCommonConversions(value, fromUnit, toUnit) {
  const units = unitData[currentCategory].units;
  const unitNames = Object.keys(units);

  let conversions = '';
  const fromUnitData = units[fromUnit];

  // Show conversions to 3 other common units
  const otherUnits = unitNames.filter(u => u !== fromUnit).slice(0, 6);

  otherUnits.forEach(unit => {
    const unitData = units[unit];
    const converted = unitData.fromBase(fromUnitData.toBase(value));
    conversions += `
      <div class="conversion-item">
        ${value} ${fromUnitData.symbol} = ${formatNumber(converted)} ${unitData.symbol}
      </div>
    `;
  });

  return conversions;
}

// Add event listeners
function addConverterEventListeners() {
  const input = document.getElementById('input-value');
  if (input) {
    input.addEventListener('input', () => convert());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') convert();
    });
  }

  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');

  if (fromSelect) fromSelect.addEventListener('change', () => convert());
  if (toSelect) toSelect.addEventListener('change', () => convert());
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateUnitDropdowns();
  addConverterEventListeners();
  convert();
});