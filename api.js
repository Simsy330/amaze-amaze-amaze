const API_KEY = "b881fab751be43f8aff7bd21a44aef2d";

async function fetchMatches() {
  try {
    console.log("Fetching matches from API...");
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/PL/matches",
      {
        headers: { "X-Auth-Token": API_KEY }
      }
    );

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    console.log("Matches fetched:", data);
    return data.matches || [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

async function loadTeams() {
  const matches = await fetchMatches();

  const teams = new Set();

  matches.forEach(m => {
    teams.add(m.homeTeam.name);
    teams.add(m.awayTeam.name);
  });

  console.log([...teams]);
}

async function populateTeams() {
  let matches = await fetchMatches();

  // Fallback test data if API fails
  if (!matches || matches.length === 0) {
    console.warn("Using fallback test data");
    matches = [
      { homeTeam: { name: "Arsenal" }, awayTeam: { name: "Chelsea" }, score: { fullTime: { home: 2, away: 1 } } },
      { homeTeam: { name: "Manchester United" }, awayTeam: { name: "Liverpool" }, score: { fullTime: { home: 1, away: 2 } } },
      { homeTeam: { name: "Manchester City" }, awayTeam: { name: "Tottenham" }, score: { fullTime: { home: 3, away: 0 } } },
      { homeTeam: { name: "Brighton" }, awayTeam: { name: "Newcastle" }, score: { fullTime: { home: 1, away: 1 } } },
    ];
  }

  const teams = new Set();

  matches.forEach(m => {
    if (m.homeTeam && m.homeTeam.name) teams.add(m.homeTeam.name);
    if (m.awayTeam && m.awayTeam.name) teams.add(m.awayTeam.name);
  });

  const teamList = [...teams].sort();
  console.log(`Loaded ${teamList.length} teams:`, teamList);

  const selectA = document.getElementById("teamA");
  const selectB = document.getElementById("teamB");

  if (!selectA || !selectB) {
    console.error("Team select elements not found in DOM");
    return;
  }

  teamList.forEach(team => {
    const optionA = document.createElement("option");
    optionA.value = team;
    optionA.textContent = team;
    selectA.appendChild(optionA);

    const optionB = document.createElement("option");
    optionB.value = team;
    optionB.textContent = team;
    selectB.appendChild(optionB);
  });

  console.log("Teams loaded successfully!");
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, populating teams...");
  populateTeams().catch(err => console.error("Failed to populate teams:", err));
});


function getTeamStats(matches, teamName) {
  let gf = 0;
  let ga = 0;
  let games = 0;

  matches.forEach(m => {
    // Skip if no score data
    if (!m.score || m.score.fullTime === null || m.score.fullTime === undefined) return;

    if (m.homeTeam && m.homeTeam.name === teamName) {
      gf += m.score.fullTime.home || 0;
      ga += m.score.fullTime.away || 0;
      games++;
    }

    if (m.awayTeam && m.awayTeam.name === teamName) {
      gf += m.score.fullTime.away || 0;
      ga += m.score.fullTime.home || 0;
      games++;
    }
  });

  // Return defaults if no games found
  if (games === 0) {
    console.warn(`No matches found for ${teamName}`);
    return {
      attack: 1.5,
      defense: 1.5
    };
  }

  const attack = gf / games;
  const defense = ga / games;
  
  console.log(`${teamName} - Games: ${games}, GF: ${gf}, GA: ${ga}, Attack: ${attack.toFixed(2)}, Defense: ${defense.toFixed(2)}`);

  return {
    attack: attack,
    defense: defense
  };
}


async function simulateFromAPI() {
  console.log("Simulating match...");

  const matches = await fetchMatches();
  console.log(`Fetched ${matches.length} matches`);

  const teamA = document.getElementById("teamA").value;
  const teamB = document.getElementById("teamB").value;
  
  if (!teamA || !teamB) {
    console.error("Please select both teams");
    return;
  }

  console.log(`Simulating: ${teamA} vs ${teamB}`);

  const statsA = getTeamStats(matches, teamA);
  const statsB = getTeamStats(matches, teamB);

  const leagueAvg = 2.6;

  const lambdaA = statsA.attack * statsB.defense / leagueAvg;
  const lambdaB = statsB.attack * statsA.defense / leagueAvg;

  console.log(`Lambda values - ${teamA}: ${lambdaA.toFixed(2)}, ${teamB}: ${lambdaB.toFixed(2)}`);

  runSimulation(lambdaA, lambdaB);
}








