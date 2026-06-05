// =============================================
// APP.JS - Hôm Nay Ăn Gì? Main Application
// =============================================

(function () {
  "use strict";

  // === STATE ===
  let currentCategory = "all";
  let isSpinning = false;
  let filteredFoods = [...FOOD_DATA];
  let wheelItems = [];
  let lastSelectedFood = null;

  // === DOM ELEMENTS ===
  const spinBtn = document.getElementById("spinBtn");
  const wheelCanvas = document.getElementById("wheelCanvas");
  const resultContainer = document.getElementById("resultContainer");
  const resultName = document.getElementById("resultName");
  const resultEmoji = document.getElementById("resultEmoji");
  const resultDesc = document.getElementById("resultDesc");
  const acceptBtn = document.getElementById("acceptBtn");
  const rerollBtn = document.getElementById("rerollBtn");
  const confettiEl = document.getElementById("confetti");
  const cardsGrid = document.getElementById("cardsGrid");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const menuCategories = document.getElementById("menuCategories");
  const floatingEmojis = document.getElementById("floatingEmojis");
  const ctx = wheelCanvas.getContext("2d");

  // Popup elements
  const popupOverlay = document.getElementById("popupOverlay");
  const popupClose = document.getElementById("popupClose");
  const popupEmoji = document.getElementById("popupEmoji");
  const popupName = document.getElementById("popupName");
  const popupDesc = document.getElementById("popupDesc");
  const popupTags = document.getElementById("popupTags");
  const popupConfetti = document.getElementById("popupConfetti");
  const popupAccept = document.getElementById("popupAccept");
  const popupReroll = document.getElementById("popupReroll");
  const popupBadge = document.getElementById("popupBadge");

  // === INITIALIZATION ===
  function init() {
    setupNavigation();
    setupCategoryFilter();
    updateFilteredFoods();
    drawWheel();
    setupWheelEvents();
    setupPopupEvents();
    generateCards();
    renderMenu();
    startFloatingEmojis();
  }

  // === NAVIGATION ===
  function setupNavigation() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        // Update active nav
        document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        // Show section
        document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
        document.getElementById(`section-${section}`).classList.add("active");
      });
    });
  }

  // === CATEGORY FILTER ===
  function setupCategoryFilter() {
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        updateFilteredFoods();
        drawWheel();
        // Hide previous result
        resultContainer.classList.add("hidden");
      });
    });
  }

  function updateFilteredFoods() {
    if (currentCategory === "all") {
      filteredFoods = [...FOOD_DATA];
    } else {
      filteredFoods = FOOD_DATA.filter((f) => f.category === currentCategory);
    }
    // Pick random subset for wheel (max 12 items)
    wheelItems = shuffleArray([...filteredFoods]).slice(0, 12);
  }

  // === WHEEL DRAWING ===
  function drawWheel(rotation = 0) {
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 8;
    const items = wheelItems;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    items.forEach((item, i) => {
      const startAngle = rotation + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();

      // Slice border
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Emoji
      ctx.font = "22px sans-serif";
      ctx.fillText(item.emoji, radius * 0.55, 0);

      // Name - truncate if needed
      ctx.font = "bold 11px Outfit, sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      const name = item.name.length > 14 ? item.name.slice(0, 12) + "…" : item.name;
      ctx.fillText(name, radius * 0.78, 0);

      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a1025";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,107,53,0.6)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍜", center, center);
  }

  // === WHEEL SPIN ===
  function setupWheelEvents() {
    spinBtn.addEventListener("click", spinWheel);
    rerollBtn.addEventListener("click", () => {
      resultContainer.classList.add("hidden");
      spinWheel();
    });
    acceptBtn.addEventListener("click", () => {
      resultContainer.classList.add("hidden");
      showPopup(lastSelectedFood, "wheel");
    });
  }

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.classList.add("spinning");
    resultContainer.classList.add("hidden");

    // Randomize wheel items for this spin
    updateFilteredFoods();

    const totalRotation = Math.PI * 2 * (5 + Math.random() * 5); // 5-10 full rotations
    const duration = 4000 + Math.random() * 1500;
    const startTime = performance.now();
    let currentRotation = 0;

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: decelerate
      const eased = 1 - Math.pow(1 - progress, 4);
      currentRotation = totalRotation * eased;

      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Determine winning item
        const sliceAngle = (2 * Math.PI) / wheelItems.length;
        // The pointer is at the top (3π/2 or -π/2)
        const normalizedAngle = ((2 * Math.PI - (currentRotation % (2 * Math.PI))) + Math.PI * 1.5) % (2 * Math.PI);
        const winIndex = Math.floor(normalizedAngle / sliceAngle) % wheelItems.length;
        const winner = wheelItems[winIndex];

        lastSelectedFood = winner;
        showResult(winner);
        // Show popup immediately after wheel spin
        showPopup(winner, "wheel");
        isSpinning = false;
        spinBtn.classList.remove("spinning");
      }
    }

    requestAnimationFrame(animate);
  }

  // === RESULT DISPLAY (inline card below wheel) ===
  function showResult(food) {
    resultEmoji.textContent = food.emoji;
    resultName.textContent = food.name;
    resultDesc.textContent = food.desc;
    resultContainer.classList.remove("hidden");
    spawnConfetti(confettiEl);
  }

  function spawnConfetti(container) {
    container.innerHTML = "";
    const colors = ["#FF6B35", "#FFD23F", "#FF3366", "#7C5CFC", "#45B7D1", "#6BCB77", "#FF8C32"];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = "-10px";
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + "s";
      piece.style.animationDuration = 2 + Math.random() * 2 + "s";
      piece.style.width = 6 + Math.random() * 8 + "px";
      piece.style.height = 6 + Math.random() * 8 + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      container.appendChild(piece);
    }
  }

  // === POPUP MODAL ===
  function showPopup(food, source = "menu") {
    if (!food) return;

    // Find full food data if only name was passed
    let foodData = food;
    if (typeof food === "string") {
      foodData = FOOD_DATA.find((f) => f.name === food);
      if (!foodData) return;
    }

    lastSelectedFood = foodData;

    // Populate popup content
    popupEmoji.textContent = foodData.emoji;
    popupName.textContent = foodData.name;
    popupDesc.textContent = foodData.desc;

    // Set badge text based on source
    if (source === "wheel") {
      popupBadge.textContent = "🎰 Vòng quay đã chọn!";
    } else if (source === "card") {
      popupBadge.textContent = "🃏 Thẻ may mắn!";
    } else {
      popupBadge.textContent = "🎯 Bạn đã chọn!";
    }

    // Render tags
    popupTags.innerHTML = "";
    if (foodData.tags && foodData.tags.length > 0) {
      foodData.tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "popup-tag";
        const tagLabels = {
          "sáng": "🌅 Bữa sáng",
          "trưa": "☀️ Bữa trưa",
          "chiều": "🌤️ Bữa chiều",
          "tối": "🌙 Bữa tối",
        };
        tagEl.textContent = tagLabels[tag] || tag;
        popupTags.appendChild(tagEl);
      });
    }

    // Category tag
    const catTag = document.createElement("span");
    catTag.className = "popup-tag";
    const catInfo = CATEGORIES[foodData.category];
    catTag.textContent = catInfo ? `${catInfo.emoji} ${catInfo.label}` : foodData.category;
    popupTags.appendChild(catTag);

    // Show reroll button only for wheel/card, hide for menu picks
    if (source === "wheel") {
      popupReroll.style.display = "flex";
      popupReroll.textContent = "";
      popupReroll.innerHTML = "<span>🔄</span> Quay lại lần nữa";
    } else if (source === "card") {
      popupReroll.style.display = "flex";
      popupReroll.textContent = "";
      popupReroll.innerHTML = "<span>🔀</span> Xáo bài mới";
    } else {
      popupReroll.style.display = "none";
    }

    // Spawn confetti in popup
    spawnConfetti(popupConfetti);

    // Show popup
    popupOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  function hidePopup() {
    popupOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function setupPopupEvents() {
    // Close button
    popupClose.addEventListener("click", hidePopup);

    // Click overlay to close
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        hidePopup();
      }
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !popupOverlay.classList.contains("hidden")) {
        hidePopup();
      }
    });

    // Accept button
    popupAccept.addEventListener("click", () => {
      hidePopup();
    });

    // Reroll button
    popupReroll.addEventListener("click", () => {
      hidePopup();
      // Determine context and reroll
      const activeSection = document.querySelector(".section.active");
      if (activeSection && activeSection.id === "section-wheel") {
        resultContainer.classList.add("hidden");
        spinWheel();
      } else if (activeSection && activeSection.id === "section-random") {
        // Shuffle cards
        document.querySelectorAll(".flip-card").forEach((card) => {
          card.classList.remove("flipped");
        });
        setTimeout(() => generateCards(), 400);
      }
    });
  }

  // === CARD FLIP SECTION ===
  function generateCards() {
    cardsGrid.innerHTML = "";
    const shuffled = shuffleArray([...FOOD_DATA]).slice(0, 8);

    shuffled.forEach((food, i) => {
      const card = document.createElement("div");
      card.className = "flip-card";
      card.style.animationDelay = i * 0.05 + "s";
      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <span class="card-question">❓</span>
            <span class="card-hint">Nhấn để lật</span>
          </div>
          <div class="flip-card-back">
            <span class="card-emoji">${food.emoji}</span>
            <span class="card-name">${food.name}</span>
            <span class="card-category">${CATEGORIES[food.category]?.label || food.category}</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => {
        if (!card.classList.contains("flipped")) {
          card.classList.add("flipped");
          // Show popup after flip animation
          setTimeout(() => {
            showPopup(food, "card");
          }, 500);
        }
      });
      cardsGrid.appendChild(card);
    });
  }

  shuffleBtn.addEventListener("click", () => {
    // Reset all cards with animation
    document.querySelectorAll(".flip-card").forEach((card) => {
      card.classList.remove("flipped");
    });
    setTimeout(() => generateCards(), 400);
  });

  // === MENU SECTION ===
  function renderMenu() {
    menuCategories.innerHTML = "";
    const cats = Object.keys(CATEGORIES).filter((c) => c !== "all");

    cats.forEach((catKey) => {
      const cat = CATEGORIES[catKey];
      const items = FOOD_DATA.filter((f) => f.category === catKey);
      if (items.length === 0) return;

      const group = document.createElement("div");
      group.className = "menu-group";
      group.innerHTML = `
        <div class="menu-group-title">
          <span class="menu-group-emoji">${cat.emoji}</span>
          <span class="menu-group-label">${cat.label}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 400;">(${items.length} món)</span>
        </div>
        <div class="menu-items">
          ${items
            .map(
              (item) => `
            <div class="menu-item" data-name="${item.name}">
              <span class="menu-item-emoji">${item.emoji}</span>
              <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-desc">${item.desc}</div>
              </div>
              <button class="menu-item-pick" title="Chọn món này">🎯</button>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      menuCategories.appendChild(group);
    });

    // Add click handlers for menu items — show popup
    document.querySelectorAll(".menu-item-pick").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = btn.closest(".menu-item").dataset.name;
        showPopup(name, "menu");
      });
    });

    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        const name = item.dataset.name;
        showPopup(name, "menu");
      });
    });
  }

  // === FLOATING EMOJIS BACKGROUND ===
  function startFloatingEmojis() {
    const emojis = ["🍜", "🍚", "🍕", "🍔", "🍣", "🌮", "🥟", "🍛", "🧋", "🍗", "🥩", "🍝", "🍙", "🥖", "☕", "🍤"];
    const isMobile = window.innerWidth <= 430;
    
    function spawnEmoji() {
      const emoji = document.createElement("span");
      emoji.className = "floating-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = Math.random() * 100 + "%";
      emoji.style.fontSize = (isMobile ? 0.8 : 1) + Math.random() * 1.2 + "rem";
      emoji.style.animationDuration = 12 + Math.random() * 18 + "s";
      emoji.style.animationDelay = Math.random() * 2 + "s";
      floatingEmojis.appendChild(emoji);

      // Remove after animation
      setTimeout(() => {
        emoji.remove();
      }, 32000);
    }

    // Initial batch — fewer on mobile
    const initialCount = isMobile ? 5 : 10;
    for (let i = 0; i < initialCount; i++) {
      setTimeout(spawnEmoji, i * 800);
    }

    // Keep spawning — slower on mobile
    setInterval(spawnEmoji, isMobile ? 5000 : 2500);
  }

  // === UTILITIES ===
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // === START ===
  document.addEventListener("DOMContentLoaded", init);
})();
