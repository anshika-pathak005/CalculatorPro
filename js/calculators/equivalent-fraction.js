/* ============================================================
   equivalent-fraction.js- Equivalent Fraction Calculator
   Shows equivalents by multiplication and division
   ============================================================ */

// GCD function
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Simplify fraction
function simplifyFraction(num, den) {
    const g = gcd(num, den);
    return { numerator: num / g, denominator: den / g };
}

// Get all factors of a number
function getFactors(n) {
    const factors = [];
    n = Math.abs(n);
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            factors.push(i);
            if (i !== n / i) {
                factors.push(n / i);
            }
        }
    }
    return factors.sort((a, b) => a - b);
}

// Generate equivalent fractions by multiplication
function getMultiplicationEquivalents(num, den, count) {
    const equivalents = [];
    for (let i = 1; i <= count; i++) {
        const multiplier = i;
        equivalents.push({
            numerator: num * multiplier,
            denominator: den * multiplier,
            multiplier: multiplier
        });
    }
    return equivalents;
}

// Generate equivalent fractions by division (common factors)
function getDivisionEquivalents(num, den) {
    const equivalents = [];
    const factors = getFactors(gcd(num, den));

    // Filter factors greater than 1 (skip dividing by 1 as it's the same)
    const divisors = factors.filter(f => f > 1);

    for (let divisor of divisors) {
        equivalents.push({
            numerator: num / divisor,
            denominator: den / divisor,
            divisor: divisor
        });
    }

    // Sort by divisor (ascending)
    equivalents.sort((a, b) => a.divisor - b.divisor);

    return equivalents;
}

// Format fraction for display
function formatFraction(num, den) {
    if (den === 1) return `${num}`;
    return `${num}/${den}`;
}

// Render multiplication equivalents
function renderMultiplicationEquivalents(equivalents, originalNum, originalDen) {
    const container = document.getElementById('multiplication-results');
    if (!container) return;

    if (!equivalents || equivalents.length === 0) {
        container.innerHTML = '<div class="loading">No equivalents generated</div>';
        return;
    }

    let html = '';
    equivalents.forEach((eq, idx) => {
        html += `
            <div class="equivalent-item">
                <div class="equivalent-fraction">
                    <span class="equivalent-num">${eq.numerator}</span>
                    <div class="equivalent-line"></div>
                    <span class="equivalent-den">${eq.denominator}</span>
                </div>
                <div class="equivalent-multiplier">
                    × ${eq.multiplier}
                </div>
                <div class="equivalent-multiplier" style="font-size: 0.65rem;">
                    = ${formatFraction(originalNum, originalDen)} × ${eq.multiplier}/${eq.multiplier}
                </div>
            </div>
        `;

        // Add arrow between items
        if (idx < equivalents.length - 1) {
            html += `<span class="equivalent-divider">→</span>`;
        }
    });

    container.innerHTML = html;
}

// Render division equivalents
function renderDivisionEquivalents(equivalents, originalNum, originalDen) {
    const container = document.getElementById('division-results');
    if (!container) return;

    if (!equivalents || equivalents.length === 0) {
        container.innerHTML = '<div class="loading">No common factors found (fraction already in simplest form)</div>';
        return;
    }

    let html = '';
    equivalents.forEach((eq, idx) => {
        html += `
            <div class="equivalent-item">
                <div class="equivalent-fraction">
                    <span class="equivalent-num">${eq.numerator}</span>
                    <div class="equivalent-line"></div>
                    <span class="equivalent-den">${eq.denominator}</span>
                </div>
                <div class="equivalent-multiplier">
                    ÷ ${eq.divisor}
                </div>
                <div class="equivalent-multiplier" style="font-size: 0.65rem;">
                    = (${originalNum}÷${eq.divisor}) / (${originalDen}÷${eq.divisor})
                </div>
            </div>
        `;

        // Add arrow between items
        if (idx < equivalents.length - 1) {
            html += `<span class="equivalent-divider">→</span>`;
        }
    });

    container.innerHTML = html;
}

// Render simplified form
function renderSimplifiedForm(simplified, originalNum, originalDen) {
    const container = document.getElementById('simplified-result');
    if (!container) return;

    let resultDisplay = '';
    if (simplified.denominator === 1) {
        resultDisplay = `
            <div class="simplified-fraction">
                <span class="simplified-num">${simplified.numerator}</span>
                <div class="simplified-line"></div>
                <span class="simplified-den">1</span>
            </div>
            <div class="simplified-decimal">
                = ${simplified.numerator} (Whole number)
            </div>
        `;
    } else {
        resultDisplay = `
            <div class="simplified-fraction">
                <span class="simplified-num">${simplified.numerator}</span>
                <div class="simplified-line"></div>
                <span class="simplified-den">${simplified.denominator}</span>
            </div>
            <div class="simplified-decimal">
                = ${(simplified.numerator / simplified.denominator).toFixed(6)} (decimal)
            </div>
        `;
    }

    // Check if already simplified
    if (originalNum === simplified.numerator && originalDen === simplified.denominator) {
        resultDisplay += `
            <div class="simplified-decimal" style="color: var(--color-secondary); margin-top: 0.5rem;">
                ✓ This fraction is already in its simplest form
            </div>
        `;
    }

    container.innerHTML = resultDisplay;
}

