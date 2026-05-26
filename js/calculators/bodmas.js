/* ============================================================
   bodmas.js — BODMAS/PEMDAS Calculator with step-by-step evaluation
   ============================================================ */

// Add keypad listeners
document.addEventListener("DOMContentLoaded", () => {
    // Add click listeners to all keypad buttons
    const keyButtons = document.querySelectorAll('.key-btn[data-value]');
    keyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            appendToExpression(value);
        });
    });

    // Add enter key support
    const input = document.getElementById('expression-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            calculateExpression();
        }
    });
});

// Append value to expression input
function appendToExpression(value) {
    const input = document.getElementById('expression-input');
    input.value += value;
    input.focus();
}

// Clear entire expression
function clearExpression() {
    const input = document.getElementById('expression-input');
    input.value = '';
    document.getElementById('result-area').innerHTML = '';
    input.focus();
}

// Backspace function
function backspace() {
    const input = document.getElementById('expression-input');
    input.value = input.value.slice(0, -1);
    input.focus();
}

// Replace visual operators with JavaScript operators
function normalizeExpression(expr) {
    return expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/\[/g, '(')
        .replace(/\]/g, ')')
        .replace(/\{/g, '(')
        .replace(/\}/g, ')')
        .replace(/%/g, '/100');
}

// Validate expression
function validateExpression(expr) {
    if (!expr || expr.trim() === '') {
        return 'Please enter an expression.';
    }

    // Check for invalid characters
    const validChars = /[0-9+\-*/()^%.\s]/;
    for (let char of expr) {
        if (!validChars.test(char) && char !== '×' && char !== '÷' && char !== '[' && char !== ']' && char !== '{' && char !== '}' && char !== '^' && char !== '%') {
            return `Invalid character: "${char}"`;
        }
    }

    // Check for balanced brackets
    let brackets = 0;
    for (let char of expr) {
        if (char === '(' || char === '[' || char === '{') brackets++;
        if (char === ')' || char === ']' || char === '}') brackets--;
        if (brackets < 0) return 'Unbalanced brackets.';
    }
    if (brackets !== 0) return 'Unbalanced brackets.';

    return null;
}

// Format number for display
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return parseFloat(num.toFixed(6)).toString();
}

// Evaluate expression with step-by-step logging
function evaluateWithSteps(expression, originalExpr) {
    const steps = [];
    let currentExpr = expression;

    steps.push({
        step: 1,
        description: "Original Expression",
        expression: originalExpr,
        value: null
    });

    // Step 1: Replace visual operators
    currentExpr = normalizeExpression(currentExpr);
    steps.push({
        step: 2,
        description: "Replace operators (× → *, ÷ → /)",
        expression: currentExpr,
        value: null
    });

    // Helper function to evaluate and show steps for brackets
    let stepCounter = 3;

    // Handle brackets recursively
    while (currentExpr.includes('(')) {
        const bracketMatch = currentExpr.match(/\(([^()]+)\)/);
        if (bracketMatch) {
            const innerExpr = bracketMatch[1];
            const innerResult = evaluateSimpleExpression(innerExpr);
            steps.push({
                step: stepCounter++,
                description: `Evaluate inside brackets: (${innerExpr})`,
                expression: currentExpr,
                value: innerResult
            });
            currentExpr = currentExpr.replace(`(${innerExpr})`, innerResult.toString());
            steps.push({
                step: stepCounter++,
                description: `Replace bracket with result`,
                expression: currentExpr,
                value: null
            });
        }
    }

    // Handle exponents
    while (currentExpr.includes('**')) {
        const expMatch = currentExpr.match(/(\d+(?:\.\d+)?)\*\*(\d+(?:\.\d+)?)/);
        if (expMatch) {
            const base = parseFloat(expMatch[1]);
            const exponent = parseFloat(expMatch[2]);
            const result = Math.pow(base, exponent);
            steps.push({
                step: stepCounter++,
                description: `Calculate power: ${base}^${exponent}`,
                expression: currentExpr,
                value: result
            });
            currentExpr = currentExpr.replace(expMatch[0], result.toString());
        }
    }

    // Handle multiplication and division (left to right)
    const mdRegex = /(\d+(?:\.\d+)?)\s*([*/])\s*(\d+(?:\.\d+)?)/;
    let mdMatch;
    while ((mdMatch = currentExpr.match(mdRegex))) {
        const left = parseFloat(mdMatch[1]);
        const operator = mdMatch[2];
        const right = parseFloat(mdMatch[3]);
        let result;

        if (operator === '*') {
            result = left * right;
            steps.push({
                step: stepCounter++,
                description: `Multiply: ${left} × ${right}`,
                expression: currentExpr,
                value: result
            });
        } else {
            if (right === 0) throw new Error('Division by zero');
            result = left / right;
            steps.push({
                step: stepCounter++,
                description: `Divide: ${left} ÷ ${right}`,
                expression: currentExpr,
                value: result
            });
        }
        currentExpr = currentExpr.replace(mdMatch[0], result.toString());
    }

    // Handle addition and subtraction (left to right)
    const asRegex = /(\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)/;
    let asMatch;
    while ((asMatch = currentExpr.match(asRegex))) {
        const left = parseFloat(asMatch[1]);
        const operator = asMatch[2];
        const right = parseFloat(asMatch[3]);
        let result;

        if (operator === '+') {
            result = left + right;
            steps.push({
                step: stepCounter++,
                description: `Add: ${left} + ${right}`,
                expression: currentExpr,
                value: result
            });
        } else {
            result = left - right;
            steps.push({
                step: stepCounter++,
                description: `Subtract: ${left} - ${right}`,
                expression: currentExpr,
                value: result
            });
        }
        currentExpr = currentExpr.replace(asMatch[0], result.toString());
    }

    const finalResult = parseFloat(currentExpr);
    steps.push({
        step: stepCounter++,
        description: "Final Result",
        expression: originalExpr,
        value: finalResult
    });

    return { result: finalResult, steps };
}

