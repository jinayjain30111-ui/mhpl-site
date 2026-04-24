(function () {
  function showView(viewId, options = {}) {
    const { skipHistory = false } = options;
    const views = document.querySelectorAll(".view");
    views.forEach((view) => view.classList.remove("active"));
    document.getElementById(viewId).classList.add("active");
    if (!skipHistory && window.appState.currentView && window.appState.currentView !== viewId) {
      window.appState.viewHistory.push(viewId);
    }
    window.appState.currentView = viewId;
    const ticker = document.getElementById("partner-ticker");
    if (ticker) ticker.style.display = viewId === "homeView" ? "block" : "none";
  }

  function goBack() {
    if (window.appState.viewHistory.length <= 1) {
      showView("homeView");
      return;
    }
    window.appState.viewHistory.pop();
    const previous = window.appState.viewHistory[window.appState.viewHistory.length - 1] || "homeView";
    showView(previous, { skipHistory: true });
  }

  function runIntro() {
    const intro = document.getElementById("intro");
    const header = document.getElementById("siteHeader");
    setTimeout(() => { header.classList.add("visible"); }, 1950);
    setTimeout(() => { intro.classList.add("hide"); }, 2250);
  }

  function setupCoreEvents() {
    document.getElementById("openTeamsBtn").addEventListener("click", () => {
      window.appState.previousView = "homeView";
      window.renderTeamList();
      showView("teamListView");
    });
    document.getElementById("openLeaderboardBtn").addEventListener("click", () => {
      window.appState.previousView = "homeView";
      window.renderLeaderboard();
      showView("leaderboardView");
    });
    const allTeamsBtn = document.getElementById("openAllTeamsBtn");
    if (allTeamsBtn) {
      allTeamsBtn.addEventListener("click", openAllTeams);
    }
    document.getElementById("backFromTeamsBtn").addEventListener("click", goBack);
    document.getElementById("backFromLeaderboardBtn").addEventListener("click", goBack);
    document.getElementById("backFromDetailBtn").addEventListener("click", goBack);
    document.getElementById("backFromOwnersBtn").addEventListener("click", goBack);
  }

  function init() {
    setupCoreEvents();
    window.bindOwnersEvents();
    window.bindAdminEvents();
    showView("homeView");
    window.appState.viewHistory = ["homeView"];
    runIntro();
  }

  function openAllTeams() {
    showView("allTeamsView");
  }

  function goHome() {
    showView("homeView");
  }

  function renderAll() {
    if (window.renderTeamList) window.renderTeamList();
    if (window.renderLeaderboard) window.renderLeaderboard();
    if (window.refreshStatsDisplays) window.refreshStatsDisplays();
    const playerEditor = document.getElementById("playerEditor");
    if (playerEditor && playerEditor.classList.contains("show") && window.renderPlayerEditorList) {
      window.renderPlayerEditorList();
    }
    if (window.updateAdminToolbar) window.updateAdminToolbar();
    if (window.updateAdminButtons) window.updateAdminButtons();
  }

  window.showView = showView;
  window.goBack = goBack;
  window.openAllTeams = openAllTeams;
  window.goHome = goHome;
  window.renderAll = renderAll;
  window.addEventListener("DOMContentLoaded", init);
})();
