/* ============================================================
   fraction-calculator.js- Multi-fraction Calculator
   Supports: +, −, ×, ÷ across N fractions | Decimals & whole numbers
   ============================================================ */

'use strict';

let currentOperator = '+';
let fractionCount = 0;

// ── Fraction class ──────────────────────────────────────────
class Fraction {
    constructor(num, den) {
        if (den === 0) throw new Error('Denominator cannot be zero');
        this.n = num;
        this.d = den;
        this._simplify();
    }

    _gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        while (b) { [a, b] = [b, a % b]; }
        return a || 1;
    }

    _simplify() {
        const g = this._gcd(this.n, this.d);
        this.n /= g;
        this.d /= g;
        if (this.d < 0) { this.n = -this.n; this.d = -this.d; }
        this.n = Math.round(this.n);
        this.d = Math.round(this.d);
    }

    toString() {
        if (this.n === 0) return '0';
        if (this.d === 1) return `${this.n}`;
        return `${this.n}/${this.d}`;
    }

    toDecimal() { return this.n / this.d; }

    toDecimalString() {
        const v = this.n / this.d;
        const fixed = parseFloat(v.toFixed(3));
        return fixed % 1 === 0 ? `${fixed}` : fixed.toFixed(3).replace(/\.?0+$/, '');
    }

    add(other) {
        return new Fraction(this.n * other.d + other.n * this.d, this.d * other.d);
    }
    subtract(other) {
        return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d);
    }
    multiply(other) {
        return new Fraction(this.n * other.n, this.d * other.d);
    }
    divide(other) {
        if (other.n === 0) throw new Error('Cannot divide by zero');
        return new Fraction(this.n * other.d, this.d * other.n);
    }
}

// ── Convert decimal number → exact Fraction ────────────────
function decimalToFraction(value) {
    if (!isFinite(value)) throw new Error('Invalid number');
    const sign = value < 0 ? -1 : 1;
    value = Math.abs(value);

    if (Math.abs(value - Math.round(value)) < 1e-9)
        return new Fraction(sign * Math.round(value), 1);

    const TOL = 1e-8;
    let bestN = 1, bestD = 1, bestErr = Math.abs(value - 1);
    for (let d = 1; d <= 100000; d++) {
        const n = Math.round(value * d);
        const err = Math.abs(value - n / d);
        if (err < bestErr) { bestErr = err; bestN = n; bestD = d; }
        if (bestErr < TOL) break;
    }
    return new Fraction(sign * bestN, bestD);
}

// ── Parse a single input value ─────────────────────────────
function parseValue(str) {
    str = str.trim();
    if (str === '' || str === '-') return null;
    if (str.includes('/')) {
        const [a, b] = str.split('/');
        const num = parseFloat(a), den = parseFloat(b);
        if (isNaN(num) || isNaN(den) || den === 0) return null;
        const scale = Math.pow(10, Math.max(
            (a.includes('.') ? a.split('.')[1].length : 0),
            (b.includes('.') ? b.split('.')[1].length : 0)
        ));
        return new Fraction(Math.round(num * scale), Math.round(den * scale));
    }
    const v = parseFloat(str);
    if (isNaN(v)) return null;
    return decimalToFraction(v);
}

// ── Build a Fraction from a fraction slot's inputs ─────────
function getFractionFromSlot(id) {
    const numEl = document.getElementById(`num-${id}`);
    const denEl = document.getElementById(`den-${id}`);
    if (!numEl) return null;

    const numStr = numEl.value.trim();
    const denStr = denEl ? denEl.value.trim() : '';

    if (numStr === '') return null;

    if (denStr === '' || denStr === '1') {
        return parseValue(numStr);
    }

    const combined = `${numStr}/${denStr}`;
    return parseValue(combined);
}

