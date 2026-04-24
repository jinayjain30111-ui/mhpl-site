(function () {
  function renderLeaderboard() {
    const board = document.getElementById("leaderboardList");
    if (!board) return;
    board.innerHTML = "";

    const header = document.createElement("div");
    header.className = "leaderboard-row header";
    header.innerHTML = `<div class="cell">Rank</div><div class="cell name">Team Name</div><div class="cell">Total Points</div>`;
    board.appendChild(header);

    const ranked = [...window.enrichedTeams]
      .map((team) => ({ name: team.name, points: window.getTeamTotal(team) }))
      .sort((a, b) => b.points - a.points);

    ranked.forEach((team, index) => {
      const row = document.createElement("div");
      const rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === ranked.length - 1 ? "rank-last" : "";
      row.className = `leaderboard-row ${rankClass}`.trim();
      row.innerHTML = `<div class="cell"><span class="rank-badge">${index + 1}</span></div><div class="cell name">${team.name}</div><div class="cell">${team.points}</div>`;
      board.appendChild(row);
    });
  }

  window.renderLeaderboard = renderLeaderboard;
})();
