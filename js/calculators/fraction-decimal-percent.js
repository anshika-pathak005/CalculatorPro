/* ============================================================
   fraction-decimal-percent.js — Fraction ↔ Decimal ↔ Percent Converter
   Enter any one value, get all three instantly!
   ============================================================ */

let isUpdating = false;

// GCD function
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a || 1;
}

// Simplify fraction
function simplifyFraction(num, den) {
    if (den === 0) return { numerator: 0, denominator: 1 };
    const g = gcd(num, den);
    let numerator = num / g;
    let denominator = den / g;

    if (denominator < 0) {
        numerator = -numerator;
        denominator = -denominator;
    }

    return { numerator, denominator };
}

// Convert decimal to fraction
function decimalToFraction(decimal) {
    if (isNaN(decimal) || decimal === null || decimal === '') return null;

    const tolerance = 1.0e-10;
    let sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);

    if (Math.abs(decimal - Math.round(decimal)) < tolerance) {
        return { numerator: sign * Math.round(decimal), denominator: 1 };
    }

    let bestNumerator = 1;
    let bestDenominator = 1;
    let bestError = Math.abs(decimal - bestNumerator / bestDenominator);

    for (let denominator = 1; denominator <= 10000; denominator++) {
        let numerator = Math.round(decimal * denominator);
        let error = Math.abs(decimal - numerator / denominator);

        if (error < bestError) {
            bestError = error;
            bestNumerator = numerator;
            bestDenominator = denominator;
        }
        if (bestError < tolerance) break;
    }

    return { numerator: sign * bestNumerator, denominator: bestDenominator };
}

// Convert fraction to decimal
function fractionToDecimal(num, den) {
    if (den === 0) return NaN;
    return num / den;
}

// Convert fraction to percent
function fractionToPercent(num, den) {
    if (den === 0) return NaN;
    return (num / den) * 100;
}

// Convert decimal to percent
function decimalToPercent(decimal) {
    return decimal * 100;
}

// Convert percent to decimal
function percentToDecimal(percent) {
    return percent / 100;
}

// Convert percent to fraction
function percentToFraction(percent) {
    const decimal = percentToDecimal(percent);
    return decimalToFraction(decimal);
}

// Format fraction for display
function formatFraction(num, den) {
    if (num === 0) return '0';
    if (den === 1) return `${num}`;
    return `${num}/${den}`;
}

// Format number (remove trailing zeros)
function formatNumber(num, precision = 6) {
    if (isNaN(num)) return '—';
    if (Math.abs(num) < 0.000001 && num !== 0) return num.toExponential(4);
    const fixed = parseFloat(num.toFixed(precision));
    return fixed.toString();
}

// Update preview
function updatePreview(fraction, decimal, percent) {
    const previewFraction = document.getElementById('preview-fraction');
    const previewDecimal = document.getElementById('preview-decimal');
    const previewPercent = document.getElementById('preview-percent');

    if (previewFraction) previewFraction.textContent = fraction || '—';
    if (previewDecimal) previewDecimal.textContent = decimal || '—';
    if (previewPercent) previewPercent.textContent = percent || '—';
}

// Update from fraction
function updateFromFraction() {
    if (isUpdating) return;
    isUpdating = true;

    const num = parseFloat(document.getElementById('frac-num').value);
    const den = parseFloat(document.getElementById('frac-den').value);

    // Check if fraction inputs are valid
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
        const decimal = fractionToDecimal(num, den);
        const percent = fractionToPercent(num, den);

        document.getElementById('decimal-val').value = formatNumber(decimal);
        document.getElementById('percent-val').value = formatNumber(percent);

        updatePreview(formatFraction(num, den), formatNumber(decimal), formatNumber(percent) + '%');
        displayDetailedResults(num, den, decimal, percent);
    }
    else if ((!isNaN(num) && den === 0) || (num === '' && den !== '')) {
        showError('Denominator cannot be zero');
        document.getElementById('decimal-val').value = '';
        document.getElementById('percent-val').value = '';
        updatePreview('—', '—', '—');
    }
    else if ((num === '' && den === '') || (isNaN(num) && isNaN(den))) {
        // Both empty - do nothing
    }
    else if (!isNaN(num) && den === '') {
        // Only numerator provided - treat as whole number
        const decimal = num;
        const percent = num * 100;
        document.getElementById('decimal-val').value = formatNumber(decimal);
        document.getElementById('percent-val').value = formatNumber(percent);
        updatePreview(num.toString(), formatNumber(decimal), formatNumber(percent) + '%');
        displayDetailedResults(num, 1, decimal, percent);
    }

    isUpdating = false;
}

