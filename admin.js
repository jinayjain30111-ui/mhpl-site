(function () {
  let selectedAdminTeamId = null;
  const ADMIN_PASSWORD = "Jinay2421!";

  function loginAdmin() {
    if (window.appState.isAdmin) {
      alert("Already logged in as Admin.");
      return;
    }
    const password = prompt("Enter Admin Password:");
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      updateAdminUI();
      alert("Logged in as Admin");
      location.reload();
      return;
    }
    alert("Wrong password");
  }

  function logoutAdmin() {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isAdminSession");
    updateAdminUI();
    alert("Logged out");
    location.reload();
  }

  function updateAdminUI() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    document.querySelectorAll(".admin-only").forEach((el) => {
      const display = el.dataset.adminDisplay || "block";
      el.style.display = isAdmin ? display : "none";
    });

    const lockLeagueBtn = document.getElementById("lockLeagueBtn");
    const unlockLeagueBtn = document.getElementById("unlockLeagueBtn");

    if (isAdmin) {
      if (lockLeagueBtn) lockLeagueBtn.style.display = window.isLocked ? "none" : (lockLeagueBtn.dataset.adminDisplay || "block");
      if (unlockLeagueBtn) unlockLeagueBtn.style.display = window.isLocked ? (unlockLeagueBtn.dataset.adminDisplay || "block") : "none";
    }
    updateAdminButtons();
  }

  function updateAdminButtons() {
    const leagueBtn = document.getElementById("leagueLockBtn");
    if (leagueBtn) {
      leagueBtn.innerText = window.isLocked ? "Unlock League" : "Lock League";
    }
  }

  function toggleLeagueLock() {
    if (!window.appState.isAdmin) return;
    if (window.isLocked) {
      unlockLeague();
      return;
    }
    lockLeague();
  }

  function updateAdminToolbar() {
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    updateAdminUI();
    if (adminLogoutBtn) adminLogoutBtn.style.display = window.appState.isAdmin ? (adminLogoutBtn.dataset.adminDisplay || "inline-flex") : "none";
    if (adminLoginBtn) adminLoginBtn.style.display = window.appState.isAdmin ? "none" : "inline-flex";
  }

  function getUniquePlayers() {
    const aliasMap = {
      "nicholas pooran": "nicolas pooran",
      "varun chakravarthy": "varun chakravarty"
    };
    const normalize = (name) => {
      const cleaned = String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
      return aliasMap[cleaned] || cleaned;
    };

    const statsNames = Object.keys(window.playerStats || {});
    const statsByNorm = new Map();
    statsNames.forEach((name) => statsByNorm.set(normalize(name), name));

    const uniquePlayers = new Map();
    (window.teams || []).forEach((team) => {
      (team.players || []).forEach((player) => {
        const rawName = typeof player === "string" ? player : player?.name;
        if (!rawName) return;
        const norm = normalize(rawName);
        if (uniquePlayers.has(norm)) return;
        const canonical = statsByNorm.get(norm) || String(rawName).trim().replace(/\s+/g, " ");
        uniquePlayers.set(norm, canonical);
      });
    });
    return [...uniquePlayers.values()];
  }

  function makeInputId(prefix, playerName) {
    return `${prefix}_${String(playerName).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  }

  function renderPlayerEditorList() {
    const container = document.getElementById("playerList");
    if (!container) return;
    container.innerHTML = "";
    console.log("Rendering player editor with:", window.playerStats);
    const search = document.createElement("input");
    search.type = "text";
    search.id = "playerSearch";
    search.placeholder = "Search player...";
    search.className = "search-input";
    search.setAttribute("oninput", "filterPlayers()");
    container.appendChild(search);
    const uniquePlayers = getUniquePlayers();
    uniquePlayers.forEach((name) => {
      const stats = window.playerStats[name] || { runs: 0, wickets: 0, bonus: 0 };
      const row = document.createElement("div");
      row.className = "admin-player-row player-search-row";
      row.dataset.playerName = name;
      row.dataset.name = name.toLowerCase();
      row.innerHTML = `
        <div class="admin-player-name">${name}</div>
        <div class="field"><label>Runs</label><input type="number" id="${makeInputId("runs", name)}" class="player-editor-runs" value="${Number(stats.runs) || 0}" min="0" step="1" /></div>
        <div class="field"><label>Wkts</label><input type="number" id="${makeInputId("wkts", name)}" class="player-editor-wickets" value="${Number(stats.wickets) || 0}" min="0" step="1" /></div>
        <div class="field"><label>Bonus</label><input type="number" id="${makeInputId("bonus", name)}" class="player-editor-bonus" value="${Number(stats.bonus) || 0}" min="0" step="1" /></div>
      `;
      container.appendChild(row);
    });
  }

  function filterPlayers() {
    const searchInput = document.getElementById("playerSearch");
    const container = document.getElementById("playerList");
    if (!searchInput || !container) return;
    const search = searchInput.value.toLowerCase();
    const rows = container.querySelectorAll(".player-search-row");
    const visible = [];
    const hidden = [];
    rows.forEach((row) => {
      const name = String(row.dataset.name || "").toLowerCase();
      if (name.includes(search)) {
        row.style.display = "";
        visible.push(row);
      } else {
        row.style.display = "none";
        hidden.push(row);
      }
    });
    visible.concat(hidden).forEach((el) => container.appendChild(el));
  }

  function openPlayerEditor() {
    if (!window.appState.isAdmin) return;
    if (window.isLocked) {
      alert("League is locked. Player score editing is disabled.");
      return;
    }
    renderPlayerEditorList();
    const editor = document.getElementById("playerEditor");
    if (editor) editor.classList.add("show");
  }

  function closePlayerEditor() {
    const editor = document.getElementById("playerEditor");
    if (editor) editor.classList.remove("show");
  }

  function savePlayerScores() {
    const uniquePlayers = getUniquePlayers();
    uniquePlayers.forEach((name) => {
      const runs = Number(document.getElementById(makeInputId("runs", name))?.value) || 0;
      const wickets = Number(document.getElementById(makeInputId("wkts", name))?.value) || 0;
      const bonus = Number(document.getElementById(makeInputId("bonus", name))?.value) || 0;
      window.playerStats[name] = {
        ...(window.playerStats[name] || {}),
        runs,
        wickets,
        bonus
      };
      console.log("Updated:", name, window.playerStats[name]);
    });
    if (typeof window.renderAll === "function") {
      window.renderAll();
    }
    if (typeof window.saveDataToFirebase === "function") {
      window.saveDataToFirebase();
    }
    alert("Player scores updated");
    closePlayerEditor();
  }

  function renderAdminEditList() {
    const container = document.getElementById("adminEditList");
    if (!container) return;
    container.innerHTML = "";

    const pickerWrap = document.createElement("div");
    pickerWrap.className = "field admin-team-picker";
    const pickerLabel = document.createElement("label");
    pickerLabel.textContent = "Select Team";
    const picker = document.createElement("select");
    picker.id = "adminTeamSelect";
    window.enrichedTeams.forEach((team) => {
      const option = document.createElement("option");
      option.value = String(team.id);
      option.textContent = team.name;
      picker.appendChild(option);
    });
    if (selectedAdminTeamId == null && window.enrichedTeams.length) {
      selectedAdminTeamId = window.enrichedTeams[0].id;
    }
    picker.value = String(selectedAdminTeamId ?? "");
    picker.addEventListener("change", () => {
      selectedAdminTeamId = Number(picker.value);
      renderAdminEditList();
    });
    pickerLabel.appendChild(picker);
    pickerWrap.appendChild(pickerLabel);
    container.appendChild(pickerWrap);

    const selectedTeam = window.enrichedTeams.find((t) => t.id === Number(selectedAdminTeamId));
    if (!selectedTeam) return;

    const teamTitle = document.createElement("div");
    teamTitle.className = "admin-team-title";
    teamTitle.textContent = selectedTeam.name;
    container.appendChild(teamTitle);

    if (window.isLocked) {
      if (!selectedTeam.lockedPlayers || typeof selectedTeam.lockedPlayers !== "object") {
        selectedTeam.lockedPlayers = {};
      }
      selectedTeam.players.forEach((playerName) => {
        const stats = selectedTeam.lockedPlayers[playerName] || { runs: 0, wickets: 0, bonus: 0 };
        const row = document.createElement("div");
        row.className = "admin-player-row";
        row.dataset.playerName = playerName;
        row.innerHTML = `
          <div class="admin-player-name">${playerName}</div>
          <div class="field"><label>Runs</label><input type="number" class="admin-playoff-runs" value="${Number(stats.runs) || 0}" min="0" step="1" /></div>
          <div class="field"><label>Wkts</label><input type="number" class="admin-playoff-wickets" value="${Number(stats.wickets) || 0}" min="0" step="1" /></div>
          <div class="field"><label>Bonus</label><input type="number" class="admin-playoff-bonus" value="${Number(stats.bonus) || 0}" min="0" step="1" /></div>
        `;
        container.appendChild(row);
      });
      return;
    }

    selectedTeam.players.forEach((playerName) => {
      const stats = window.playerStats[playerName] || { runs: 0, wickets: 0, bonus: 0 };
      const row = document.createElement("div");
      row.className = "admin-player-row";
      row.dataset.playerName = playerName;
      row.innerHTML = `
        <div class="admin-player-name">${playerName}</div>
        <div class="field"><label>Runs</label><input type="number" class="admin-input-runs" value="${stats.runs}" min="0" step="1" /></div>
        <div class="field"><label>Wkts</label><input type="number" class="admin-input-wickets" value="${stats.wickets}" min="0" step="1" /></div>
        <div class="field"><label>Bonus</label><input type="number" class="admin-input-bonus" value="${stats.bonus}" min="0" step="1" /></div>
      `;
      row.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          const runs = Number(row.querySelector(".admin-input-runs")?.value) || 0;
          const wickets = Number(row.querySelector(".admin-input-wickets")?.value) || 0;
          const bonus = Number(row.querySelector(".admin-input-bonus")?.value) || 0;
          const image = window.playerStats[playerName]?.image || "";
          window.playerStats[playerName] = { runs, wickets, bonus, image };
          window.refreshStatsDisplays();
        });
      });
      container.appendChild(row);
    });
  }

  function openAdminEditModal() {
    if (!window.appState.isAdmin) return;
    renderAdminEditList();
    const modal = document.getElementById("adminEditModal");
    if (modal) modal.classList.add("show");
  }

  function closeAdminEditModal() {
    const modal = document.getElementById("adminEditModal");
    if (modal) modal.classList.remove("show");
  }

  function saveAdminPlayerStats() {
    const container = document.getElementById("adminEditList");
    if (!container) return;
    const selectedTeam = window.enrichedTeams.find((t) => t.id === Number(selectedAdminTeamId));

    if (window.isLocked) {
      if (!selectedTeam) return;
      if (!selectedTeam.lockedPlayers || typeof selectedTeam.lockedPlayers !== "object") {
        selectedTeam.lockedPlayers = {};
      }
      container.querySelectorAll(".admin-player-row").forEach((row) => {
        const playerName = row.dataset.playerName;
        if (!playerName) return;
        selectedTeam.lockedPlayers[playerName] = {
          runs: Number(row.querySelector(".admin-playoff-runs")?.value) || 0,
          wickets: Number(row.querySelector(".admin-playoff-wickets")?.value) || 0,
          bonus: Number(row.querySelector(".admin-playoff-bonus")?.value) || 0
        };
      });
      if (window.persistTeams) window.persistTeams();
      if (window.renderTeamList) window.renderTeamList();
      if (window.renderLeaderboard) window.renderLeaderboard();
      window.refreshStatsDisplays();
      closeAdminEditModal();
      return;
    }

    container.querySelectorAll(".admin-player-row").forEach((row) => {
      const name = row.dataset.playerName;
      if (!name) return;
      const runs = Number(row.querySelector(".admin-input-runs")?.value) || 0;
      const wickets = Number(row.querySelector(".admin-input-wickets")?.value) || 0;
      const bonus = Number(row.querySelector(".admin-input-bonus")?.value) || 0;
      const image = window.playerStats[name]?.image || "";
      window.playerStats[name] = { runs, wickets, bonus, image };
    });
    if (window.persistPlayerStats) window.persistPlayerStats();
    if (window.renderTeamList) window.renderTeamList();
    if (window.renderLeaderboard) window.renderLeaderboard();
    window.refreshStatsDisplays();
    closeAdminEditModal();
  }

  function lockLeague() {
    if (window.isLocked) {
      alert("League is already locked.");
      return;
    }
    (window.enrichedTeams || []).forEach((team) => {
      if (!team.lockedPlayers || typeof team.lockedPlayers !== "object") {
        const lockedPlayers = {};
        (team.players || []).forEach((player) => {
          const playerName = typeof player === "string" ? player : player?.name;
          if (!playerName) return;
          const stats = window.playerStats[playerName] || { runs: 0, wickets: 0, bonus: 0 };
          lockedPlayers[playerName] = {
            runs: Number(stats.runs) || 0,
            wickets: Number(stats.wickets) || 0,
            bonus: Number(stats.bonus) || 0
          };
        });
        team.lockedPlayers = lockedPlayers;
      }
    });
    if (window.persistTeams) window.persistTeams();
    if (typeof window.setLockedState === "function") {
      window.setLockedState(true);
    }
    if (typeof window.saveDataToFirebase === "function") {
      window.saveDataToFirebase();
    }
    alert("League Locked. Playoff mode enabled.");
    location.reload();
  }

  function unlockLeague() {
    if (!window.appState.isAdmin) return;
    const shouldUnlock = confirm("Unlock league and return to normal mode?");
    if (!shouldUnlock) return;
    if (typeof window.setLockedState === "function") {
      window.setLockedState(false);
    }
    (window.enrichedTeams || []).forEach((team) => {
      if (!team || typeof team !== "object") return;
      delete team.lockedScore;
      delete team.playoffStats;
      delete team.lockedPlayers;
    });
    if (typeof window.saveDataToFirebase === "function") {
      window.saveDataToFirebase();
    }
    alert("League unlocked. Back to normal mode.");
    location.reload();
  }

  function bindAdminEvents() {
    const adminModal = document.getElementById("adminModal");
    const adminStatus = document.getElementById("adminStatusMsg");
    const usernameInput = document.getElementById("adminUsername");
    const passwordInput = document.getElementById("adminPassword");
    const lockLeagueBtn = document.getElementById("lockLeagueBtn");
    const unlockLeagueBtn = document.getElementById("unlockLeagueBtn");

    function resetAdminModal() {
      adminStatus.textContent = "";
      adminStatus.className = "status-msg";
      usernameInput.value = "";
      passwordInput.value = "";
      updateAdminUI();
      if (lockLeagueBtn) lockLeagueBtn.textContent = window.isLocked ? "League Locked" : "Lock League";
    }
    function openAdminModal() {
      resetAdminModal();
      adminModal.classList.add("show");
    }
    function closeAdminModal() {
      adminModal.classList.remove("show");
    }
    function checkAdminCredentials() {
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      if (username === "jainjinay11" && password === "Jinay2421!") {
        window.appState.isAdmin = true;
        localStorage.setItem("isAdmin", "true");
        adminStatus.textContent = "Login successful.";
        adminStatus.className = "status-msg success";
        updateAdminToolbar();
        updateAdminUI();
        if (lockLeagueBtn) lockLeagueBtn.textContent = window.isLocked ? "League Locked" : "Lock League";
        alert("Admin login successful.");
        setTimeout(closeAdminModal, 450);
      } else {
        window.appState.isAdmin = false;
        localStorage.removeItem("isAdmin");
        updateAdminToolbar();
        updateAdminUI();
        adminStatus.textContent = "Invalid username or password.";
        adminStatus.className = "status-msg error";
      }
    }

    document.getElementById("closeAdminModalBtn").addEventListener("click", closeAdminModal);
    document.getElementById("submitAdminLoginBtn").addEventListener("click", checkAdminCredentials);
    const editPlayerPointsBtn = document.getElementById("editPlayerPointsBtn");
    if (editPlayerPointsBtn) editPlayerPointsBtn.addEventListener("click", openAdminEditModal);
    const adminEditModal = document.getElementById("adminEditModal");
    const playerEditorModal = document.getElementById("playerEditor");
    const closeAdminEditBtn = document.getElementById("closeAdminEditBtn");
    const savePlayerStatsBtn = document.getElementById("savePlayerStatsBtn");
    const closePlayerEditorBtn = document.getElementById("closePlayerEditorBtn");
    const closePlayerEditorActionBtn = document.getElementById("closePlayerEditorActionBtn");
    const savePlayerScoresBtn = document.getElementById("savePlayerScoresBtn");
    if (closeAdminEditBtn) closeAdminEditBtn.addEventListener("click", closeAdminEditModal);
    if (savePlayerStatsBtn) savePlayerStatsBtn.addEventListener("click", saveAdminPlayerStats);
    if (closePlayerEditorBtn) closePlayerEditorBtn.addEventListener("click", closePlayerEditor);
    if (closePlayerEditorActionBtn) closePlayerEditorActionBtn.addEventListener("click", closePlayerEditor);
    if (savePlayerScoresBtn) savePlayerScoresBtn.addEventListener("click", savePlayerScores);
    if (adminEditModal) adminEditModal.addEventListener("click", (event) => { if (event.target === adminEditModal) closeAdminEditModal(); });
    if (playerEditorModal) playerEditorModal.addEventListener("click", (event) => { if (event.target === playerEditorModal) closePlayerEditor(); });
    adminModal.addEventListener("click", (event) => { if (event.target === adminModal) closeAdminModal(); });
    [usernameInput, passwordInput].forEach((input) => input.addEventListener("keydown", (event) => { if (event.key === "Enter") checkAdminCredentials(); }));
    updateAdminUI();
    updateAdminToolbar();
  }

  window.updateAdminToolbar = updateAdminToolbar;
  window.openPlayerEditor = openPlayerEditor;
  window.renderPlayerEditorList = renderPlayerEditorList;
  window.closePlayerEditor = closePlayerEditor;
  window.savePlayerScores = savePlayerScores;
  window.lockLeague = lockLeague;
  window.unlockLeague = unlockLeague;
  window.toggleLeagueLock = toggleLeagueLock;
  window.loginAdmin = loginAdmin;
  window.logoutAdmin = logoutAdmin;
  window.updateAdminUI = updateAdminUI;
  window.updateAdminButtons = updateAdminButtons;
  window.filterPlayers = filterPlayers;
  window.bindAdminEvents = bindAdminEvents;
})();
