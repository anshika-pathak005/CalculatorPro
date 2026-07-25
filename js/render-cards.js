/* ============================================================
   render-cards.js- Reads CALCULATORS array from cards-data.js
   and builds the homepage card grid.
   ============================================================ */

function renderCards() {
  const grid = document.getElementById("cards-grid");
  if (!grid) return;

  grid.innerHTML = CALCULATORS.map(c => `
    <a class="calc-card" href="${c.link}" title="${c.title}">
      <div class="card-icon" style="background:${c.iconBg}">
        <span
          class="iconify"
          data-icon="${c.icon}"
          data-width="26"
          data-height="26"
          style="color:${c.iconColor}"
        ></span>
      </div>
      <span class="badge card-badge">${c.badge}</span>
      <div class="card-title">${c.title}</div>
      <div class="card-desc">${c.description}</div>
      <div class="card-arrow">Open Calculator →</div>
    </a>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderCards);