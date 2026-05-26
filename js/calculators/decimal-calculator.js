/* ============================================================
   decimal-calculator.js — Decimal Calculator
   Supports: Addition, Subtraction, Multiplication, Division
   ============================================================ */

let currentDecimalOperator = 'add';

// Set operator and update UI
function setDecimalOperator(op) {
    currentDecimalOperator = op;

    // Update active state on cards
    document.querySelectorAll('.op-card').forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-op') === op) {
            card.classList.add('active');
        }
    });

    // Update operator display
    const operatorDisplay = document.getElementById('operator-display');
    let symbol = '';
    switch (op) {
        case 'add': symbol = '+'; break;
        case 'subtract': symbol = '−'; break;
        case 'multiply': symbol = '×'; break;
        case 'divide': symbol = '÷'; break;
    }
    if (operatorDisplay) {
        operatorDisplay.querySelector('.operator-symbol').textContent = symbol;
    }

    calculateDecimal();
}

// Swap numbers
function swapDecimalNumbers() {
    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;

    document.getElementById('num1').value = num2;
    document.getElementById('num2').value = num1;

    calculateDecimal();
}

// Clear all
function clearDecimalAll() {
    document.getElementById('num1').value = '';
    document.getElementById('num2').value = '';
    document.getElementById('result-area').innerHTML = '';
    document.getElementById('preview-expression').textContent = '—';
    document.getElementById('preview-result').innerHTML = '<span class="placeholder">Enter values to see result</span>';
}

// Get precision value
function getPrecision() {
    return parseInt(document.getElementById('precision').value);
}

// Format number with precision
function formatNumber(num, precision) {
    return num.toFixed(precision);
}

// Remove trailing zeros
function removeTrailingZeros(numStr) {
    return numStr.replace(/\.?0+$/, '');
}

// Get step-by-step explanation based on operation
function getSteps(num1, num2, result, operator, precision) {
    const steps = [];
    let stepNum = 1;

    const opSymbol = operator === 'add' ? '+' : operator === 'subtract' ? '-' : operator === 'multiply' ? '×' : '÷';
    const opName = operator === 'add' ? 'Addition' : operator === 'subtract' ? 'Subtraction' : operator === 'multiply' ? 'Multiplication' : 'Division';

    steps.push({
        num: stepNum++,
        text: `${opName} of decimal numbers`,
        formula: `${num1} ${opSymbol} ${num2}`
    });

    if (operator === 'add') {
        steps.push({
            num: stepNum++,
            text: `Align decimal points and add digit by digit`,
            formula: `  ${num1}\n+ ${num2}\n${'-'.repeat(Math.max(num1.toString().length, num2.toString().length) + 2)}\n  ${result}`
        });
        steps.push({
            num: stepNum++,
            text: `Add the numbers: ${num1} + ${num2} = ${result}`,
            formula: `${num1} + ${num2} = ${result}`
        });
    }
    else if (operator === 'subtract') {
        steps.push({
            num: stepNum++,
            text: `Align decimal points and subtract digit by digit`,
            formula: `  ${num1}\n- ${num2}\n${'-'.repeat(Math.max(num1.toString().length, num2.toString().length) + 2)}\n  ${result}`
        });
        steps.push({
            num: stepNum++,
            text: `Subtract the numbers: ${num1} - ${num2} = ${result}`,
            formula: `${num1} - ${num2} = ${result}`
        });
    }
    else if (operator === 'multiply') {
        steps.push({
            num: stepNum++,
            text: `Multiply as whole numbers first`,
            formula: `Ignore decimals: ${num1.toString().replace('.', '')} × ${num2.toString().replace('.', '')}`
        });
        const decimalPlaces = (num1.toString().split('.')[1] || '').length + (num2.toString().split('.')[1] || '').length;
        steps.push({
            num: stepNum++,
            text: `Count total decimal places: ${decimalPlaces} decimal places`,
            formula: `Place decimal point ${decimalPlaces} digits from the right`
        });
        steps.push({
            num: stepNum++,
            text: `Multiply the numbers: ${num1} × ${num2} = ${result}`,
            formula: `${num1} × ${num2} = ${result}`
        });
    }
    else if (operator === 'divide') {
        if (num2 === 0) {
            steps.push({
                num: stepNum++,
                text: `Error: Division by zero is undefined`,
                formula: `Cannot divide by zero`
            });
        } else {
            steps.push({
                num: stepNum++,
                text: `To divide decimals, multiply both numbers by power of 10 to make divisor a whole number`,
                formula: `${num1} ÷ ${num2} = ${result}`
            });
            steps.push({
                num: stepNum++,
                text: `Divide the numbers: ${num1} ÷ ${num2} = ${result}`,
                formula: `${num1} ÷ ${num2} = ${result}`
            });
        }
    }

    steps.push({
        num: stepNum++,
        text: `Round to ${precision} decimal places`,
        formula: `${result} rounded to ${precision} decimal places = ${formatNumber(parseFloat(result), precision)}`
    });

    return steps;
}

