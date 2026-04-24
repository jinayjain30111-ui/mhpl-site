(function () {
  function renderTeamList() {
    const grid = document.getElementById("teamGrid");
    if (!grid) return;
    grid.innerHTML = "";
    window.enrichedTeams.forEach((team) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "team-card";
      card.innerHTML = `<img class="team-logo" src="${team.logo}" alt="${team.name} logo" /><span class="team-name">${team.name}</span>`;
      const image = card.querySelector(".team-logo");
      image.addEventListener("error", () => { image.style.opacity = "0.18"; });
      card.addEventListener("click", () => openTeamDetail(team.id));
      grid.appendChild(card);
    });
  }

  function openTeamDetail(teamId, options = {}) {
    const { skipViewChange = false } = options;
    window.appState.selectedTeamId = teamId;
    const team = window.enrichedTeams.find((item) => item.id === teamId);
    if (!team) return;

    const teamHero = document.getElementById("teamHero");
    const captainSection = document.getElementById("captainSection");
    const list = document.getElementById("playersList");
    const totalBox = document.getElementById("teamTotalBox");
    const captainName = team.captain || team.players[0];
    const viceCaptainName = team.viceCaptain || team.players[1];
    const captainImage = window.playerStats[captainName]?.image || "";
    const viceCaptainImage = window.playerStats[viceCaptainName]?.image || "";

    teamHero.innerHTML = `<img class="hero-logo" src="${team.logo}" alt="${team.name} logo" /><div class="hero-name">${team.name}</div>`;
    const heroImage = teamHero.querySelector(".hero-logo");
    heroImage.addEventListener("error", () => { heroImage.style.opacity = "0.2"; });

    captainSection.innerHTML = `
      <div class="captain-card">
        <div class="captain-role">Captain</div>
        <img class="cap-image" src="${captainImage}" alt="${captainName}" />
        <div class="captain-image-fallback">${captainName}</div>
        <div class="captain-player-name">${captainName}</div>
      </div>
      <div class="captain-card">
        <div class="captain-role">Vice Captain</div>
        <img class="cap-image" src="${viceCaptainImage}" alt="${viceCaptainName}" />
        <div class="captain-image-fallback">${viceCaptainName}</div>
        <div class="captain-player-name">${viceCaptainName}</div>
      </div>
    `;
    captainSection.querySelectorAll(".cap-image").forEach((img) => {
      const fallback = img.nextElementSibling;
      if (!img.getAttribute("src")) {
        img.style.display = "none";
        if (fallback) fallback.style.display = "flex";
        return;
      }
      img.addEventListener("error", () => {
        img.style.display = "none";
        if (fallback) fallback.style.display = "flex";
      });
    });

    list.innerHTML = "";
    const headerRow = document.createElement("div");
    headerRow.className = "player-row header";
    headerRow.innerHTML = `<div class="cell name">Player Name</div><div class="cell">Runs</div><div class="cell">Wickets</div><div class="cell">Bonus</div><div class="cell">Total</div>`;
    list.appendChild(headerRow);

    team.players.forEach((playerName, index) => {
      const stats = window.isLocked
        ? (team.lockedPlayers?.[playerName] || { runs: 0, wickets: 0, bonus: 0 })
        : (window.playerStats[playerName] || { runs: 0, wickets: 0, bonus: 0 });
      const points = window.isLocked
        ? ((Number(stats.runs) || 0) + (Number(stats.wickets) || 0) + (Number(stats.bonus) || 0))
        : window.getPlayerPoints(playerName, index);
      const pointsText = Number.isInteger(points) ? points : points.toFixed(1);
      const row = document.createElement("div");
      row.className = "player-row";
      row.innerHTML = `<div class="cell name">${playerName}</div><div class="cell">${stats.runs}</div><div class="cell">${stats.wickets ?? 0}</div><div class="cell">${stats.bonus}</div><div class="cell">${pointsText}</div>`;
      list.appendChild(row);
    });

    totalBox.textContent = `FINAL TEAM POINTS: ${window.getTeamTotal(team)}`;
    if (!skipViewChange) window.showView("teamDetailView");
  }

  function refreshStatsDisplays() {
    if (window.appState.currentView === "teamDetailView" && window.appState.selectedTeamId != null) {
      openTeamDetail(window.appState.selectedTeamId, { skipViewChange: true });
    }
    if (window.appState.currentView === "leaderboardView") {
      window.renderLeaderboard();
    }
  }

  window.renderTeamList = renderTeamList;
  window.openTeamDetail = openTeamDetail;
  window.refreshStatsDisplays = refreshStatsDisplays;
})();