// Update from decimal
function updateFromDecimal() {
    if (isUpdating) return;
    isUpdating = true;

    const decimal = parseFloat(document.getElementById('decimal-val').value);

    if (!isNaN(decimal)) {
        const percent = decimalToPercent(decimal);
        const fraction = decimalToFraction(decimal);

        document.getElementById('frac-num').value = fraction.numerator;
        document.getElementById('frac-den').value = fraction.denominator;
        document.getElementById('percent-val').value = formatNumber(percent);

        updatePreview(formatFraction(fraction.numerator, fraction.denominator), formatNumber(decimal), formatNumber(percent) + '%');
        displayDetailedResults(fraction.numerator, fraction.denominator, decimal, percent);
    }
    else if (decimal === '' || isNaN(decimal)) {
        // Clear other fields if decimal is cleared
        if (document.getElementById('frac-num').value === '' && document.getElementById('frac-den').value === '' && document.getElementById('percent-val').value === '') {
            // All empty - do nothing
        } else {
            document.getElementById('frac-num').value = '';
            document.getElementById('frac-den').value = '';
            document.getElementById('percent-val').value = '';
            updatePreview('—', '—', '—');
            clearDetailedResults();
        }
    }

    isUpdating = false;
}

// Update from percent
function updateFromPercent() {
    if (isUpdating) return;
    isUpdating = true;

    const percent = parseFloat(document.getElementById('percent-val').value);

    if (!isNaN(percent)) {
        const decimal = percentToDecimal(percent);
        const fraction = percentToFraction(percent);

        document.getElementById('frac-num').value = fraction.numerator;
        document.getElementById('frac-den').value = fraction.denominator;
        document.getElementById('decimal-val').value = formatNumber(decimal);

        updatePreview(formatFraction(fraction.numerator, fraction.denominator), formatNumber(decimal), formatNumber(percent) + '%');
        displayDetailedResults(fraction.numerator, fraction.denominator, decimal, percent);
    }
    else if (percent === '' || isNaN(percent)) {
        if (document.getElementById('frac-num').value === '' && document.getElementById('frac-den').value === '' && document.getElementById('decimal-val').value === '') {
            // All empty
        } else {
            document.getElementById('frac-num').value = '';
            document.getElementById('frac-den').value = '';
            document.getElementById('decimal-val').value = '';
            updatePreview('—', '—', '—');
            clearDetailedResults();
        }
    }

    isUpdating = false;
}

// Show error message
function showError(message) {
    const resultArea = document.getElementById('result-area');
    resultArea.innerHTML = `
    <div class="error-box">
      <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
      ${message}
    </div>
  `;

    setTimeout(() => {
        if (document.getElementById('result-area').innerHTML.includes(message)) {
            clearDetailedResults();
        }
    }, 3000);
}

// Clear detailed results
function clearDetailedResults() {
    const resultArea = document.getElementById('result-area');
    if (resultArea) {
        resultArea.innerHTML = '';
    }
}