// Main calculate function
function calculateDecimal() {
    const num1Input = document.getElementById('num1').value;
    const num2Input = document.getElementById('num2').value;
    const precision = getPrecision();

    const num1 = parseFloat(num1Input);
    const num2 = parseFloat(num2Input);

    const previewExpr = document.getElementById('preview-expression');
    const previewResult = document.getElementById('preview-result');
    const resultArea = document.getElementById('result-area');

    // Validation
    if (num1Input === '' || num2Input === '') {
        previewExpr.textContent = '—';
        previewResult.innerHTML = '<span class="placeholder">Enter both numbers</span>';
        resultArea.innerHTML = '';
        return;
    }

    if (isNaN(num1) || isNaN(num2)) {
        previewExpr.textContent = '—';
        previewResult.innerHTML = '<span class="placeholder">Please enter valid numbers</span>';
        resultArea.innerHTML = '';
        return;
    }

    let result;
    let operatorSymbol = '';
    let operationName = '';

    switch (currentDecimalOperator) {
        case 'add':
            result = num1 + num2;
            operatorSymbol = '+';
            operationName = 'Addition';
            break;
        case 'subtract':
            result = num1 - num2;
            operatorSymbol = '−';
            operationName = 'Subtraction';
            break;
        case 'multiply':
            result = num1 * num2;
            operatorSymbol = '×';
            operationName = 'Multiplication';
            break;
        case 'divide':
            if (num2 === 0) {
                previewExpr.textContent = `${num1} ÷ 0`;
                previewResult.innerHTML = '<span class="placeholder error-text">Error: Division by zero</span>';
                resultArea.innerHTML = `
          <div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Division by zero is undefined. Please enter a non-zero second number.
          </div>`;
                return;
            }
            result = num1 / num2;
            operatorSymbol = '÷';
            operationName = 'Division';
            break;
        default:
            result = 0;
    }

    const formattedResult = formatNumber(result, precision);
    const displayResult = removeTrailingZeros(formattedResult);

    // Update preview
    previewExpr.textContent = `${num1} ${operatorSymbol} ${num2}`;
    previewResult.innerHTML = `<span class="preview-value">${displayResult}</span>`;

    // Get steps
    const steps = getSteps(num1, num2, result, currentDecimalOperator, precision);

    // Build steps HTML
    let stepsHtml = '';
    steps.forEach(step => {
        let formulaHtml = '';
        if (step.formula) {
            formulaHtml = `<div class="step-formula">${step.formula.replace(/\n/g, '<br>')}</div>`;
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

    // Get original values for verification
    const originalPrecision = Math.max(
        (num1.toString().split('.')[1] || '').length,
        (num2.toString().split('.')[1] || '').length
    );

    // Display detailed result
    resultArea.innerHTML = `
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:math" data-width="16"></span>
        Expression
      </div>
      <div class="result-value">${num1} ${operatorSymbol} ${num2} = ${displayResult}</div>
    </div>
    
    <div class="result-card highlight-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:check-circle" data-width="16"></span>
        ${operationName} Result
      </div>
      <div class="result-value">${displayResult}</div>
      <div class="result-detail">
        Rounded to ${precision} decimal ${precision === 1 ? 'place' : 'places'}
        ${removeTrailingZeros(formattedResult) !== formattedResult ? `<br>Original: ${result}` : ''}
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
        • ${num1} has ${(num1.toString().split('.')[1] || '').length} decimal place${(num1.toString().split('.')[1] || '').length !== 1 ? 's' : ''}<br>
        • ${num2} has ${(num2.toString().split('.')[1] || '').length} decimal place${(num2.toString().split('.')[1] || '').length !== 1 ? 's' : ''}<br>
        • Result: ${displayResult}
      </div>
    </div>
  `;
}

// Add event listeners
function addDecimalEventListeners() {
    const inputs = ['num1', 'num2'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => calculateDecimal());
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') calculateDecimal();
            });
        }
    });

    const precisionSelect = document.getElementById('precision');
    if (precisionSelect) {
        precisionSelect.addEventListener('change', () => calculateDecimal());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addDecimalEventListeners();
    setDecimalOperator('add');
    calculateDecimal();
});