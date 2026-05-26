/* ============================================================
   equation-solver.js — Solve linear equations and find x
   Supports: ax + b = c, ax + b = cx + d, brackets, fractions
   ============================================================ */

// Append to equation input
function appendToEquation(value) {
    const input = document.getElementById('equation-input');
    input.value += value;
    input.focus();
}

// Clear equation
function clearEquation() {
    const input = document.getElementById('equation-input');
    input.value = '';
    document.getElementById('solution-area').innerHTML = '';
    input.focus();
}

// Backspace
function backspace() {
    const input = document.getElementById('equation-input');
    input.value = input.value.slice(0, -1);
    input.focus();
}

// Set example
function setExample(equation) {
    const input = document.getElementById('equation-input');
    input.value = equation;
    input.focus();
    solveEquation();
}

// Normalize equation (replace visual operators)
function normalizeEquation(equation) {
    return equation
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s/g, '')
        .replace(/=/g, '=');
}

// Parse equation into left and right sides
function parseEquation(equation) {
    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error('Equation must have one "=" sign');
    }
    return {
        left: parts[0],
        right: parts[1]
    };
}

// Evaluate expression with x (returns coefficient and constant)
function evaluateExpression(expr, isLeftSide) {
    // Replace x with a special marker
    let processed = expr;

    // Handle patterns like: 2x, 3x, -2x, +2x, x
    // Replace x with *X but carefully
    processed = processed.replace(/(\d+)x/gi, '$1*X');
    processed = processed.replace(/(\d+)X/gi, '$1*X');
    processed = processed.replace(/x/gi, '1*X');
    processed = processed.replace(/X/gi, 'X');

    // Handle negative x: -x -> -1*X
    processed = processed.replace(/-X/g, '-1*X');
    processed = processed.replace(/\+X/g, '+1*X');

    // Remove spaces
    processed = processed.replace(/\s/g, '');

    // Now we need to split into terms
    // Add + at beginning if starts with number or x
    if (processed.match(/^[0-9X]/)) {
        processed = '+' + processed;
    }

    // Split by + and - while keeping sign
    const terms = [];
    let currentTerm = '';
    for (let i = 0; i < processed.length; i++) {
        const char = processed[i];
        if ((char === '+' || char === '-') && currentTerm !== '') {
            terms.push(currentTerm);
            currentTerm = char;
        } else {
            currentTerm += char;
        }
    }
    if (currentTerm) terms.push(currentTerm);

    let coefficient = 0;
    let constant = 0;

    for (let term of terms) {
        if (term.includes('X')) {
            // X term
            let coeff = term.replace('X', '');
            if (coeff === '+' || coeff === '') coeff = '1';
            if (coeff === '-') coeff = '-1';
            coefficient += parseFloat(coeff);
        } else {
            // Constant term
            constant += parseFloat(term);
        }
    }

    // For left side, we keep as is; for right side, we move to left by negating
    if (!isLeftSide) {
        coefficient = -coefficient;
        constant = -constant;
    }

    return { coefficient, constant };
}

// Solve for x
function solveEquation() {
    const input = document.getElementById('equation-input');
    const rawEquation = input.value.trim();
    const area = document.getElementById('solution-area');

    if (!rawEquation) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Please enter an equation.
        </div>`;
        return;
    }

    try {
        // Normalize equation
        const normalized = normalizeEquation(rawEquation);

        // Parse left and right sides
        const { left, right } = parseEquation(normalized);

        // Evaluate both sides
        const leftResult = evaluateExpression(left, true);
        const rightResult = evaluateExpression(right, false);

        // Combine coefficients and constants
        const totalCoefficient = leftResult.coefficient + rightResult.coefficient;
        const totalConstant = leftResult.constant + rightResult.constant;

        // Solve: coefficient * x + constant = 0  =>  x = -constant/coefficient
        if (totalCoefficient === 0) {
            if (totalConstant === 0) {
                area.innerHTML = `<div class="result-card">
                    <div class="result-card-title">∞ Infinite Solutions</div>
                    <div class="result-card-detail">The equation is true for all values of x.</div>
                </div>`;
            } else {
                area.innerHTML = `<div class="result-card">
                    <div class="result-card-title">⚠️ No Solution</div>
                    <div class="result-card-detail">The equation has no solution.</div>
                </div>`;
            }
            return;
        }

        const xValue = -totalConstant / totalCoefficient;
        const formattedX = formatNumber(xValue);

        // Generate step-by-step solution
        const steps = generateSteps(rawEquation, left, right, leftResult, rightResult, totalCoefficient, totalConstant, xValue);

        // Verify the solution
        const verification = verifySolution(rawEquation, xValue);

        // Display result
        area.innerHTML = `
            <div class="result-card x-value-card">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:math-x" data-width="20"></span>
                    Value of x
                </div>
                <div class="x-value">x = ${formattedX}</div>
                <div class="result-card-detail">
                    ${Number.isInteger(xValue) ? 'Integer solution' : 'Decimal solution'}
                </div>
            </div>
            
            <div class="result-card">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:list-numbers" data-width="16"></span>
                    Step-by-Step Solution
                </div>
                <div class="steps-container">
                    ${steps}
                </div>
            </div>
            
            <div class="result-card verification-card">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:check-circle" data-width="16"></span>
                    Verification
                </div>
                <div class="verification-result">
                    ${verification}
                </div>
            </div>
            
            <div class="result-card" style="background: var(--color-surface);">
                <div class="result-card-title">
                    <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
                    Formula Used
                </div>
                <div class="result-card-detail">
                    For equation: <strong>ax + b = cx + d</strong><br>
                    x = (d - b) / (a - c)<br>
                    Here, x = ${formattedX}
                </div>
            </div>
        `;

    } catch (error) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            ${error.message}. Please check your equation format.
        </div>`;
    }
}