// ── Fraction slot DOM ──────────────────────────────────────
function createFractionSlot(id, isFirst) {
    const slot = document.createElement('div');
    slot.className = 'fraction-slot';
    slot.id = `slot-${id}`;

    slot.innerHTML = `
    ${!isFirst ? `<div class="slot-operator" id="slot-op-${id}"><span class="op-display">${getOpSymbol()}</span></div>` : ''}
    <div class="fraction-entry">
      <div class="fraction-box">
        <input type="number" id="num-${id}" class="frac-input num-input"
               placeholder="0" step="any" autocomplete="off" />
        <div class="fraction-divider-line"></div>
        <input type="number" id="den-${id}" class="frac-input den-input"
               placeholder="1" step="any" autocomplete="off" />
      </div>
      <div class="fraction-labels">
        <span>Numerator</span>
        <span>Denominator</span>
      </div>
      ${!isFirst ? `
      <button class="remove-slot-btn" onclick="removeFraction(${id})" title="Remove">
        <span class="iconify" data-icon="tabler:x" data-width="14"></span>
      </button>` : ''}
    </div>
  `;

    setTimeout(() => {
        const num = document.getElementById(`num-${id}`);
        const den = document.getElementById(`den-${id}`);
        if (num) num.addEventListener('input', calculate);
        if (den) den.addEventListener('input', calculate);
    }, 0);

    return slot;
}

function getOpSymbol() {
    return currentOperator;
}

function addFraction() {
    fractionCount++;
    const id = fractionCount;
    const list = document.getElementById('fractions-list');
    const slot = createFractionSlot(id, list.children.length === 0);
    list.appendChild(slot);
    setTimeout(() => {
        const el = document.getElementById(`num-${id}`);
        if (el) el.focus();
    }, 50);
    calculate();
}

function removeFraction(id) {
    const slot = document.getElementById(`slot-${id}`);
    if (slot) slot.remove();
    calculate();
}

// ── Operator handling ──────────────────────────────────────
function setOperator(op) {
    currentOperator = op;

    document.querySelectorAll('.op-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-op') === op);
    });

    document.querySelectorAll('.op-display').forEach(el => {
        el.textContent = op;
    });

    calculate();
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

// ── Build steps ────────────────────────────────────────────
function buildSteps(fracs, finalResult) {
    const steps = [];
    const op = currentOperator;

    if (op === '+' || op === '-') {
        const lcd = fracs.reduce((acc, f) => lcm(acc, f.d), fracs[0].d);
        steps.push(`Find LCM of denominators (${fracs.map(f => f.d).join(', ')}) = ${lcd}`);

        fracs.forEach((f, i) => {
            const mult = lcd / f.d;
            steps.push(`Fraction ${i + 1}: ${f.toString()} → ${f.n * mult}/${lcd}`);
        });

        let combined = 0;
        const numParts = [];
        fracs.forEach((f, i) => {
            const mult = lcd / f.d;
            const val = f.n * mult;
            if (i === 0) {
                combined = val;
                numParts.push(`${val}`);
            } else if (op === '+') {
                combined += val;
                numParts.push(`+ ${val}`);
            } else {
                combined -= val;
                numParts.push(`- ${val}`);
            }
        });
        steps.push(`${op === '+' ? 'Add' : 'Subtract'} numerators: ${numParts.join(' ')} = ${combined}`);
        steps.push(`Result before simplification: ${combined}/${lcd}`);

    } else if (op === '×') {
        const numProduct = fracs.reduce((a, f) => a * f.n, 1);
        const denProduct = fracs.reduce((a, f) => a * f.d, 1);
        steps.push(`Multiply all numerators: ${fracs.map(f => f.n).join(' × ')} = ${numProduct}`);
        steps.push(`Multiply all denominators: ${fracs.map(f => f.d).join(' × ')} = ${denProduct}`);

    } else if (op === '÷') {
        steps.push(`Keep first fraction: ${fracs[0].toString()}`);
        let productNum = fracs[0].n;
        let productDen = fracs[0].d;
        for (let i = 1; i < fracs.length; i++) {
            steps.push(`Reciprocal of fraction ${i + 1}: ${fracs[i].toString()} → ${fracs[i].d}/${fracs[i].n}`);
            productNum = productNum * fracs[i].d;
            productDen = productDen * fracs[i].n;
            steps.push(`Multiply: ${productNum}/${productDen}`);
        }
    }

    steps.push(`Simplify → ${finalResult.toString()}`);
    return steps;
}

