/* ============================================================
   coprime.js- Logic for Coprime (Relatively Prime) Checker
   ============================================================ */

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function getFactors(n) {
    const factors = [];
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

function findCommonFactors(factors1, factors2) {
    return factors1.filter(factor => factors2.includes(factor));
}

function checkCoprime() {
    const area = document.getElementById("result-area");
    const num1 = parseInt(document.getElementById("num1").value.trim());
    const num2 = parseInt(document.getElementById("num2").value.trim());

    // Validation
    if (isNaN(num1) || isNaN(num2)) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Please enter both numbers.
        </div>`;
        return;
    }

    if (num1 < 1 || num2 < 1) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            Please enter positive whole numbers (1 or greater).
        </div>`;
        return;
    }

    if (num1 > 10000 || num2 > 10000) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            Please enter numbers up to 10,000.
        </div>`;
        return;
    }

    // Calculate HCF
    const hcf = gcd(num1, num2);
    const isCoprime = hcf === 1;

    // Get factors
    const factors1 = getFactors(num1);
    const factors2 = getFactors(num2);
    const commonFactors = findCommonFactors(factors1, factors2);

    // Create factors display
    const factors1Html = factors1.map(f => `<span class="chip">${f}</span>`).join("");
    const factors2Html = factors2.map(f => `<span class="chip">${f}</span>`).join("");
    const commonFactorsHtml = commonFactors.map(f => `<span class="chip" style="background: var(--color-secondary); color: white;">${f}</span>`).join("");

    // Result styling
    const resultColor = isCoprime ? "var(--color-secondary)" : "var(--color-error-fg)";
    const resultIcon = "";
    const resultText = isCoprime ? "Coprime (Relatively Prime)" : "Not Coprime";

    // Detailed explanation
    let explanation = "";
    if (isCoprime) {
        explanation = `
            <div class="result-detail" style="margin-top: 0.75rem;">
                <strong>Why are they coprime?</strong><br/>
                • HCF(${num1}, ${num2}) = <strong>${hcf}</strong><br/>
                • Two numbers are coprime when their Highest Common Factor is <strong>1</strong>.<br/>
                • ${num1} and ${num2} share <strong>no common factors</strong> other than 1.
            </div>
        `;
    } else {
        explanation = `
            <div class="result-detail" style="margin-top: 0.75rem;">
                <strong>Why are they NOT coprime?</strong><br/>
                • HCF(${num1}, ${num2}) = <strong>${hcf}</strong><br/>
                • For coprime numbers, HCF must be <strong>1</strong>.<br/>
                • ${num1} and ${num2} share common factor(s): <strong>${commonFactors.filter(f => f !== 1).join(", ")}</strong>
            </div>
        `;
    }

    area.innerHTML = `
        <div class="result-box">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:brand-codesandbox" data-width="16"></span>
                Coprime Status
            </div>
            <div class="result-value" style="color: ${resultColor}; font-size: 1.8rem;">
                ${resultIcon} ${resultText}
            </div>
            <div class="result-detail">
                <strong>HCF (GCD)</strong> of ${num1} and ${num2} = <strong style="font-size: 1.2rem;">${hcf}</strong>
            </div>
            ${explanation}
        </div>

        <div class="result-box" style="margin-top: 1rem;">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:list" data-width="16"></span>
                Factors of ${num1}
            </div>
            <div class="chips">${factors1Html}</div>
        </div>

        <div class="result-box" style="margin-top: 1rem;">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:list" data-width="16"></span>
                Factors of ${num2}
            </div>
            <div class="chips">${factors2Html}</div>
        </div>

        <div class="result-box" style="margin-top: 1rem; background: ${isCoprime ? 'var(--color-surface)' : 'var(--color-error-bg)'}">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:arrows-join" data-width="16"></span>
                Common Factors
            </div>
            <div class="chips">${commonFactorsHtml || '<span class="chip">None</span>'}</div>
            <div class="result-detail" style="margin-top: 0.5rem;">
                <strong>Total common factors:</strong> ${commonFactors.length}
            </div>
        </div>

        <div class="result-box" style="margin-top: 1rem; background: var(--color-white);">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:bulb" data-width="16"></span>
                Did You Know?
            </div>
            <div class="result-detail">
                • Coprime numbers are also called <strong>"relatively prime"</strong> or <strong>"mutually prime"</strong>.<br/>
                • Any two <strong>prime numbers</strong> are always coprime.<br/>
                • Consecutive numbers like (5,6) or (14,15) are always coprime!<br/>
                • Example: 8 and 15 are coprime because they share no common factors.
            </div>
        </div>
    `;
}

function clearCoprime() {
    document.getElementById("num1").value = "";
    document.getElementById("num2").value = "";
    document.getElementById("result-area").innerHTML = "";
}

// Add Enter key support
document.addEventListener("DOMContentLoaded", () => {
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            checkCoprime();
        }
    };

    document.getElementById("num1")?.addEventListener("keydown", handleEnter);
    document.getElementById("num2")?.addEventListener("keydown", handleEnter);
});