// Generate step-by-step explanation
function generateSteps(num, den, simplified, multiplicationEqs, divisionEqs, count) {
    const steps = [];
    let stepNum = 1;

    // Step 1: Original fraction
    steps.push({
        num: stepNum++,
        text: `Given fraction: ${formatFraction(num, den)}`
    });

    // Step 2: Find GCD
    const g = gcd(num, den);
    steps.push({
        num: stepNum++,
        text: `Find HCF (GCD) of ${num} and ${den} = ${g}`
    });

    // Step 3: Simplified form
    steps.push({
        num: stepNum++,
        text: `Simplified form = ${formatFraction(num, den)} ÷ ${g}/${g} = ${formatFraction(simplified.numerator, simplified.denominator)}`
    });

    // Step 4: Multiplication equivalents
    steps.push({
        num: stepNum++,
        text: `To get equivalent fractions by MULTIPLICATION, multiply numerator and denominator by the same number:`
    });
    for (let i = 1; i <= Math.min(count, 3); i++) {
        steps.push({
            num: stepNum++,
            text: `× ${i}: ${num}×${i} / ${den}×${i} = ${num * i}/${den * i}`
        });
    }
    if (count > 3) {
        steps.push({
            num: stepNum++,
            text: `... and so on up to × ${count}`
        });
    }

    // Step 5: Division equivalents
    if (divisionEqs.length > 0) {
        steps.push({
            num: stepNum++,
            text: `To get equivalent fractions by DIVISION, divide numerator and denominator by common factors:`
        });
        for (let eq of divisionEqs.slice(0, 3)) {
            steps.push({
                num: stepNum++,
                text: `÷ ${eq.divisor}: ${num}÷${eq.divisor} / ${den}÷${eq.divisor} = ${eq.numerator}/${eq.denominator}`
            });
        }
        if (divisionEqs.length > 3) {
            steps.push({
                num: stepNum++,
                text: `... and other common factors: ${divisionEqs.slice(3).map(eq => eq.divisor).join(', ')}`
            });
        }
    } else {
        steps.push({
            num: stepNum++,
            text: `No common factors other than 1, so no division equivalents available.`
        });
    }

    return steps;
}

// Render steps
function renderSteps(steps) {
    const stepContainer = document.getElementById('step-by-step');
    const stepContent = document.getElementById('step-content');

    if (!stepContainer || !stepContent) return;

    if (steps && steps.length > 0) {
        let stepsHtml = '';
        steps.forEach(step => {
            stepsHtml += `
                <div class="step-item">
                    <span class="step-number">${step.num}.</span>
                    ${step.text}
                </div>
            `;
        });
        stepContent.innerHTML = stepsHtml;
        stepContainer.classList.remove('hidden');
    } else {
        stepContainer.classList.add('hidden');
    }
}

// Show error
function showError(message) {
    const errorArea = document.getElementById('error-area');
    if (errorArea) {
        errorArea.innerHTML = `
            <div class="error-box">
                <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
                ${message}
            </div>
        `;
        errorArea.classList.remove('hidden');
    }
}

// Hide error
function hideError() {
    const errorArea = document.getElementById('error-area');
    if (errorArea) {
        errorArea.classList.add('hidden');
        errorArea.innerHTML = '';
    }
}

// Main calculation function
function calculateEquivalentFractions() {
    const numInput = document.getElementById('numerator');
    const denInput = document.getElementById('denominator');
    const countSelect = document.getElementById('equivalent-count');

    let num = parseFloat(numInput.value);
    let den = parseFloat(denInput.value);
    const count = parseInt(countSelect.value);

    // Validation
    hideError();

    if (isNaN(num) || isNaN(den)) {
        showError('Please enter both numerator and denominator.');
        return;
    }

    if (den === 0) {
        showError('Denominator cannot be zero!');
        return;
    }

    // Handle negative numbers
    if (den < 0) {
        num = -num;
        den = -den;
    }

    // Get simplified form
    const simplified = simplifyFraction(num, den);

    // Generate equivalents by multiplication
    const multiplicationEqs = getMultiplicationEquivalents(num, den, count);

    // Generate equivalents by division (only for positive integers)
    let divisionEqs = [];
    if (Number.isInteger(num) && Number.isInteger(den) && num > 0 && den > 0) {
        divisionEqs = getDivisionEquivalents(num, den);
    }

    // Render results
    renderMultiplicationEquivalents(multiplicationEqs, num, den);
    renderDivisionEquivalents(divisionEqs, num, den);
    renderSimplifiedForm(simplified, num, den);

    // Generate and render steps
    const steps = generateSteps(num, den, simplified, multiplicationEqs, divisionEqs, count);
    renderSteps(steps);
}

// Handle decimal numbers (convert to fraction)
function handleDecimalInput() {
    let num = parseFloat(document.getElementById('numerator').value);
    let den = parseFloat(document.getElementById('denominator').value);

    // If numerator is decimal but denominator is 1, convert to fraction
    if (!Number.isInteger(num) && den === 1) {
        // Convert decimal to fraction
        const decimalStr = num.toString();
        const decimalPlaces = (decimalStr.split('.')[1] || '').length;
        const factor = Math.pow(10, decimalPlaces);
        const newNum = num * factor;
        const newDen = den * factor;

        document.getElementById('numerator').value = newNum;
        document.getElementById('denominator').value = newDen;
    }
}

// Add event listeners
function addEventListeners() {
    const inputs = ['numerator', 'denominator'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                handleDecimalInput();
                calculateEquivalentFractions();
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') calculateEquivalentFractions();
            });
        }
    });

    const countSelect = document.getElementById('equivalent-count');
    if (countSelect) {
        countSelect.addEventListener('change', () => calculateEquivalentFractions());
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    addEventListeners();
    calculateEquivalentFractions();
});