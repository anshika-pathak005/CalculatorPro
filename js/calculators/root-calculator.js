/* ============================================================
   root-calculator.js — Complete Root Calculator
   Supports: Square Root, Cube Root, nth Root
   Handles: Positive, Negative, Zero, Decimals
   ============================================================ */

let currentRootType = 'square';

// Set root type
function setRootType(type) {
    currentRootType = type;

    // Update buttons
    document.querySelectorAll('.root-type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });

    // Show/hide nth root input
    const nthInput = document.getElementById('nth-input-group');
    if (type === 'nth') {
        nthInput.classList.remove('hidden');
    } else {
        nthInput.classList.add('hidden');
    }

    calculateRoot();
}

// Format number
function formatNumber(num, precision = 10) {
    if (isNaN(num)) return 'NaN';
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    if (num === 0) return '0';
    if (Math.abs(num) < 1e-10) return '0';

    // Check if it's a perfect square/cube (integer)
    if (Number.isInteger(num) && num !== 0) {
        return num.toString();
    }

    // Round to precision, remove trailing zeros
    const fixed = parseFloat(num.toFixed(precision));
    return fixed.toString();
}

// Check if number is perfect square
function isPerfectSquare(num) {
    if (num < 0) return false;
    if (num === 0) return true;
    const root = Math.sqrt(num);
    return Number.isInteger(root);
}

// Check if number is perfect cube
function isPerfectCube(num) {
    if (num === 0) return true;
    const root = Math.cbrt(num);
    return Number.isInteger(root);
}

// Check if number is perfect nth root
function isPerfectNth(num, n) {
    if (num === 0) return true;
    if (num < 0 && n % 2 === 0) return false;
    const root = Math.pow(Math.abs(num), 1 / n);
    const rounded = Math.round(root);
    return Math.pow(rounded, n) === Math.abs(num);
}

// Get factors for step-by-step
function getFactors(num, rootType, n) {
    const factors = [];
    const limit = Math.abs(num);

    if (rootType === 'square') {
        for (let i = 1; i <= Math.sqrt(limit); i++) {
            if (limit % i === 0) {
                factors.push(i);
                if (i !== limit / i) {
                    factors.push(limit / i);
                }
            }
        }
    } else if (rootType === 'cube') {
        for (let i = 1; i <= Math.cbrt(limit); i++) {
            if (limit % i === 0) {
                factors.push(i);
                if (i !== limit / i) {
                    factors.push(limit / i);
                }
            }
        }
    } else {
        // nth root - find factors up to nth root
        for (let i = 1; i <= Math.pow(limit, 1 / n); i++) {
            if (limit % i === 0) {
                factors.push(i);
                if (i !== limit / i) {
                    factors.push(limit / i);
                }
            }
        }
    }

    return factors.sort((a, b) => a - b);
}

// Calculate nth root
function nthRoot(num, n) {
    if (num === 0) return 0;

    // Handle negative numbers
    if (num < 0) {
        if (n % 2 === 0) {
            return NaN; // Even root of negative number
        }
        return -Math.pow(Math.abs(num), 1 / n);
    }

    return Math.pow(num, 1 / n);
}

// Get step-by-step explanation
function getSteps(num, result, rootType, n) {
    const steps = [];
    let stepNum = 1;

    const rootSymbol = rootType === 'square' ? '√' : rootType === 'cube' ? '∛' : `ⁿ√`;
    const rootName = rootType === 'square' ? 'Square' : rootType === 'cube' ? 'Cube' : `${n}th`;

    steps.push({
        num: stepNum++,
        text: `${rootName} root of ${num}`,
        formula: `${rootSymbol}${num}`
    });

    // Handle special cases
    if (num === 0) {
        steps.push({
            num: stepNum++,
            text: `${rootSymbol}0 = 0 (Zero has unique root)`,
            formula: '√0 = 0'
        });
        return steps;
    }

    if (num === 1) {
        steps.push({
            num: stepNum++,
            text: `${rootSymbol}1 = 1 (1 raised to any power is 1)`,
            formula: '√1 = 1'
        });
        return steps;
    }

    if (num < 0 && rootType === 'square') {
        steps.push({
            num: stepNum++,
            text: `Cannot find square root of negative number in real numbers`,
            formula: '√(-x) = Undefined in real numbers'
        });
        return steps;
    }

    if (num < 0 && rootType === 'cube') {
        steps.push({
            num: stepNum++,
            text: `Cube root of negative number: ${num} is negative`,
            formula: `∛${num} = ${formatNumber(result)}`
        });
    }

    if (num < 0 && rootType === 'nth' && n % 2 === 0) {
        steps.push({
            num: stepNum++,
            text: `Cannot find even root of negative number in real numbers`,
            formula: `${n}√(-x) = Undefined in real numbers`
        });
        return steps;
    }

    // Check for perfect root
    let isPerfect = false;
    if (rootType === 'square') {
        isPerfect = isPerfectSquare(num);
    } else if (rootType === 'cube') {
        isPerfect = isPerfectCube(num);
    } else {
        isPerfect = isPerfectNth(num, n);
    }

    if (isPerfect && Number.isInteger(result)) {
        steps.push({
            num: stepNum++,
            text: `${num} is a perfect ${rootName} root!`,
            formula: `${rootSymbol}${num} = ${formatNumber(result)}`
        });
    } else {
        steps.push({
            num: stepNum++,
            text: `${num} is not a perfect ${rootName} root`,
            formula: `Result is approximately ${formatNumber(result)}`
        });
    }

    // Verification step
    if (!isNaN(result) && isFinite(result) && num >= 0) {
        const verify = Math.pow(result, rootType === 'square' ? 2 : rootType === 'cube' ? 3 : n);
        steps.push({
            num: stepNum++,
            text: `Verification: ${formatNumber(result)}^${rootType === 'square' ? 2 : rootType === 'cube' ? 3 : n} = ${formatNumber(verify)}`,
            formula: `${formatNumber(result)} × ${formatNumber(result)} = ${formatNumber(verify)}`
        });
    }

    return steps;
}

// Main calculate function
function calculateRoot() {
    const numInput = document.getElementById('number-input');
    const rootInput = document.getElementById('root-input');
    const previewResult = document.getElementById('preview-result');
    const resultArea = document.getElementById('result-area');

    const num = parseFloat(numInput.value);
    const n = parseInt(rootInput.value) || 3;

    // Validation
    if (numInput.value === '' || isNaN(num)) {
        previewResult.innerHTML = '<span class="placeholder">Enter a valid number</span>';
        resultArea.innerHTML = '';
        return;
    }

    // Validate nth root
    if (currentRootType === 'nth') {
        if (isNaN(n) || n < 1 || !Number.isInteger(n)) {
            previewResult.innerHTML = '<span class="placeholder error-text">n must be a positive integer</span>';
            resultArea.innerHTML = `
        <div class="error-box">
          <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
          Root value (n) must be a positive integer (1, 2, 3, ...)
        </div>
      `;
            return;
        }
    }

    let result;
    let rootSymbol = '';
    let rootName = '';

    try {
        switch (currentRootType) {
            case 'square':
                if (num < 0) {
                    previewResult.innerHTML = `<span class="preview-value error-text">Undefined in real numbers</span>`;
                    resultArea.innerHTML = `
            <div class="error-box">
              <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
              Square root of negative number is not defined in real numbers.<br>
              <small>However, in complex numbers: √${num} = ${formatNumber(Math.sqrt(Math.abs(num)))}i</small>
            </div>
          `;
                    return;
                }
                result = Math.sqrt(num);
                rootSymbol = '√';
                rootName = 'Square';
                break;

            case 'cube':
                result = Math.cbrt(num);
                rootSymbol = '∛';
                rootName = 'Cube';
                break;

            case 'nth':
                if (num < 0 && n % 2 === 0) {
                    previewResult.innerHTML = `<span class="preview-value error-text">Undefined in real numbers</span>`;
                    resultArea.innerHTML = `
            <div class="error-box">
              <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
              Even root (${n}th root) of negative number is not defined in real numbers.<br>
              <small>Try odd root (n should be odd for negative numbers)</small>
            </div>
          `;
                    return;
                }
                result = nthRoot(num, n);
                rootSymbol = `${n}√`;
                rootName = `${n}th`;
                break;
        }
    } catch (error) {
        previewResult.innerHTML = `<span class="preview-value error-text">Error</span>`;
        resultArea.innerHTML = `
      <div class="error-box">
        <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
        ${error.message}
      </div>
    `;
        return;
    }

    // Check if result is valid
    if (isNaN(result)) {
        previewResult.innerHTML = `<span class="preview-value error-text">Undefined</span>`;
        resultArea.innerHTML = `
      <div class="error-box">
        <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
        Unable to calculate root. Please check your inputs.
      </div>
    `;
        return;
    }

    const formattedResult = formatNumber(result);

    // Update preview
    if (currentRootType === 'square') {
        previewResult.innerHTML = `
      <span class="preview-value">√${formatNumber(num)} = ${formattedResult}</span>
    `;
    } else if (currentRootType === 'cube') {
        previewResult.innerHTML = `
      <span class="preview-value">∛${formatNumber(num)} = ${formattedResult}</span>
    `;
    } else {
        previewResult.innerHTML = `
      <span class="preview-value">${n}√${formatNumber(num)} = ${formattedResult}</span>
    `;
    }

    // Get steps
    const steps = getSteps(num, result, currentRootType, n);

    // Build steps HTML
    let stepsHtml = '';
    steps.forEach(step => {
        let formulaHtml = '';
        if (step.formula) {
            formulaHtml = `<div class="step-formula">${step.formula}</div>`;
        }
        stepsHtml += `
      <div class="step-item">
        <span class="step-number">${step.num}.</span>
        <div>
          <span class="step-text">${step.text}</span>
          ${formulaHtml}
        </div>
      </div>
    `;
    });

    // Build result display
    let resultDisplay = '';
    if (Number.isInteger(result) && result !== 0) {
        resultDisplay = formattedResult;
    } else {
        resultDisplay = formattedResult;
    }

    // Check perfect root status
    let isPerfect = false;
    if (currentRootType === 'square') {
        isPerfect = isPerfectSquare(num);
    } else if (currentRootType === 'cube') {
        isPerfect = isPerfectCube(num);
    } else {
        isPerfect = isPerfectNth(num, n);
    }

    // Display detailed result
    resultArea.innerHTML = `
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:math" data-width="16"></span>
        ${rootName} Root Result
      </div>
      <div class="result-value">${resultDisplay}</div>
      <div class="result-detail">
        ${rootSymbol}${formatNumber(num)} = ${formattedResult}
        ${isPerfect && Number.isInteger(result) ?
            ` <span class="badge-perfect">Perfect ${rootName} Root</span>` :
            ` <span class="badge-not-perfect">Not a Perfect ${rootName} Root</span>`}
      </div>
    </div>
    
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:list-numbers" data-width="16"></span>
        Step-by-Step Solution
      </div>
      <div class="steps-container">
        ${stepsHtml}
      </div>
    </div>
    
    <div class="result-card verification-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
        Quick Facts
      </div>
      <div class="verification-text">
        • ${rootName} root of ${formatNumber(num)} = ${formattedResult}<br>
        • ${formatNumber(result)}${rootType === 'square' ? '²' : rootType === 'cube' ? '³' : `^${n}`} = ${formatNumber(Math.pow(result, rootType === 'square' ? 2 : rootType === 'cube' ? 3 : n))}<br>
        ${isPerfect ? `• ${formatNumber(num)} is a perfect ${rootName.toLowerCase()} root` : `• ${formatNumber(num)} is not a perfect ${rootName.toLowerCase()} root`}
      </div>
    </div>
  `;
}

// Clear all
function clearRoot() {
    document.getElementById('number-input').value = '';
    document.getElementById('root-input').value = '3';
    document.getElementById('preview-result').innerHTML = '<span class="placeholder">Enter a number to see result</span>';
    document.getElementById('result-area').innerHTML = '';
}

// Add event listeners
function addRootEventListeners() {
    const numInput = document.getElementById('number-input');
    const rootInput = document.getElementById('root-input');

    if (numInput) {
        numInput.addEventListener('input', calculateRoot);
        numInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') calculateRoot();
        });
    }

    if (rootInput) {
        rootInput.addEventListener('input', calculateRoot);
        rootInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') calculateRoot();
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addRootEventListeners();
    calculateRoot();
});
