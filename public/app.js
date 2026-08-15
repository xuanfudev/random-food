// =============================================
// APP.JS - Gia Phả Nhóm Application
// =============================================

(function () {
  "use strict";

  // === INITIALIZATION ===
  function init() {
    initGroupGraph();
    startFloatingEmojis();
  }

  // === GROUP GRAPH SECTION ===
  let groupData = {
    members: [],
    relationships: [],
    customRelations: []
  };

  const relTypeLabels = {
    "nguoi-yeu": "Người yêu 💖",
    "map-mo": "Mập mờ 💜",
    "ban-than": "Bạn thân 🤝",
    "ke-thu": "Kẻ thù ⚡",
    "sep": "Sếp/Lính 👑"
  };

  const roleLabels = {
    "member": "Thành viên",
    "leader": "Trưởng nhóm",
    "vice": "Phó nhóm"
  };

  let dragNodeId = null;
  let dragStartX, dragStartY, nodeStartX, nodeStartY;

  // Zoom & Pan state
  let currentZoom = 1;
  let panX = 0, panY = 0;
  let isPanning = false;
  let panStartX = 0, panStartY = 0, panStartPanX = 0, panStartPanY = 0;
  let lastPinchDist = 0;

  async function initGroupGraph() {
    try {
      const res = await fetch('/api/graph');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.members)) {
          groupData = data;
        }
      }
    } catch (e) {
      console.error("Failed to load group data from DB", e);
    }
    
    // Bind events
    const addMemberBtn = document.getElementById("addMemberBtn");
    if (addMemberBtn) addMemberBtn.addEventListener("click", handleAddMember);
    
    const addRelBtn = document.getElementById("addRelBtn");
    if (addRelBtn) addRelBtn.addEventListener("click", handleAddRelation);
    
    const clearGraphBtn = document.getElementById("clearGraphBtn");
    if (clearGraphBtn) clearGraphBtn.addEventListener("click", handleClearGraph);

    const graphArea = document.getElementById("graphArea");
    if(graphArea) {
      graphArea.addEventListener("mousemove", handleDragNode);
      
      // Touch events for mobile
      graphArea.addEventListener("touchmove", handleTouchMove, { passive: false });
      
      // Mouse/touch up
      window.addEventListener("mouseup", handleEndDrag);
      window.addEventListener("touchend", handleEndDrag);

      // Scroll-wheel zoom
      graphArea.addEventListener("wheel", handleWheelZoom, { passive: false });

      // Pan: mouse drag on empty area
      graphArea.addEventListener("mousedown", handlePanStart);
      graphArea.addEventListener("mousemove", handlePanMove);
      window.addEventListener("mouseup", handlePanEnd);

      // Pan: touch drag on empty area + pinch zoom
      graphArea.addEventListener("touchstart", handleTouchStart, { passive: false });
      graphArea.addEventListener("touchend", handlePanEnd);
    }
    
    // Zoom buttons
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const zoomResetBtn = document.getElementById("zoomResetBtn");
    if (zoomInBtn) zoomInBtn.addEventListener("click", () => applyZoom(currentZoom + 0.15));
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => applyZoom(currentZoom - 0.15));
    if (zoomResetBtn) zoomResetBtn.addEventListener("click", () => { panX = 0; panY = 0; applyZoom(1); });

    const addCustomRelBtn = document.getElementById("addCustomRelBtn");
    if (addCustomRelBtn) addCustomRelBtn.addEventListener("click", handleAddCustomRel);

    renderGraph();
    
    // Handle window resize to redraw lines
    window.addEventListener("resize", drawLines);
  }

  function handleAddMember() {
    const nameInput = document.getElementById("memberName");
    const roleSelect = document.getElementById("memberRole");
    
    const name = nameInput.value.trim();
    if (!name) return alert("Vui lòng nhập tên thành viên!");

    const newId = 'm_' + Date.now();
    
    const graphArea = document.getElementById("graphArea");
    let x = 50, y = 50;
    if (graphArea) {
      const areaRect = graphArea.getBoundingClientRect();
      // Keep within bounds
      x = Math.max(20, Math.random() * (areaRect.width - 100));
      y = Math.max(20, Math.random() * (areaRect.height - 80));
    }

    groupData.members.push({
      id: newId,
      name: name,
      role: roleSelect.value,
      x: x,
      y: y
    });

    nameInput.value = "";
    saveAndRenderGraph();
  }

  function handleAddRelation() {
    const pA = document.getElementById("relPersonA").value;
    const pB = document.getElementById("relPersonB").value;
    const rType = document.getElementById("relType").value;

    if (!pA || !pB) return alert("Vui lòng chọn đủ 2 người!");
    if (pA === pB) return alert("Không thể thiết lập quan hệ với chính mình!");

    const exists = groupData.relationships.some(
      r => ((r.source === pA && r.target === pB) || (r.source === pB && r.target === pA)) && r.type === rType
    );
    if (exists) return alert("Mối quan hệ này giữa 2 người đã tồn tại!");

    groupData.relationships.push({
      id: 'r_' + Date.now(),
      source: pA,
      target: pB,
      type: rType
    });

    saveAndRenderGraph();
  }

  function handleClearGraph() {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ gia phả nhóm?")) {
      groupData = { members: [], relationships: [], customRelations: [] };
      saveAndRenderGraph();
    }
  }

  function handleAddCustomRel() {
    const nameInput = document.getElementById("customRelName");
    const colorInput = document.getElementById("customRelColor");
    const name = nameInput.value.trim();
    if (!name) return alert("Vui lòng nhập tên loại quan hệ!");
    
    if (!groupData.customRelations) groupData.customRelations = [];
    const newId = 'custom_' + Date.now();
    groupData.customRelations.push({
      id: newId,
      name: name,
      color: colorInput.value
    });
    nameInput.value = "";
    saveAndRenderGraph();
  }

  function deleteMember(id) {
    groupData.members = groupData.members.filter(m => m.id !== id);
    groupData.relationships = groupData.relationships.filter(r => r.source !== id && r.target !== id);
    saveAndRenderGraph();
  }

  function deleteRelation(id) {
    groupData.relationships = groupData.relationships.filter(r => r.id !== id);
    saveAndRenderGraph();
  }

  async function saveAndRenderGraph() {
    renderGraph();
    try {
      await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
    } catch (e) {
      console.error("Lỗi khi lưu dữ liệu vào DB", e);
    }
  }

  function renderGraph() {
    const pA = document.getElementById("relPersonA");
    const pB = document.getElementById("relPersonB");
    const relTypeSelect = document.getElementById("relType");
    
    const optionsHtml = `<option value="">-- Chọn người --</option>` + 
      groupData.members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");
    
    if(pA) pA.innerHTML = optionsHtml;
    if(pB) pB.innerHTML = optionsHtml;

    if (relTypeSelect) {
      let relOptions = `
        <option value="nguoi-yeu">Người yêu 💖</option>
        <option value="map-mo">Mập mờ 💜</option>
        <option value="ban-than">Bạn thân 🤝</option>
        <option value="ke-thu">Kẻ thù ⚡</option>
        <option value="sep">Sếp / Lính 👑</option>
      `;
      if (groupData.customRelations) {
        groupData.customRelations.forEach(cr => {
          relOptions += `<option value="${cr.id}">${cr.name}</option>`;
        });
      }
      relTypeSelect.innerHTML = relOptions;
    }

    const nodesContainer = document.getElementById("graphNodes");
    if(!nodesContainer) return;

    // Remove old nodes and labels
    nodesContainer.innerHTML = "";

    groupData.members.forEach(member => {
      const node = document.createElement("div");
      node.className = `graph-node role-${member.role}`;
      node.id = member.id;
      node.style.left = member.x + "px";
      node.style.top = member.y + "px";

      node.innerHTML = `
        <div class="node-delete" title="Xóa người này">✕</div>
        <div class="node-role-badge">${roleLabels[member.role]}</div>
        <div class="node-name">${member.name}</div>
      `;

      // Mouse events
      node.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("node-delete")) return;
        dragNodeId = member.id;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        nodeStartX = member.x;
        nodeStartY = member.y;
      });

      // Touch events for mobile
      node.addEventListener("touchstart", (e) => {
        if (e.target.classList.contains("node-delete")) return;
        const touch = e.touches[0];
        dragNodeId = member.id;
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        nodeStartX = member.x;
        nodeStartY = member.y;
        
        // Prevent scrolling while dragging
        document.body.style.overflow = "hidden";
      }, { passive: false });

      node.querySelector(".node-delete").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteMember(member.id);
      });
      node.querySelector(".node-delete").addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMember(member.id);
      });

      nodesContainer.appendChild(node);
    });

    // Make sure SVG lines are rendered after nodes are attached
    setTimeout(drawLines, 0);
  }

  function handleDragNode(e) {
    if (!dragNodeId) return;
    
    const dx = (e.clientX - dragStartX) / currentZoom;
    const dy = (e.clientY - dragStartY) / currentZoom;
    
    updateNodePosition(dx, dy);
  }

  function handleTouchMove(e) {
    // Handle pinch zoom with 2 fingers
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastPinchDist > 0) {
        const delta = (dist - lastPinchDist) * 0.005;
        applyZoom(currentZoom + delta);
      }
      lastPinchDist = dist;
      return;
    }

    if (!dragNodeId && !isPanning) return;
    e.preventDefault();
    
    const touch = e.touches[0];

    // Panning on background
    if (isPanning) {
      panX = panStartPanX + (touch.clientX - panStartX);
      panY = panStartPanY + (touch.clientY - panStartY);
      applyTransform();
      return;
    }

    // Dragging a node
    if (dragNodeId) {
      const dx = (touch.clientX - dragStartX) / currentZoom;
      const dy = (touch.clientY - dragStartY) / currentZoom;
      updateNodePosition(dx, dy);
    }
  }

  function updateNodePosition(dx, dy) {
    const nodeData = groupData.members.find(m => m.id === dragNodeId);
    if (nodeData) {
      nodeData.x = nodeStartX + dx;
      nodeData.y = nodeStartY + dy;
      
      const nodeEl = document.getElementById(dragNodeId);
      if (nodeEl) {
        nodeEl.style.left = nodeData.x + "px";
        nodeEl.style.top = nodeData.y + "px";
      }
      
      drawLines();
    }
  }

  async function handleEndDrag() {
    lastPinchDist = 0;
    isPanning = false;
    if (dragNodeId) {
      dragNodeId = null;
      document.body.style.overflow = ""; // Restore scrolling
      try {
        await fetch('/api/graph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(groupData)
        });
      } catch (e) {
        console.error("Lỗi khi lưu dữ liệu kéo thả vào DB", e);
      }
    }
  }

  // === ZOOM & PAN ===
  function applyZoom(newZoom) {
    currentZoom = Math.max(0.3, Math.min(3, newZoom));
    applyTransform();
    const resetBtn = document.getElementById("zoomResetBtn");
    if (resetBtn) resetBtn.textContent = Math.round(currentZoom * 100) + "%";
    // Redraw lines at new scale
    setTimeout(drawLines, 0);
  }

  function applyTransform() {
    const content = document.getElementById("graphContent");
    if (content) {
      content.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
    }
  }

  function handleWheelZoom(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    applyZoom(currentZoom + delta);
  }

  function handlePanStart(e) {
    // Only start panning if clicking on the background (not on a node)
    if (e.target.closest(".graph-node") || e.target.closest(".rel-label-group") || e.target.closest(".zoom-controls")) return;
    isPanning = true;
    panStartX = e.clientX;
    panStartY = e.clientY;
    panStartPanX = panX;
    panStartPanY = panY;
  }

  function handlePanMove(e) {
    if (!isPanning) return;
    panX = panStartPanX + (e.clientX - panStartX);
    panY = panStartPanY + (e.clientY - panStartY);
    applyTransform();
  }

  function handlePanEnd() {
    isPanning = false;
    lastPinchDist = 0;
  }

  function handleTouchStart(e) {
    // Pinch init
    if (e.touches.length === 2) {
      lastPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      return;
    }
    // Pan on background touch
    if (!e.target.closest(".graph-node") && !e.target.closest(".rel-label-group") && !e.target.closest(".zoom-controls")) {
      isPanning = true;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      panStartPanX = panX;
      panStartPanY = panY;
    }
  }

  function drawLines() {
    const svg = document.getElementById("graphLines");
    const nodesContainer = document.getElementById("graphNodes");
    const graphContent = document.getElementById("graphContent");
    if (!svg || !nodesContainer || !graphContent) return;

    // Use a large fixed canvas size so lines render properly at any zoom
    const canvasSize = 4000;
    svg.setAttribute("width", canvasSize);
    svg.setAttribute("height", canvasSize);
    const pRect = nodesContainer.getBoundingClientRect();
    
    svg.innerHTML = "";
    
    const oldLabels = nodesContainer.querySelectorAll(".rel-label-group, .rel-label");
    oldLabels.forEach(lbl => lbl.remove());

    const pairs = {};
    groupData.relationships.forEach(rel => {
      const pairKey = [rel.source, rel.target].sort().join('-');
      if (!pairs[pairKey]) {
        pairs[pairKey] = { source: rel.source, target: rel.target, relations: [] };
      }
      pairs[pairKey].relations.push(rel);
    });

    Object.values(pairs).forEach(pair => {
      const sourceEl = document.getElementById(pair.source);
      const targetEl = document.getElementById(pair.target);
      if (!sourceEl || !targetEl) return;

      const sRect = sourceEl.getBoundingClientRect();
      const tRect = targetEl.getBoundingClientRect();

      // Calculate relative coordinates
      const x1 = sRect.left - pRect.left + sRect.width / 2;
      const y1 = sRect.top - pRect.top + sRect.height / 2;
      const x2 = tRect.left - pRect.left + tRect.width / 2;
      const y2 = tRect.top - pRect.top + tRect.height / 2;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      
      const firstRel = pair.relations[0];
      let strokeColor = "rgba(255,255,255,0.2)";
      let customCr = groupData.customRelations ? groupData.customRelations.find(cr => cr.id === firstRel.type) : null;
      
      if(firstRel.type === 'nguoi-yeu') strokeColor = "#FF69B4";
      else if(firstRel.type === 'map-mo') strokeColor = "#9370DB";
      else if(firstRel.type === 'ban-than') strokeColor = "#87CEEB";
      else if(firstRel.type === 'ke-thu') strokeColor = "#FF4500";
      else if(firstRel.type === 'sep') strokeColor = "#FFD700";
      else if(customCr) strokeColor = customCr.color;

      if (pair.relations.length > 1) {
        strokeColor = "rgba(255,255,255,0.5)"; 
      }

      line.setAttribute("stroke", strokeColor);
      line.setAttribute("stroke-width", pair.relations.length > 1 ? "4" : "3");
      line.setAttribute("stroke-dasharray", firstRel.type === 'map-mo' ? "5,5" : "0");
      svg.appendChild(line);

      const labelGroup = document.createElement("div");
      labelGroup.className = "rel-label-group";
      labelGroup.style.left = ((x1 + x2) / 2) + "px";
      labelGroup.style.top = ((y1 + y2) / 2) + "px";
      
      pair.relations.forEach(rel => {
        let labelName = relTypeLabels[rel.type] || rel.type;
        let labelColor = "var(--border)";
        let customRel = groupData.customRelations ? groupData.customRelations.find(cr => cr.id === rel.type) : null;
        if (customRel) {
          labelName = customRel.name;
          labelColor = customRel.color;
        }

        const label = document.createElement("div");
        label.className = `rel-label rel-${rel.type}`;
        
        if (customRel) {
            label.style.borderColor = labelColor;
            label.style.color = labelColor;
        }

        label.innerHTML = `
          ${labelName}
          <span class="rel-delete" title="Xóa quan hệ này" data-id="${rel.id}">✕</span>
        `;
        labelGroup.appendChild(label);
      });

      nodesContainer.appendChild(labelGroup);
    });

    nodesContainer.querySelectorAll(".rel-delete").forEach(delBtn => {
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteRelation(e.target.getAttribute("data-id"));
      });
      // Touch event
      delBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteRelation(e.target.getAttribute("data-id"));
      });
    });
  }

  // === FLOATING EMOJIS BACKGROUND ===
  function startFloatingEmojis() {
    const emojis = ["👨‍👩‍👦", "👨‍👧", "👨‍👨‍👦", "🧑‍🤝‍🧑", "👭", "💖", "⚡", "🤝", "👑"];
    const isMobile = window.innerWidth <= 430;
    
    function spawnEmoji() {
      const emoji = document.createElement("span");
      emoji.className = "floating-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = Math.random() * 100 + "%";
      emoji.style.fontSize = (isMobile ? 0.8 : 1) + Math.random() * 1.2 + "rem";
      emoji.style.animationDuration = 12 + Math.random() * 18 + "s";
      emoji.style.animationDelay = Math.random() * 2 + "s";
      document.getElementById("floatingEmojis").appendChild(emoji);

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

  // === START ===
  document.addEventListener("DOMContentLoaded", init);
})();