// Evaluate simple expression without brackets
function evaluateSimpleExpression(expr) {
    // Handle exponents
    while (expr.includes('**')) {
        const expMatch = expr.match(/(\d+(?:\.\d+)?)\*\*(\d+(?:\.\d+)?)/);
        if (expMatch) {
            const result = Math.pow(parseFloat(expMatch[1]), parseFloat(expMatch[2]));
            expr = expr.replace(expMatch[0], result.toString());
        }
    }

    // Handle multiplication and division
    const mdRegex = /(\d+(?:\.\d+)?)\s*([*/])\s*(\d+(?:\.\d+)?)/;
    let mdMatch;
    while ((mdMatch = expr.match(mdRegex))) {
        const left = parseFloat(mdMatch[1]);
        const operator = mdMatch[2];
        const right = parseFloat(mdMatch[3]);
        let result;

        if (operator === '*') {
            result = left * right;
        } else {
            result = left / right;
        }
        expr = expr.replace(mdMatch[0], result.toString());
    }

    // Handle addition and subtraction
    const asRegex = /(\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)/;
    let asMatch;
    while ((asMatch = expr.match(asRegex))) {
        const left = parseFloat(asMatch[1]);
        const operator = asMatch[2];
        const right = parseFloat(asMatch[3]);
        let result;

        if (operator === '+') {
            result = left + right;
        } else {
            result = left - right;
        }
        expr = expr.replace(asMatch[0], result.toString());
    }

    return parseFloat(expr);
}

// Main calculation function
function calculateExpression() {
    const input = document.getElementById('expression-input');
    const rawExpression = input.value.trim();
    const area = document.getElementById('result-area');

    // Validate expression
    const validationError = validateExpression(rawExpression);
    if (validationError) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            ${validationError}
        </div>`;
        return;
    }

    try {
        // Evaluate with step-by-step
        const { result, steps } = evaluateWithSteps(rawExpression, rawExpression);

        // Format result
        const formattedResult = formatNumber(result);

        // Build steps HTML
        const stepsHtml = steps.map(step => {
            if (step.value !== null && step.value !== undefined) {
                return `
                    <div class="step-item">
                        <span class="step-number">${step.step}.</span>
                        <span class="step-desc">${step.description}</span>
                        <div class="step-expression">${step.expression}</div>
                        <div class="step-result">= ${formatNumber(step.value)}</div>
                    </div>
                `;
            } else if (step.description.includes('Replace')) {
                return `
                    <div class="step-item">
                        <span class="step-number">${step.step}.</span>
                        <span class="step-desc">${step.description}</span>
                        <div class="step-expression">${step.expression}</div>
                    </div>
                `;
            }
            return '';
        }).join('');

        // Display result
        area.innerHTML = `
            <div class="result-box final-result">
                <div class="result-label">
                    <span class="iconify" data-icon="tabler:check-circle" data-width="16"></span>
                    Final Answer
                </div>
                <div class="result-value" style="font-size: 2rem;">${formattedResult}</div>
            </div>
            
            <div class="result-box steps-box" style="margin-top: 1rem;">
                <div class="result-label">
                    <span class="iconify" data-icon="tabler:list-numbers" data-width="16"></span>
                    Step-by-Step Solution (BODMAS Rule)
                </div>
                <div class="steps-container">
                    ${stepsHtml}
                </div>
            </div>
            
            <div class="result-box" style="margin-top: 1rem; background: var(--color-surface);">
                <div class="result-label">
                    <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
                    BODMAS Reminder
                </div>
                <div class="result-detail">
                    <strong>B</strong>rackets → <strong>O</strong>rders (powers/roots) → <strong>D</strong>ivision & <strong>M</strong>ultiplication (left to right) → <strong>A</strong>ddition & <strong>S</strong>ubtraction (left to right)
                </div>
            </div>
        `;

    } catch (error) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            Error in calculation: ${error.message}. Please check your expression.
        </div>`;
    }
}