// --- 遊戲設定 ---
const EASY_COUNT = 13;
const MEDIUM_COUNT = 13;
const HARD_COUNT = 4;
const prizeLadder = [
    100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000,
    300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000,
    925000, 950000, 975000, 1000000
];

// --- DOM 元素 ---
const instructionsScreen = document.getElementById('instructions-screen');
const gameContainer = document.getElementById('game-container');
const congratsScreen = document.getElementById('congrats-screen');
const startBtn = document.getElementById('start-btn');
const ladderList = document.getElementById('ladder-list');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container'); // 新增：獲取回饋訊息的 DOM 元素

// --- 遊戲狀態 ---
let allQuestions = { easy: [], medium: [], hard: [] };
let gameQuestions = [];
let currentQuestionIndex = 0;

// --- 事件監聽 ---
startBtn.addEventListener('click', startGame);

// --- 函式 ---
async function loadQuestions() {
    try {
        const [easyRes, mediumRes, hardRes] = await Promise.all([
            fetch('data/easy.json'),
            fetch('data/medium.json'),
            fetch('data/hard.json')
        ]);
        allQuestions.easy = await easyRes.json();
        allQuestions.medium = await mediumRes.json();
        allQuestions.hard = await hardRes.json();
    } catch (error) {
        console.error("無法載入題庫:", error);
    }
}

function startGame() {
    instructionsScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    congratsScreen.classList.add('hidden');
    
    prepareGameQuestions();
    currentQuestionIndex = 0;
    
    renderLadder();
    displayQuestion();
}

function prepareGameQuestions() {
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    const easySample = shuffle([...allQuestions.easy]).slice(0, EASY_COUNT);
    const mediumSample = shuffle([...allQuestions.medium]).slice(0, MEDIUM_COUNT);
    const hardSample = shuffle([...allQuestions.hard]).slice(0, HARD_COUNT);
    gameQuestions = [...easySample, ...mediumSample, ...hardSample];
}

function renderLadder() {
    ladderList.innerHTML = '';
    prizeLadder.forEach((prize, index) => {
        const li = document.createElement('li');
        li.textContent = prize.toLocaleString();
        li.dataset.index = index;
        ladderList.appendChild(li);
    });
}

function displayQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        endGame(true);
        return;
    }
    updateLadderHighlight();
    const currentQuestion = gameQuestions[currentQuestionIndex];
    questionTextEl.textContent = currentQuestion.question.replace('___', '______');
    optionsContainer.innerHTML = '';
    const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(optionText => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = optionText;
        button.addEventListener('click', handleAnswer); // 直接傳遞 event
        optionsContainer.appendChild(button);
    });
}

function updateLadderHighlight() {
    const ladderItems = ladderList.querySelectorAll('li');
    ladderItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        item.classList.remove('current', 'passed');
        if (index < currentQuestionIndex) {
            item.classList.add('passed');
        } else if (index === currentQuestionIndex) {
            item.classList.add('current');
        }
    });
}

// [問題3 修正] handleAnswer 函式重大更新
function handleAnswer(event) {
    const selectedButton = event.target;
    const selectedOption = selectedButton.textContent;
    const correctAnswer = gameQuestions[currentQuestionIndex].answer;
    const allOptionButtons = optionsContainer.querySelectorAll('.option');

    // 禁用所有按鈕
    allOptionButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        // --- 答對了 ---
        // 顯示回饋訊息
        feedbackContainer.classList.remove('hidden');

        // 標示正確與錯誤選項
        allOptionButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        });

        // 停頓 1.5 秒後執行
        setTimeout(() => {
            feedbackContainer.classList.add('hidden'); // 隱藏回饋
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); // 延遲 1.5 秒
    } else {
        // --- 答錯了 ---
        // 答錯時，將選錯的選項標紅，正確答案標綠
        allOptionButtons.forEach(btn => {
            if (btn === selectedButton) {
                // 將 CSS 的 .current (紅色) 樣式暫時用在按鈕上
                btn.style.backgroundColor = '#e74c3c';
                btn.style.color = 'white';
            }
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });

        setTimeout(() => {
            endGame(false);
        }, 2000); // 答錯後停頓久一點，讓玩家看到正確答案
    }
}

function endGame(isWinner) {
    gameContainer.classList.add('hidden');
    if (isWinner) {
        congratsScreen.classList.remove('hidden');
        const video = document.getElementById('congrats-video');
        if (video) video.play();
    } else {
        alert('可惜，答錯了！再試一次吧！');
        window.location.reload();
    }
}

// 頁面載入時就先去抓題庫
loadQuestions();
