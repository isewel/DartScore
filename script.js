let selectedGame = '';
let players = [];

function selectGame(game) {
    selectedGame = game;
    document.querySelector('.games').classList.add('hidden');
    document.getElementById('playerInput').classList.remove('hidden');
}

function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        if (selectedGame === 'Around the clock') {
            players.push({ name: playerName, target: 1 });
        } else {
            players.push({ name: playerName, score: parseInt(selectedGame) });
        }
        updateScoreboard();
    }
}


function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    players.forEach(player => {
        scoreboard.innerHTML += `<div>${player.name}: ${player.score}</div>`;
    });
    scoreboard.classList.remove('hidden');
}

function startGame() {
    document.getElementById('playerInput').classList.add('hidden');
    updateScoreboard();
}

function registerScore(playerIndex) {
    if (selectedGame === 'Around the clock') {
        const hitTarget = parseInt(prompt(`${players[playerIndex].name}, hvilket nummer traff du?`));
        if (hitTarget === players[playerIndex].target) {
            players[playerIndex].target += 1;
            if (players[playerIndex].target > 20) {
                alert(`${players[playerIndex].name} vant!`);
                resetGame();
                return;
            }
        }
    } else {
        const firstDart = parseInt(prompt(`${players[playerIndex].name}, skriv inn poengsummen for din første pil:`));
        if (!isValidDart(firstDart)) {
            alert(`${firstDart} er ikke en gyldig poengsum for en pil.`);
            return;
        }
        const secondDart = parseInt(prompt(`${players[playerIndex].name}, skriv inn poengsummen for din andre pil:`));
        if (!isValidDart(secondDart)) {
            alert(`${secondDart} er ikke en gyldig poengsum for en pil.`);
            return;
        } 
        const thirdDart = parseInt(prompt(`${players[playerIndex].name}, skriv inn poengsummen for din tredje pil:`));
        if (!isValidDart(thirdDart)) {
            alert(`${thirdDart} er ikke en gyldig poengsum for en pil.`);
            return;
        }
        
        const totalScore = firstDart + secondDart + thirdDart;

        if (players[playerIndex].score - totalScore < 0) {
            alert('Du har overskredet din gjenværende poengsum. Prøv igjen.');
            return;
        } else if (players[playerIndex].score - totalScore === 0 && (thirdDart % 2 !== 0 || thirdDart > 40)) {
            alert('Du må avslutte med en dobbel!');
            return;
        } else {
            players[playerIndex].score -= totalScore;
        }
    }
    updateScoreboard();

    // Vis påminnelse hvis spilleren kan vinne med sine neste tre piler
    if (players[playerIndex].score <= 160) {
        const winningRoutes = calculateWinningRoutes(players[playerIndex].score);
        if (winningRoutes.length > 0) {
            const readableRoutes = winningRoutes.map(route => route.map(scoreToString).join(' + '));
            alert(`${players[playerIndex].name}, du kan vinne med dine neste tre piler! Mulige ruter: ${readableRoutes.join(', ')}`);
        }
    }   
}

function isValidDart(score) {
    const validScores = [
        ...Array.from({ length: 20 }, (_, i) => i + 1),          // Enkelt tall: 1-20
        ...Array.from({ length: 20 }, (_, i) => (i + 1) * 2),   // Dobbel: 2-40
        ...Array.from({ length: 20 }, (_, i) => (i + 1) * 3),   // Trippel: 3-60
        25, 50                                                  // Bullseye: 25, 50
    ];
    return validScores.includes(score);
}



function resetGame() {
    players = [];
    selectedGame = '';
    document.getElementById('scoreboard').classList.add('hidden');
    document.querySelector('.games').classList.remove('hidden');
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    players.forEach((player, index) => {
        if (selectedGame === 'Around the clock') {
            scoreboard.innerHTML += `
                <div>
                    ${player.name}: Mål - ${player.target}
                    <button onclick="registerScore(${index})">Registrer treff</button>
                </div>`;
        } else {
            scoreboard.innerHTML += `
                <div>
                    ${player.name}: ${player.score}
                    <button onclick="registerScore(${index})">Registrer poeng</button>
                </div>`;
        }
    });
    scoreboard.classList.remove('hidden');
}

function scoreToString(score) {
    if (score <= 20) {
        return score.toString();
    } else if (score <= 40 && score % 2 === 0) {
        return `D${score / 2}`;
    } else if (score <= 60 && score % 3 === 0) {
        return `T${score / 3}`;
    }
    return score.toString(); // Fallback, men dette bør ikke skje med de gitte reglene
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function calculateWinningRoutes(score) {
    const routes = [];
    const doubles = Array.from({ length: 20 }, (_, i) => (i + 1) * 2); // [2, 4, ..., 40]
    const triples = Array.from({ length: 20 }, (_, i) => (i + 1) * 3); // [3, 6, ..., 60]
    const singles = Array.from({ length: 20 }, (_, i) => i + 1);      // [1, 2, ..., 20]
    const allScores = [...singles, ...doubles, ...triples];

    for (let i = 0; i < allScores.length; i++) {
        for (let j = 0; j < allScores.length; j++) {
            for (let k = 0; k < doubles.length; k++) {
                if (allScores[i] + allScores[j] + doubles[k] === score) {
                    routes.push([allScores[i], allScores[j], doubles[k]]);
                }
            }
        }
    }

    return routes;
}