// ── Main calculate ─────────────────────────────────────────
function calculate() {
    const list = document.getElementById('fractions-list');
    const slots = list.querySelectorAll('.fraction-slot');

    const fracs = [];
    slots.forEach(slot => {
        const id = slot.id.replace('slot-', '');
        const f = getFractionFromSlot(id);
        fracs.push(f);
    });

    const previewExpr = document.getElementById('preview-expression');
    const previewResult = document.getElementById('preview-result');
    const resultArea = document.getElementById('result-area');

    if (fracs.length < 2) {
        previewExpr.textContent = '—';
        previewResult.innerHTML = '<span class="placeholder">Add at least 2 fractions</span>';
        resultArea.innerHTML = '';
        return;
    }

    if (fracs.some(f => f === null)) {
        previewExpr.textContent = '—';
        previewResult.innerHTML = '<span class="placeholder">Fill in all fraction values</span>';
        resultArea.innerHTML = '';
        return;
    }

    try {
        let result = fracs[0];
        for (let i = 1; i < fracs.length; i++) {
            switch (currentOperator) {
                case '+': result = result.add(fracs[i]); break;
                case '-': result = result.subtract(fracs[i]); break;
                case '×': result = result.multiply(fracs[i]); break;
                case '÷': result = result.divide(fracs[i]); break;
                default: throw new Error('Unknown operator');
            }
        }

        const exprParts = fracs.map(f => f.toString());
        const exprStr = exprParts.join(` ${currentOperator} `);

        previewExpr.textContent = exprStr;
        previewResult.innerHTML = `
      <span class="preview-frac">${result.toString()}</span>
      <span class="preview-eq">=</span>
      <span class="preview-dec">${result.toDecimalString()}</span>
    `;

        displayResult(fracs, result, exprStr);

    } catch (err) {
        previewExpr.textContent = '—';
        previewResult.innerHTML = `<span class="placeholder error-text">${err.message}</span>`;
        resultArea.innerHTML = `
      <div class="error-box">
        <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
        ${err.message}
      </div>`;
    }
}

// ── Display detailed result ────────────────────────────────
function displayResult(fracs, result, exprStr) {
    const area = document.getElementById('result-area');

    const steps = buildSteps(fracs, result);
    let stepsHtml = steps.map((s, i) => `
    <div class="step-item">
      <span class="step-number">${i + 1}.</span>
      <span class="step-text">${s}</span>
    </div>`).join('');

    let resultDisplay;
    if (result.n === 0) {
        resultDisplay = '<span class="big-result">0</span>';
    } else if (result.d === 1) {
        resultDisplay = `<span class="big-result">${result.n}</span>`;
    } else {
        resultDisplay = `
      <div class="result-frac-visual">
        <span class="rfv-num">${result.n}</span>
        <div class="rfv-line"></div>
        <span class="rfv-den">${result.d}</span>
      </div>`;
    }

    const decVerify = fracs.map(f => f.toDecimalString()).join(` ${currentOperator} `);

    area.innerHTML = `
    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:math" data-width="16"></span>
        Expression
      </div>
      <div class="result-fraction">${exprStr}</div>
    </div>

    <div class="result-card highlight-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:check-circle" data-width="16"></span>
        Result (Simplified)
      </div>
      <div class="result-fraction">${resultDisplay}</div>
      <div class="result-decimal">= ${result.toDecimalString()} (decimal)</div>
    </div>

    <div class="result-card">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:list-numbers" data-width="16"></span>
        Step-by-Step Solution
      </div>
      <div class="steps-container">${stepsHtml}</div>
    </div>

    <div class="result-card" style="background: var(--color-surface);">
      <div class="result-card-title">
        <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
        Quick Verification (Decimal)
      </div>
      <div class="step-text">${decVerify} = ${result.toDecimalString()}</div>
    </div>
  `;
}

// ── Clear all ──────────────────────────────────────────────
function clearAll() {
    fractionCount = 0;
    document.getElementById('fractions-list').innerHTML = '';
    document.getElementById('preview-expression').textContent = '—';
    document.getElementById('preview-result').innerHTML = '<span class="placeholder">Enter values to see result</span>';
    document.getElementById('result-area').innerHTML = '';
    addFraction();
    addFraction();
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setOperator('+');
    addFraction();
    addFraction();

    setTimeout(() => {
        const n1 = document.getElementById('num-1');
        const d1 = document.getElementById('den-1');
        const n2 = document.getElementById('num-2');
        const d2 = document.getElementById('den-2');
        if (n1) n1.value = 1;
        if (d1) d1.value = 2;
        if (n2) n2.value = 1;
        if (d2) d2.value = 3;
        calculate();
    }, 50);
});