// Generate step-by-step solution
function generateSteps(original, left, right, leftResult, rightResult, totalCoeff, totalConst, xValue) {
    let steps = '';
    let stepNum = 1;

    // Step 1: Original equation
    steps += `
        <div class="step-item">
            <span class="step-number">${stepNum++}.</span>
            <span class="step-desc">Original equation</span>
            <div class="step-equation">${original}</div>
        </div>
    `;

    // Step 2: Show terms
    steps += `
        <div class="step-item">
            <span class="step-number">${stepNum++}.</span>
            <span class="step-desc">Collect x terms on one side, constants on the other</span>
            <div class="step-equation">
                ${formatCoefficient(leftResult.coefficient)}x ${formatConstant(leftResult.constant)} = ${formatCoefficient(-rightResult.coefficient)}x ${formatConstant(-rightResult.constant)}
            </div>
        </div>
    `;

    // Step 3: Combine like terms
    steps += `
        <div class="step-item">
            <span class="step-number">${stepNum++}.</span>
            <span class="step-desc">Combine x terms and constants</span>
            <div class="step-equation">
                ${formatCoefficient(totalCoeff)}x ${formatConstant(totalConst)} = 0
            </div>
        </div>
    `;

    // Step 4: Isolate x
    if (totalConst !== 0) {
        steps += `
            <div class="step-item">
                <span class="step-number">${stepNum++}.</span>
                <span class="step-desc">Move constant to the right side</span>
                <div class="step-equation">
                    ${formatCoefficient(totalCoeff)}x = ${-totalConst}
                </div>
            </div>
        `;
    }

    // Step 5: Divide both sides
    if (totalCoeff !== 1) {
        steps += `
            <div class="step-item">
                <span class="step-number">${stepNum++}.</span>
                <span class="step-desc">Divide both sides by ${totalCoeff}</span>
                <div class="step-equation">
                    x = ${formatNumber(xValue)}
                </div>
            </div>
        `;
    }

    // Step 6: Final answer
    steps += `
        <div class="step-item">
            <span class="step-number">${stepNum++}.</span>
            <span class="step-desc">Final answer</span>
            <div class="step-equation">
                x = ${formatNumber(xValue)}
            </div>
        </div>
    `;

    return steps;
}

// Format coefficient for display
function formatCoefficient(coeff) {
    if (coeff === 1) return '';
    if (coeff === -1) return '-';
    return coeff;
}

// Format constant for display
function formatConstant(constant) {
    if (constant === 0) return '';
    if (constant > 0) return `+ ${constant}`;
    return `- ${Math.abs(constant)}`;
}

// Verify solution by plugging back into original equation
function verifySolution(equation, xValue) {
    try {
        // Replace x with value in the equation
        let processed = equation
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        // Handle different x patterns
        processed = processed.replace(/(\d+)x/gi, `($1 * ${xValue})`);
        processed = processed.replace(/x(\d+)/gi, `(${xValue} * $1)`);
        processed = processed.replace(/x/gi, xValue);

        // Evaluate left and right sides
        const parts = processed.split('=');
        if (parts.length === 2) {
            const leftValue = evaluateArithmetic(parts[0]);
            const rightValue = evaluateArithmetic(parts[1]);

            const isCorrect = Math.abs(leftValue - rightValue) < 0.0001;

            return `
                Left Side (LHS) = ${formatNumber(leftValue)}<br>
                Right Side (RHS) = ${formatNumber(rightValue)}<br>
                <span class="${isCorrect ? 'verification-correct' : 'verification-wrong'}">
                    ${isCorrect ? '✓ Correct! The solution satisfies the equation.' : '✗ Error in verification.'}
                </span>
            `;
        }
        return 'Unable to verify automatically.';
    } catch (e) {
        return 'Automatic verification not available for this equation format.';
    }
}

// Evaluate arithmetic expression
function evaluateArithmetic(expr) {
    // Handle multiplication and division
    let processed = expr.replace(/\*/g, '*').replace(/\//g, '/');

    // Use Function constructor for safe evaluation
    try {
        // Replace ^ with Math.pow
        processed = processed.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');
        const result = Function('"use strict";return (' + processed + ')')();
        return result;
    } catch (e) {
        return NaN;
    }
}

// Format number
function formatNumber(num) {
    if (isNaN(num)) return '0';
    if (Number.isInteger(num)) {
        return num.toString();
    }
    // Round to 4 decimal places
    return parseFloat(num.toFixed(4)).toString();
}

// Add enter key support
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('equation-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            solveEquation();
        }
    });
});