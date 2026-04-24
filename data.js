(function () {
  let isLocked = localStorage.getItem("isLocked") === "true";
  const appState = {
    currentView: "homeView",
    previousView: "homeView",
    selectedTeamId: null,
    viewHistory: ["homeView"],
    isAdmin: localStorage.getItem("isAdmin") === "true"
  };

  const teamSeedRosters = [
    { name: "BISTA DYNASTY", players: [{name:"SHUBMAN GILL", runs:265, wkts:0, bonus:75},{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"ABHISHEK SHARMA", runs:323, wkts:0, bonus:100},{name:"ROHIT SHARMA", runs:137, wkts:0, bonus:0},{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"YASHASVI JAISWAL", runs:245, wkts:0, bonus:50},{name:"SHREYAS IYER", runs:208, wkts:0, bonus:75},{name:"ISHAN KISHAN", runs:238, wkts:0, bonus:50},{name:"AXAR PATEL", runs:31, wkts:150, bonus:0},{name:"JASON HOLDER", runs:0, wkts:0, bonus:0},{name:"PRASHANT VEER", runs:49, wkts:0, bonus:0},{name:"SHIVAM DUBE", runs:123, wkts:0, bonus:0},{name:"VARUN CHAKRAVARTY", runs:0, wkts:75, bonus:0},{name:"TRENT BOULT", runs:1, wkts:25, bonus:0},{name:"RASHID KHAN", runs:24, wkts:150, bonus:0}] },
    { name: "DARK KNIGHTS", players: [{name:"HARDIK PANDYA", runs:96, wkts:75, bonus:0},{name:"ABHISHEK SHARMA", runs:323, wkts:0, bonus:100},{name:"KL RAHUL", runs:215, wkts:0, bonus:50},{name:"ROHIT SHARMA", runs:137, wkts:0, bonus:25},{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"SURYAKUMAR YADAV", runs:121, wkts:0, bonus:25},{name:"VAIBHAV SURYAVANSHI", runs:245, wkts:0, bonus:50},{name:"JOS BUTTLER", runs:206, wkts:0, bonus:50},{name:"AXAR PATEL", runs:31, wkts:150, bonus:0},{name:"RAVINDRA JADEJA", runs:128, wkts:150, bonus:0},{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"MITCHELL STARC", runs:0, wkts:0, bonus:0},{name:"ARSHDEEP SINGH", runs:0, wkts:150, bonus:0},{name:"RASHID KHAN", runs:28, wkts:150, bonus:0},{name:"PAT CUMMINS", runs:0, wkts:0, bonus:0}] },
    { name: "VYOM’S 15 DHURANDHAR", players: [{name:"SHUBMAN GILL", runs:265, wkts:0, bonus:75},{name:"HARDIK PANDYA", runs:96, wkts:75, bonus:0},{name:"HEINRICH KLASSEN", runs:320, wkts:0, bonus:75},{name:"SANJU SAMSON", runs:192, wkts:0, bonus:50},{name:"KL RAHUL", runs:215, wkts:0, bonus:50},{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"TRAVIS HEAD", runs:180, wkts:0, bonus:0},{name:"VAIBHAV SURYAVANSHI", runs:254, wkts:0, bonus:50},{name:"SHREYAS IYER", runs:208, wkts:0, bonus:75},{name:"MITCHELL MARSH", runs:210, wkts:0, bonus:25},{name:"ABHISHEK SHARMA", runs:323, wkts:0, bonus:100},{name:"SUNIL NARINE", runs:36, wkts:150, bonus:0},{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"ARSHDEEP SINGH", runs:0, wkts:150, bonus:0},{name:"MOHAMMED SIRAJ", runs:0, wkts:150, bonus:0}] },
    { name: "RAAHI STRIKERS", players: [{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"SHUBMAN GILL", runs:265, wkts:0, bonus:75},{name:"SANJU SAMSON", runs:192, wkts:0, bonus:50},{name:"HARDIK PANDYA", runs:96, wkts:75, bonus:0},{name:"SURYAKUMAR YADAV", runs:121, wkts:0, bonus:25},{name:"YASHASVI JAISWAL", runs:245, wkts:0, bonus:50},{name:"VAIBHAV SURYAVANSHI", runs:254, wkts:0, bonus:50},{name:"RUTURAJ GAIKWAD", runs:82, wkts:0, bonus:0},{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"ARSHDEEP SINGH", runs:0, wkts:150, bonus:0},{name:"TRENT BOULT", runs:1, wkts:25, bonus:0},{name:"MOHAMMED SIRAJ", runs:0, wkts:150, bonus:0},{name:"KAGISO RABADA", runs:35, wkts:250, bonus:0},{name:"QDK", runs:125, wkts:0, bonus:50},{name:"MITCHELL MARSH", runs:210, wkts:0, bonus:25}] },
    { name: "LAVISH LEGENDS", players: [{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"SANJU SAMSON", runs:192, wkts:0, bonus:50},{name:"PRASIDH KRISHNA", runs:0, wkts:300, bonus:50},{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"KRUNAL PANDYA", runs:13, wkts:200, bonus:0},{name:"VAIBHAV SURYAVANSHI", runs:254, wkts:0, bonus:50},{name:"SHREYAS IYER", runs:208, wkts:0, bonus:75},{name:"RACHIN RAVINDRA", runs:0, wkts:0, bonus:0},{name:"TRENT BOULT", runs:0, wkts:0, bonus:0},{name:"VARUN CHAKRAVARTHY", runs:0, wkts:125, bonus:0},{name:"ARSHDEEP SINGH", runs:0, wkts:150, bonus:0},{name:"JOSH HAZLEWOOD", runs:0, wkts:75, bonus:0},{name:"TRAVIS HEAD", runs:180, wkts:0, bonus:0},{name:"AXAR PATEL", runs:31, wkts:150, bonus:0},{name:"NICHOLAS POORAN", runs:72, wkts:0, bonus:0}] },
    { name: "FENDERLINE WARRIORS", players: [{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"SHUBMAN GILL", runs:265, wkts:0, bonus:75},{name:"JOS BUTTLER", runs:206, wkts:0, bonus:50},{name:"SANJU SAMSON", runs:192, wkts:0, bonus:50},{name:"KL RAHUL", runs:215, wkts:0, bonus:50},{name:"SURYAKUMAR YADAV", runs:121, wkts:0, bonus:25},{name:"AIDEN MARKRAM", runs:162, wkts:0, bonus:0},{name:"YASHASVI JAISWAL", runs:245, wkts:0, bonus:50},{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"SUNIL NARINE", runs:36, wkts:150, bonus:0},{name:"MOHAMMED SIRAJ", runs:0, wkts:150, bonus:0},{name:"YUZVENDRA CHAHAL", runs:0, wkts:100, bonus:0},{name:"SAI SUDARSHAN", runs:135, wkts:0, bonus:25},{name:"ABHISHEK SHARMA", runs:323, wkts:0, bonus:100},{name:"PRIYANSH ARYA", runs:211, wkts:0, bonus:50}] },
    { name: "PHOENIX XI", players: [{name:"VIRAT KOHLI", runs:247, wkts:0, bonus:50},{name:"SANJU SAMSON", runs:192, wkts:0, bonus:50},{name:"HARDIK PANDYA", runs:96, wkts:75, bonus:0},{name:"AXAR PATEL", runs:31, wkts:150, bonus:0},{name:"MITCHELL MARSH", runs:210, wkts:0, bonus:25},{name:"RUTURAJ GAIKWAD", runs:82, wkts:0, bonus:0},{name:"YASHASVI JAISWAL", runs:245, wkts:0, bonus:50},{name:"SURYAKUMAR YADAV", runs:121, wkts:0, bonus:25},{name:"PRIYANSH ARYA", runs:211, wkts:0, bonus:50},{name:"SHUBMAN GILL", runs:265, wkts:0, bonus:75},{name:"NOOR AHMED", runs:1, wkts:100, bonus:0},{name:"YUZVENDRA CHAHAL", runs:0, wkts:100, bonus:0},{name:"SUNIL NARINE", runs:12, wkts:125, bonus:0},{name:"TRENT BOULT", runs:1, wkts:25, bonus:0},{name:"KL RAHUL", runs:215, wkts:0, bonus:50}] },
    { name: "PALTAN XI", players: [{name:"JASPRIT BUMRAH", runs:5, wkts:25, bonus:0},{name:"ABHISHEK SHARMA", runs:323, wkts:0, bonus:100},{name:"SANJU SAMSON", runs:192, wkts:0, bonus:50},{name:"JOS BUTTLER", runs:206, wkts:0, bonus:50},{name:"NICOLAS POORAN", runs:72, wkts:0, bonus:0},{name:"SHUBMAN GILL", runs:265, wkts:0, bonus:75},{name:"GLENN PHILLIPS", runs:67, wkts:0, bonus:0},{name:"SURYAKUMAR YADAV", runs:121, wkts:0, bonus:25},{name:"VAIBHAV SURYAVANSHI", runs:254, wkts:0, bonus:50},{name:"SAI SUDARSHAN", runs:135, wkts:0, bonus:25},{name:"HARDIK PANDYA", runs:96, wkts:75, bonus:0},{name:"RAVINDRA JADEJA", runs:128, wkts:150, bonus:0},{name:"RASHID KHAN", runs:28, wkts:150, bonus:0},{name:"JOFRA ARCHER", runs:36, wkts:250, bonus:0},{name:"PAT CUMMINS", runs:0, wkts:0, bonus:0}] }
  ];

  let playerStats = {};
  teamSeedRosters.forEach((team) => {
    team.players.forEach((p) => {
      const prev = playerStats[p.name];
      const wickets = Number(p.wickets ?? p.wkts) || 0;
      if (!prev) {
        playerStats[p.name] = { runs: Number(p.runs) || 0, wickets, bonus: Number(p.bonus) || 0 };
      } else {
        playerStats[p.name] = {
          runs: Math.max(Number(prev.runs) || 0, Number(p.runs) || 0),
          wickets: Math.max(Number(prev.wickets) || 0, wickets),
          bonus: Math.max(Number(prev.bonus) || 0, Number(p.bonus) || 0)
        };
      }
    });
  });

  const playerImageMap = {
    "VIRAT KOHLI": "images/VIRAT.jpg",
    "SANJU SAMSON": "images/SANJU.jpg",
    "JASPRIT BUMRAH": "images/JASPRIT.jpg",
    "SHUBMAN GILL": "images/SHUBMAN.jpg",
    "ABHISHEK SHARMA": "images/ABHISHEK.jpg",
    "HARDIK PANDYA": "images/HARDIK.jpg"
  };
  Object.keys(playerImageMap).forEach((name) => {
    if (!playerStats[name]) playerStats[name] = { runs: 0, wickets: 0, bonus: 0 };
    playerStats[name].image = playerImageMap[name];
  });

  function loadPlayerStatsFromStorage() {
    try {
      const raw = localStorage.getItem("playerStats");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      Object.keys(parsed).forEach((name) => {
        const entry = parsed[name];
        if (entry && typeof entry === "object") {
          playerStats[name] = {
            runs: Number(entry.runs) || 0,
            wickets: Number(entry.wickets ?? entry.wkts) || 0,
            bonus: Number(entry.bonus) || 0,
            image: (typeof entry.image === "string" && entry.image.trim()) || playerImageMap[name] || playerStats[name]?.image || ""
          };
        }
      });
    } catch (e) {}
  }
  loadPlayerStatsFromStorage();

  const teams = teamSeedRosters.map((t) => ({
    name: t.name,
    players: t.players.map((p) => p.name),
    captain: t.players[0]?.name || "",
    viceCaptain: t.players[1]?.name || "",
    lockedPlayers: null
  }));

  function loadTeamsFromStorage() {
    try {
      const raw = localStorage.getItem("teams");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const lockedDataByName = {};
      parsed.forEach((team) => {
        if (!team || typeof team !== "object" || !team.name) return;
        lockedDataByName[team.name] = team.lockedPlayers && typeof team.lockedPlayers === "object" ? team.lockedPlayers : null;
      });
      teams.forEach((team) => {
        const stored = lockedDataByName[team.name];
        if (!stored) return;
        const normalized = {};
        team.players.forEach((playerName) => {
          const entry = stored[playerName] || {};
          normalized[playerName] = {
            runs: Number(entry.runs) || 0,
            wickets: Number(entry.wickets ?? entry.wkts) || 0,
            bonus: Number(entry.bonus) || 0
          };
        });
        team.lockedPlayers = normalized;
      });
    } catch (e) {}
  }
  loadTeamsFromStorage();

  const teamLogos = {
    "PHOENIX XI": "images/phoenix.jpeg",
    "BISTA DYNASTY": "images/bista.jpeg",
    "VYOM’S 15 DHURANDHAR": "images/vyom.jpeg",
    "PALTAN XI": "images/paltan.jpeg",
    "RAAHI STRIKERS": "images/raahi.jpeg",
    "FENDERLINE WARRIORS": "images/fenderline.jpeg",
    "LAVISH LEGENDS": "images/lavish.jpeg",
    "DARK KNIGHTS": "images/darkknights.jpeg"
  };
  const enrichedTeams = teams.map((team, index) => ({
    ...team,
    id: index + 1,
    logo: teamLogos[team.name] || "images/phoenix.jpeg"
  }));

  function getPlayerPoints(playerName, index) {
    const stats = playerStats[playerName] || { runs: 0, wickets: 0, bonus: 0 };
    const base = (Number(stats.runs) || 0) + (Number(stats.wickets) || 0) + (Number(stats.bonus) || 0);
    if (index === 0) return base * 2;
    if (index === 1) return base * 1.5;
    return base;
  }
  function calculateTeamScore(team) {
    return team.players.reduce((sum, playerName, index) => sum + getPlayerPoints(playerName, index), 0);
  }
  function getTeamTotal(team) {
    if (isLocked) {
      const lockedPlayers = team.lockedPlayers && typeof team.lockedPlayers === "object" ? team.lockedPlayers : {};
      return team.players.reduce((sum, playerName) => {
        const stats = lockedPlayers[playerName] || { runs: 0, wickets: 0, bonus: 0 };
        const total = (Number(stats.runs) || 0) + (Number(stats.wickets) || 0) + (Number(stats.bonus) || 0);
        return sum + total;
      }, 0);
    }
    return calculateTeamScore(team);
  }
  function persistPlayerStats() {
    if (typeof window.saveDataToFirebase === "function") {
      window.saveDataToFirebase();
    }
  }
  function persistTeams() {
    if (typeof window.saveDataToFirebase === "function") {
      window.saveDataToFirebase();
    }
  }

  function setLockedState(value) {
    isLocked = !!value;
    window.isLocked = isLocked;
    localStorage.setItem("isLocked", String(isLocked));
  }

  function applyFirebaseData(data) {
    if (!data || typeof data !== "object") return;

    if (data.playerStats && typeof data.playerStats === "object") {
      Object.keys(playerStats).forEach((name) => delete playerStats[name]);
      Object.keys(data.playerStats).forEach((name) => {
        const entry = data.playerStats[name] || {};
        playerStats[name] = {
          runs: Number(entry.runs) || 0,
          wickets: Number(entry.wickets ?? entry.wkts) || 0,
          bonus: Number(entry.bonus) || 0,
          image: (typeof entry.image === "string" && entry.image) || playerImageMap[name] || ""
        };
      });
    }

    if (Array.isArray(data.teams)) {
      const byName = {};
      data.teams.forEach((team) => {
        if (team && typeof team === "object" && team.name) byName[team.name] = team;
      });
      enrichedTeams.forEach((team) => {
        const incoming = byName[team.name];
        if (!incoming) return;
        if (incoming.lockedPlayers && typeof incoming.lockedPlayers === "object") {
          team.lockedPlayers = {};
          team.players.forEach((playerName) => {
            const entry = incoming.lockedPlayers[playerName] || {};
            team.lockedPlayers[playerName] = {
              runs: Number(entry.runs) || 0,
              wickets: Number(entry.wickets ?? entry.wkts) || 0,
              bonus: Number(entry.bonus) || 0
            };
          });
        }
      });
    }

    if (typeof data.isLocked === "boolean") {
      setLockedState(data.isLocked);
    }
  }

  window.appState = appState;
  window.playerStats = playerStats;
  window.teams = teams;
  window.enrichedTeams = enrichedTeams;
  window.getPlayerPoints = getPlayerPoints;
  window.calculateTeamScore = calculateTeamScore;
  window.getTeamTotal = getTeamTotal;
  window.persistPlayerStats = persistPlayerStats;
  window.persistTeams = persistTeams;
  window.setLockedState = setLockedState;
  window.applyFirebaseData = applyFirebaseData;
  window.isLocked = isLocked;
})();
