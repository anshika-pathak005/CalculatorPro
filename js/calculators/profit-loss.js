/* ============================================================
   profit-loss.js — Complete Profit & Loss Calculator
   ============================================================ */

// Switch between different modes
function switchMode(mode) {
    // Update tab buttons
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    // Update panels
    document.querySelectorAll('.mode-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    document.getElementById(`mode-${mode}`).classList.remove('hidden');

    // Clear result area
    document.getElementById('result-area').innerHTML = '';
}

// Calculate Basic Profit/Loss
function calculateBasicPL() {
    const cp = parseFloat(document.getElementById('basic-cp').value.trim());
    const sp = parseFloat(document.getElementById('basic-sp').value.trim());
    const area = document.getElementById('result-area');

    // Validation
    if (isNaN(cp) || isNaN(sp)) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Please enter both Cost Price and Selling Price.
        </div>`;
        return;
    }

    if (cp < 0 || sp < 0) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-triangle" data-width="20"></span>
            Prices cannot be negative.
        </div>`;
        return;
    }

    const difference = sp - cp;
    const isProfit = difference > 0;
    const isLoss = difference < 0;
    const amount = Math.abs(difference);
    const percentage = (amount / cp) * 100;

    let resultHtml = '';
    let cardClass = '';
    let icon = '';
    let status = '';

    if (isProfit) {
        cardClass = 'profit-card';
        icon = '📈';
        status = 'PROFIT';
        resultHtml = `
            <div class="result-box ${cardClass}">
                <div class="result-label">
                    <span class="iconify" data-icon="tabler:trending-up" data-width="16"></span>
                    ${icon} ${status}
                </div>
                <div class="result-amount profit-color">+ ₹${formatNumber(amount)}</div>
                <div class="result-detail">Profit Percentage: <strong>${formatNumber(percentage)}%</strong></div>
                
                <div class="step-by-step">
                    <div class="result-label">Step-by-Step:</div>
                    <div class="step-item">
                        <span class="step-number">1.</span>
                        <span class="step-text">Profit = SP - CP = ${sp} - ${cp} = ${formatNumber(amount)}</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2.</span>
                        <span class="step-text">Profit% = (Profit ÷ CP) × 100 = (${formatNumber(amount)} ÷ ${cp}) × 100 = ${formatNumber(percentage)}%</span>
                    </div>
                </div>
            </div>
        `;
    } else if (isLoss) {
        cardClass = 'loss-card';
        icon = '📉';
        status = 'LOSS';
        resultHtml = `
            <div class="result-box ${cardClass}">
                <div class="result-label">
                    <span class="iconify" data-icon="tabler:trending-down" data-width="16"></span>
                    ${icon} ${status}
                </div>
                <div class="result-amount loss-color">- ₹${formatNumber(amount)}</div>
                <div class="result-detail">Loss Percentage: <strong>${formatNumber(percentage)}%</strong></div>
                
                <div class="step-by-step">
                    <div class="result-label">Step-by-Step:</div>
                    <div class="step-item">
                        <span class="step-number">1.</span>
                        <span class="step-text">Loss = CP - SP = ${cp} - ${sp} = ${formatNumber(amount)}</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2.</span>
                        <span class="step-text">Loss% = (Loss ÷ CP) × 100 = (${formatNumber(amount)} ÷ ${cp}) × 100 = ${formatNumber(percentage)}%</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        cardClass = 'neutral-card';
        resultHtml = `
            <div class="result-box ${cardClass}">
                <div class="result-label">
                    <span class="iconify" data-icon="tabler:minus" data-width="16"></span>
                    No Profit, No Loss
                </div>
                <div class="result-detail">Selling Price equals Cost Price. No profit or loss incurred.</div>
            </div>
        `;
    }

    // Add comparison section
    resultHtml += `
        <div class="comparison-section">
            <div class="comparison-box">
                <div class="comparison-label">Cost Price (CP)</div>
                <div class="comparison-value">₹${formatNumber(cp)}</div>
            </div>
            <div class="comparison-box">
                <div class="comparison-label">Selling Price (SP)</div>
                <div class="comparison-value">₹${formatNumber(sp)}</div>
            </div>
        </div>
    `;

    area.innerHTML = resultHtml;
}

// Find Cost Price
function calculateCP() {
    const sp = parseFloat(document.getElementById('findcp-sp').value.trim());
    const pl = parseFloat(document.getElementById('findcp-pl').value.trim());
    const area = document.getElementById('result-area');

    if (isNaN(sp) || isNaN(pl)) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Please enter both Selling Price and Profit/Loss amount.
        </div>`;
        return;
    }

    let cp, type, amount, percentage;

    if (pl > 0) {
        // Profit scenario
        cp = sp - pl;
        type = 'profit';
        amount = pl;
        percentage = (amount / cp) * 100;
    } else if (pl < 0) {
        // Loss scenario
        cp = sp + Math.abs(pl);
        type = 'loss';
        amount = Math.abs(pl);
        percentage = (amount / cp) * 100;
    } else {
        cp = sp;
        type = 'neutral';
    }

    const cardClass = type === 'profit' ? 'profit-card' : (type === 'loss' ? 'loss-card' : 'neutral-card');

    let resultHtml = `
        <div class="result-box ${cardClass}">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:tag" data-width="16"></span>
                Cost Price (CP)
            </div>
            <div class="result-amount">₹${formatNumber(cp)}</div>
    `;

    if (type === 'profit') {
        resultHtml += `
            <div class="result-detail">Profit: ₹${formatNumber(amount)} (${formatNumber(percentage)}%)</div>
            <div class="step-by-step">
                <div class="step-item">
                    <span class="step-number">1.</span>
                    <span class="step-text">When there is profit: CP = SP - Profit</span>
                </div>
                <div class="step-item">
                    <span class="step-number">2.</span>
                    <span class="step-text">CP = ${sp} - ${amount} = ${formatNumber(cp)}</span>
                </div>
            </div>
        `;
    } else if (type === 'loss') {
        resultHtml += `
            <div class="result-detail">Loss: ₹${formatNumber(amount)} (${formatNumber(percentage)}%)</div>
            <div class="step-by-step">
                <div class="step-item">
                    <span class="step-number">1.</span>
                    <span class="step-text">When there is loss: CP = SP + Loss</span>
                </div>
                <div class="step-item">
                    <span class="step-number">2.</span>
                    <span class="step-text">CP = ${sp} + ${amount} = ${formatNumber(cp)}</span>
                </div>
            </div>
        `;
    } else {
        resultHtml += `<div class="result-detail">No profit, no loss. CP = SP</div>`;
    }

    resultHtml += `</div>`;
    area.innerHTML = resultHtml;
}

