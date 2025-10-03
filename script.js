// --- 遊戲設定 ---
const EASY_COUNT = 13;
const MEDIUM_COUNT = 13;
const HARD_COUNT = 4;

// --- DOM 元素 ---
const instructionsScreen = document.getElementById('instructions-screen');
const gameContainer = document.getElementById('game-container');
const congratsScreen = document.getElementById('congrats-screen');
const startBtn = document.getElementById('start-btn');

// 新增：頂部資訊欄的 DOM 元素
const challengeInfoEl = document.querySelector('#challenge-info span');
const questionCounterEl = document.querySelector('#question-counter span');
const scoreInfoEl = document.querySelector('#score-info span');

const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');

// --- 遊戲狀態 ---
let allQuestions = { easy: [], medium: [], hard: [] };
let gameQuestions = [];
let currentQuestionIndex = 0;
let cumulativeScore = 0;

// --- 題庫載入狀態 ---
let questionsLoaded = false;

// 頁面載入時，先禁用開始按鈕
startBtn.disabled = true;

// --- 載入題庫 ---
async function loadQuestions() {
    try {
        const [easyRes, mediumRes, hardRes] = await Promise.all([
            fetch('data/easy.json'), fetch('data/medium.json'), fetch('data/hard.json')
        ]);
        allQuestions.easy = await easyRes.json();
        allQuestions.medium = await mediumRes.json();
        allQuestions.hard = await hardRes.json();
        questionsLoaded = true;
        startBtn.disabled = false; // 題庫載入完成才可開始
    } catch (error) {
        console.error("無法載入題庫:", error);
        alert("題庫載入失敗，請重新整理頁面！");
    }
}

// --- 事件監聽 ---
startBtn.addEventListener('click', () => {
    if (!questionsLoaded) {
        alert('題庫尚未載入完成，請稍候！');
        return;
    }
    startGame();
});

// --- 主要函式 ---
function startGame() {
    instructionsScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    congratsScreen.classList.add('hidden');

    prepareGameQuestions();
    currentQuestionIndex = 0;
    cumulativeScore = 0; // 重置分數

    displayQuestion();
}

function prepareGameQuestions() {
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    const easySample = shuffle([...allQuestions.easy]).slice(0, EASY_COUNT);
    const mediumSample = shuffle([...allQuestions.medium]).slice(0, MEDIUM_COUNT);
    const hardSample = shuffle([...allQuestions.hard]).slice(0, HARD_COUNT);
    gameQuestions = [...easySample, ...mediumSample, ...hardSample];
}

function displayQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        endGame(true);
        return;
    }

    updateTopBar(); // 更新頂部資訊欄

    const currentQuestion = gameQuestions[currentQuestionIndex];
    questionTextEl.textContent = currentQuestion.question.replace('___', '______');
    optionsContainer.innerHTML = '';
    const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(optionText => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = optionText;
        button.addEventListener('click', handleAnswer);
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(event) {
    const selectedButton = event.target;
    const selectedOption = selectedButton.textContent;
    const correctAnswer = gameQuestions[currentQuestionIndex].answer;
    const allOptionButtons = optionsContainer.querySelectorAll('.option');

    allOptionButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        const pointsWon = getQuestionValue(currentQuestionIndex);
        cumulativeScore += pointsWon; // 答對了，才加上分數

        feedbackContainer.classList.remove('hidden');
        allOptionButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) btn.classList.add('correct');
            else btn.classList.add('incorrect');
        });

        setTimeout(() => {
            feedbackContainer.classList.add('hidden');
            currentQuestionIndex++;
            displayQuestion();
        }, 2000);
    } else {
        selectedButton.style.backgroundColor = '#e74c3c';
        selectedButton.style.color = 'white';
        allOptionButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) btn.classList.add('correct');
        });

        setTimeout(() => endGame(false), 2500);
    }
}


function endGame(isWinner) {
    gameContainer.classList.add('hidden');
    if (isWinner) {
        congratsScreen.classList.remove('hidden');
        const video = document.getElementById('congrats-video');
        if (video) video.play();

        // 🎉 加入灑彩蛋動畫
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        alert(`遊戲結束！您的最終點數是: ${cumulativeScore}點`);
        window.location.reload();
    }
}


// --- 輔助函式 ---

// 根據題號獲取對應點數
function getQuestionValue(index) {
    const questionNumber = index + 1;
    if (questionNumber <= EASY_COUNT) {
        return 100;
    } else if (questionNumber <= EASY_COUNT + MEDIUM_COUNT) {
        return 300;
    } else {
        return 500;
    }
}

// 更新頂部資訊欄
function updateTopBar() {
    const questionNumber = currentQuestionIndex + 1;
    const challengePoints = getQuestionValue(currentQuestionIndex);

    challengeInfoEl.textContent = `${challengePoints}點`;
    questionCounterEl.textContent = `${questionNumber}`;
    scoreInfoEl.textContent = `${cumulativeScore.toLocaleString()}點`;
}

// 頁面載入時就先去抓題庫
loadQuestions();
