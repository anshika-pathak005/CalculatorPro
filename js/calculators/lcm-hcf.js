/* ============================================================
   lcm-hcf.js — Logic for LCM & HCF calculator with dynamic inputs
   ============================================================ */

let inputCounter = 2; // Start from index 2 since we have 0 and 1 initially

function gcd(a, b) {
    while (b !== 0) [a, b] = [b, a % b];
    return a;
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

// Calculate GCD for array of numbers
function gcdArray(numbers) {
    return numbers.reduce((acc, curr) => gcd(acc, curr));
}

// Calculate LCM for array of numbers
function lcmArray(numbers) {
    return numbers.reduce((acc, curr) => lcm(acc, curr));
}

// Add new number input field
function addNumberInput() {
    const container = document.getElementById("inputs-container");
    const newIndex = inputCounter;

    const newGroup = document.createElement("div");
    newGroup.className = "number-input-group";
    newGroup.setAttribute("data-index", newIndex);
    newGroup.style.marginTop = "1rem";

    newGroup.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label class="input-label" style="flex: 1;">
                <span class="iconify" data-icon="tabler:number-${Math.min(newIndex + 1, 9)}" data-width="18"></span>
                Number ${newIndex + 1}
            </label>
            <button onclick="removeNumberInput(${newIndex})" class="remove-btn" title="Remove this number">
                <span class="iconify" data-icon="tabler:x" data-width="18"></span>
            </button>
        </div>
        <input type="number" id="num-${newIndex}" class="calc-input" placeholder="e.g., ${Math.floor(Math.random() * 50) + 10}" />
    `;

    container.appendChild(newGroup);
    inputCounter++;

    // Scroll to the new input
    newGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Remove specific number input
function removeNumberInput(index) {
    const groupToRemove = document.querySelector(`.number-input-group[data-index="${index}"]`);
    if (groupToRemove) {
        groupToRemove.remove();
    }
}

// Clear all inputs except first two
function clearAllInputs() {
    const container = document.getElementById("inputs-container");
    const groups = document.querySelectorAll(".number-input-group");

    // Keep only first two groups
    groups.forEach((group, idx) => {
        if (idx > 1) {
            group.remove();
        } else {
            // Clear the input values
            const input = group.querySelector('input');
            if (input) input.value = '';
        }
    });

    // Reset counter
    inputCounter = 2;

    // Clear result area
    document.getElementById("result-area").innerHTML = "";
}

// Collect all numbers from input fields
function getAllNumbers() {
    const numbers = [];
    const inputs = document.querySelectorAll("#inputs-container input");

    for (let input of inputs) {
        const value = parseFloat(input.value.trim());
        if (!isNaN(value) && input.value.trim() !== "") {
            numbers.push(value);
        }
    }

    return numbers;
}

function calculateLCMHCF() {
    const area = document.getElementById("result-area");
    const numbers = getAllNumbers();

    if (numbers.length < 2) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Please enter at least two valid numbers.
        </div>`;
        return;
    }

    // Check for invalid numbers
    if (numbers.some(n => n < 1)) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            All numbers must be positive whole numbers.
        </div>`;
        return;
    }

    // Check for large numbers
    if (numbers.some(n => n > 10000)) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            Please enter numbers up to 10,000.
        </div>`;
        return;
    }

    // Calculate HCF and LCM
    const hcfResult = gcdArray(numbers);
    const lcmResult = lcmArray(numbers);

    // Create formatted number list
    const numbersList = numbers.join(", ");
    const numbersCount = numbers.length;

    // Generate step-by-step explanation for HCF
    let hcfSteps = "";
    if (numbersCount === 2) {
        hcfSteps = `<div class="result-detail" style="margin-top: 0.75rem;">
            <strong>Step-by-step:</strong><br/>
            HCF(${numbers[0]}, ${numbers[1]}) = ?
        </div>`;
    } else if (numbersCount === 3) {
        hcfSteps = `<div class="result-detail" style="margin-top: 0.75rem;">
            <strong>Step-by-step:</strong><br/>
            Step 1: HCF(${numbers[0]}, ${numbers[1]}) = ${gcd(numbers[0], numbers[1])}<br/>
            Step 2: HCF(${gcd(numbers[0], numbers[1])}, ${numbers[2]}) = ${hcfResult}
        </div>`;
    } else {
        hcfSteps = `<div class="result-detail" style="margin-top: 0.75rem;">
            <strong>HCF calculated using repeated GCD method for ${numbersCount} numbers.</strong>
        </div>`;
    }

    area.innerHTML = `
    <div class="result-pair">
        <div class="result-box">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:arrow-up-circle" data-width="16"></span>
                HCF — Highest Common Factor
            </div>
            <div class="result-value">${hcfResult}</div>
            <div class="result-detail">Largest number that divides <strong>${numbersList}</strong> exactly.</div>
            ${hcfSteps}
        </div>
        <div class="result-box">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:arrow-down-circle" data-width="16"></span>
                LCM — Lowest Common Multiple
            </div>
            <div class="result-value">${lcmResult}</div>
            <div class="result-detail">Smallest positive number that is a multiple of <strong>${numbersList}</strong>.</div>
            <div class="result-detail" style="margin-top: 0.75rem;">
                <strong>Verification:</strong> The LCM is divisible by all ${numbersCount} number(s).
            </div>
        </div>
        <div class="result-box" style="background: var(--color-surface);">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:info-circle" data-width="16"></span>
                Relationship
            </div>
            <div class="result-detail">
                For any two numbers: <strong>a × b = HCF(a,b) × LCM(a,b)</strong>
                ${numbersCount === 2 ? `<br/>✓ ${numbers[0]} × ${numbers[1]} = ${numbers[0] * numbers[1]}<br/>✓ ${hcfResult} × ${lcmResult} = ${hcfResult * lcmResult}` : ''}
            </div>
        </div>
    </div>`;
}

// Add keyboard support
document.addEventListener("DOMContentLoaded", () => {
    // Add event listener for Enter key on dynamically added inputs
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            calculateLCMHCF();
        }
    };

    // Initial inputs
    document.getElementById("num-0")?.addEventListener("keydown", handleEnter);
    document.getElementById("num-1")?.addEventListener("keydown", handleEnter);

    // Watch for new inputs
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.querySelector) {
                    const inputs = node.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.addEventListener("keydown", handleEnter);
                    });
                }
            });
        });
    });

    observer.observe(document.getElementById("inputs-container"), { childList: true, subtree: true });
});