// Find Selling Price
function calculateSP() {
    const cp = parseFloat(document.getElementById('findsp-cp').value.trim());
    const pl = parseFloat(document.getElementById('findsp-pl').value.trim());
    const area = document.getElementById('result-area');

    if (isNaN(cp) || isNaN(pl)) {
        area.innerHTML = `<div class="error-box">
            <span class="iconify" data-icon="tabler:alert-circle" data-width="20"></span>
            Please enter both Cost Price and Profit/Loss amount.
        </div>`;
        return;
    }

    let sp, type, amount, percentage;

    if (pl > 0) {
        // Profit scenario
        sp = cp + pl;
        type = 'profit';
        amount = pl;
        percentage = (amount / cp) * 100;
    } else if (pl < 0) {
        // Loss scenario
        sp = cp - Math.abs(pl);
        type = 'loss';
        amount = Math.abs(pl);
        percentage = (amount / cp) * 100;
    } else {
        sp = cp;
        type = 'neutral';
    }

    const cardClass = type === 'profit' ? 'profit-card' : (type === 'loss' ? 'loss-card' : 'neutral-card');

    let resultHtml = `
        <div class="result-box ${cardClass}">
            <div class="result-label">
                <span class="iconify" data-icon="tabler:currency-rupee" data-width="16"></span>
                Selling Price (SP)
            </div>
            <div class="result-amount">₹${formatNumber(sp)}</div>
    `;

    if (type === 'profit') {
        resultHtml += `
            <div class="result-detail">Profit: ₹${formatNumber(amount)} (${formatNumber(percentage)}%)</div>
            <div class="step-by-step">
                <div class="step-item">
                    <span class="step-number">1.</span>
                    <span class="step-text">When there is profit: SP = CP + Profit</span>
                </div>
                <div class="step-item">
                    <span class="step-number">2.</span>
                    <span class="step-text">SP = ${cp} + ${amount} = ${formatNumber(sp)}</span>
                </div>
            </div>
        `;
    } else if (type === 'loss') {
        resultHtml += `
            <div class="result-detail">Loss: ₹${formatNumber(amount)} (${formatNumber(percentage)}%)</div>
            <div class="step-by-step">
                <div class="step-item">
                    <span class="step-number">1.</span>
                    <span class="step-text">When there is loss: SP = CP - Loss</span>
                </div>
                <div class="step-item">
                    <span class="step-number">2.</span>
                    <span class="step-text">SP = ${cp} - ${amount} = ${formatNumber(sp)}</span>
                </div>
            </div>
        `;
    } else {
        resultHtml += `<div class="result-detail">No profit, no loss. SP = CP</div>`;
    }

    resultHtml += `</div>`;
    area.innerHTML = resultHtml;
}

// Format numbers
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    }
    return parseFloat(num.toFixed(2)).toString();
}

// Add Enter key support
document.addEventListener("DOMContentLoaded", () => {
    // Basic mode
    const basicCp = document.getElementById('basic-cp');
    const basicSp = document.getElementById('basic-sp');
    if (basicCp && basicSp) {
        basicCp.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateBasicPL(); });
        basicSp.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateBasicPL(); });
    }

    // Find CP mode
    const findcpSp = document.getElementById('findcp-sp');
    const findcpPl = document.getElementById('findcp-pl');
    if (findcpSp && findcpPl) {
        findcpSp.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateCP(); });
        findcpPl.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateCP(); });
    }

    // Find SP mode
    const findspCp = document.getElementById('findsp-cp');
    const findspPl = document.getElementById('findsp-pl');
    if (findspCp && findspPl) {
        findspCp.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateSP(); });
        findspPl.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculateSP(); });
    }
});