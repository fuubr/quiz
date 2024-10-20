const questions = [
    { question: "Qual é 15 x 3?", options: [40, 25, 45, 30], answer: 45 },
    { question: "Qual é 12 - 5?", options: [6, 7, 8, 5], answer: 7 },
    { question: "Qual é 7 × 6?", options: [42, 36, 48, 54], answer: 42 },
    { question: "Qual é 56 ÷ 7?", options: [7, 8, 9, 10], answer: 8 },
    { question: "Qual é 8 x 9?", options: [72, 81, 64, 56], answer: 72 },
    { question: "Qual é 25 + 17?", options: [42, 40, 43, 38], answer: 42 },
    { question: "Qual é 49 ÷ 7?", options: [5, 6, 7, 8], answer: 7 },
    { question: "Qual é 100 - 28?", options: [68, 72, 75, 77], answer: 72 },
    { question: "Qual é 9 × 9?", options: [72, 81, 64, 99], answer: 81 }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timeLimit = 10;
const scoreboard = [];

const playerNameInput = document.getElementById('player-name');
const userIdInput = document.getElementById('user-id');
const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const scoreboardScreen = document.getElementById('scoreboard');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('time');

startButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    const userId = userIdInput.value.trim();
    if (playerName && userId) {
        startGame(playerName, userId);
    } else {
        alert("Por favor, preencha seu nome e ID.");
    }
});

function startGame(playerName, userId) {
    currentQuestionIndex = 0;
    score = 0;
    scoreboard.length = 0; // Limpa o placar ao iniciar um novo jogo
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startTimer();
    shuffleQuestions();
    showQuestion(questions[currentQuestionIndex]);

    scoreboard.push({ id: userId, name: playerName, score: 0 });
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function shuffleOptions(options) {
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
}

function startTimer() {
    let timeLeft = timeLimit;
    timerElement.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Tempo esgotado!");
            nextQuestion();
        }
    }, 1000);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    optionsElement.innerHTML = '';
    const shuffledOptions = shuffleOptions([...question.options]);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(option, question.answer));
        optionsElement.appendChild(button);
    });
}

function selectOption(selectedOption, correctAnswer) {
    clearInterval(timer);
    disableOptions();

    if (selectedOption === correctAnswer) {
        score++;
        alert("Correto!");
    } else {
        alert("Incorreto!");
    }

    setTimeout(nextQuestion, 900);
}

function disableOptions() {
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.disabled = true;
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        startTimer();
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showScore();
    }
}

function showScore() {
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    scoreboardScreen.classList.remove('hidden');
    scoreElement.innerText = `Você acertou ${score} de ${questions.length} perguntas!`;

    // Adiciona a reação com base na pontuação
    const reaction = getReaction(score, questions.length);
    const reactionElement = document.createElement('p');
    reactionElement.classList.add('reaction'); // Adiciona classe para estilização
    reactionElement.innerText = reaction;
    scoreElement.appendChild(reactionElement);

    // Atualiza o placar
    const playerId = userIdInput.value.trim();
    const userEntry = scoreboard.find(entry => entry.id === playerId);
    if (userEntry) {
        userEntry.score = score;
    }
    displayScoreboard();

    document.getElementById('redirect-button').classList.remove('hidden');
}

// Função para obter a reação com base na pontuação
function getReaction(score, totalQuestions) {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage === 100) {
        return "Incrível! Você acertou todas as perguntas!";
    } else if (percentage >= 75) {
        return "Muito bom! Você tem um ótimo conhecimento matemático!";
    } else if (percentage >= 50) {
        return "Bom trabalho! Mas você pode melhorar.";
    } else if (percentage >= 25) {
        return "Você pode tentar mais uma vez. Continue praticando!";
    } else {
        return "Não desanime! Cada erro é uma oportunidade de aprender.";
    }
}

document.getElementById('redirect-button').addEventListener('click', () => {
    window.location.href = 'https://encurtador.com.br/09dQ7'; // Substitua pela URL desejada
});

function displayScoreboard() {
    const scoreboardBody = document.getElementById('scoreboard-body');
    scoreboardBody.innerHTML = '';

    scoreboard.sort((a, b) => b.score - a.score);

    scoreboard.forEach(entry => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');

        idCell.innerText = entry.id;
        nameCell.innerText = entry.name;
        scoreCell.innerText = entry.score;

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        scoreboardBody.appendChild(row);
    });
}

document.getElementById('new-game-button').addEventListener('click', () => {
    scoreboardScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

document.getElementById('restart-button').addEventListener('click', () => {
    scoreboardScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame(playerNameInput.value, userIdInput.value);
});