// Display detailed results
function displayDetailedResults(num, den, decimal, percent) {
    const resultArea = document.getElementById('result-area');
    const simplified = simplifyFraction(num, den);

    const fromFraction = formatFraction(num, den);
    const toDecimal = formatNumber(decimal);
    const toPercent = formatNumber(percent);

    // Get conversion formulas
    let formulas = [];

    if (num !== 0 && den !== 0) {
        formulas.push({
            from: 'Fraction → Decimal',
            formula: `${fromFraction} = ${num} ÷ ${den} = ${toDecimal}`
        });
        formulas.push({
            from: 'Fraction → Percent',
            formula: `${fromFraction} = (${num} ÷ ${den}) × 100% = ${toPercent}%`
        });
        formulas.push({
            from: 'Decimal → Percent',
            formula: `${toDecimal} × 100% = ${toPercent}%`
        });
        formulas.push({
            from: 'Percent → Decimal',
            formula: `${toPercent}% ÷ 100 = ${toDecimal}`
        });
    }

    let simplifiedDisplay = '';
    if (simplified.numerator !== num || simplified.denominator !== den) {
        simplifiedDisplay = `
      <div class="result-card">
        <div class="result-card-title">
          <span class="iconify" data-icon="tabler:chart-line" data-width="16"></span>
          Simplified Fraction
        </div>
        <div class="result-conversion-row">
          <span class="conversion-type">Original:</span>
          <span class="conversion-value">${fromFraction}</span>
        </div>
        <div class="result-conversion-row">
          <span class="conversion-type">Simplified:</span>
          <span class="conversion-value">${formatFraction(simplified.numerator, simplified.denominator)}</span>
        </div>
      </div>
    `;
    }

    let formulasHtml = '';
    formulas.forEach(formula => {
        formulasHtml += `
      <div class="result-conversion-row">
        <span class="conversion-type">${formula.from}:</span>
        <span class="conversion-arrow">→</span>
        <span class="conversion-value">${formula.formula}</span>
      </div>
    `;
    });

    resultArea.innerHTML = `
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:math" data-width="16"></span>
        Conversion Summary
      </div>
      <div class="result-conversion-row">
        <span class="conversion-type">Fraction:</span>
        <span class="conversion-value">${fromFraction}</span>
      </div>
      <div class="result-conversion-row">
        <span class="conversion-type">Decimal:</span>
        <span class="conversion-value">${toDecimal}</span>
      </div>
      <div class="result-conversion-row">
        <span class="conversion-type">Percent:</span>
        <span class="conversion-value">${toPercent}%</span>
      </div>
    </div>
    
    ${simplifiedDisplay}
    
    <div class="result-card formula-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:formula" data-width="16"></span>
        Conversion Formulas
      </div>
      ${formulasHtml}
    </div>
    
    <div class="result-card" style="background: var(--color-surface);">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
        Quick Tips
      </div>
      <div class="result-conversion-row">
        <span class="conversion-value">• Fraction → Decimal: Divide numerator by denominator</span>
      </div>
      <div class="result-conversion-row">
        <span class="conversion-value">• Decimal → Percent: Multiply by 100</span>
      </div>
      <div class="result-conversion-row">
        <span class="conversion-value">• Percent → Decimal: Divide by 100</span>
      </div>
      <div class="result-conversion-row">
        <span class="conversion-value">• Percent → Fraction: Write over 100 and simplify</span>
      </div>
    </div>
  `;
}

// Clear individual fields
function clearFraction() {
    document.getElementById('frac-num').value = '';
    document.getElementById('frac-den').value = '';
    updateFromFraction();
}

function clearDecimal() {
    document.getElementById('decimal-val').value = '';
    updateFromDecimal();
}

function clearPercent() {
    document.getElementById('percent-val').value = '';
    updateFromPercent();
}

// Clear all
function clearAllConverter() {
    document.getElementById('frac-num').value = '';
    document.getElementById('frac-den').value = '';
    document.getElementById('decimal-val').value = '';
    document.getElementById('percent-val').value = '';
    updatePreview('—', '—', '—');
    clearDetailedResults();
}

// Add event listeners
function addEventListeners() {
    const fracNum = document.getElementById('frac-num');
    const fracDen = document.getElementById('frac-den');
    const decimalVal = document.getElementById('decimal-val');
    const percentVal = document.getElementById('percent-val');

    if (fracNum) {
        fracNum.addEventListener('input', updateFromFraction);
        fracNum.addEventListener('keydown', (e) => { if (e.key === 'Enter') updateFromFraction(); });
    }
    if (fracDen) {
        fracDen.addEventListener('input', updateFromFraction);
        fracDen.addEventListener('keydown', (e) => { if (e.key === 'Enter') updateFromFraction(); });
    }
    if (decimalVal) {
        decimalVal.addEventListener('input', updateFromDecimal);
        decimalVal.addEventListener('keydown', (e) => { if (e.key === 'Enter') updateFromDecimal(); });
    }
    if (percentVal) {
        percentVal.addEventListener('input', updateFromPercent);
        percentVal.addEventListener('keydown', (e) => { if (e.key === 'Enter') updateFromPercent(); });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
});