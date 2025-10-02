// --- 遊戲設定 (與之前相同) ---
const EASY_COUNT = 13;
const MEDIUM_COUNT = 13;
const HARD_COUNT = 4;
const prizeLadder = [
    100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000,
    300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000,
    925000, 950000, 975000, 1000000
];

// --- DOM 元素 ---
// 新增了不同畫面的 DOM 元素
const instructionsScreen = document.getElementById('instructions-screen');
const gameContainer = document.getElementById('game-container');
const congratsScreen = document.getElementById('congrats-screen');
const startBtn = document.getElementById('start-btn');
const ladderList = document.getElementById('ladder-list');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// --- 遊戲狀態 (與之前相同) ---
let allQuestions = { easy: [], medium: [], hard: [] };
let gameQuestions = [];
let currentQuestionIndex = 0;

// --- 事件監聽 ---
// 監聽 "開始遊戲" 按鈕
startBtn.addEventListener('click', startGame);


// --- 函式 ---

// 非同步載入所有題庫 (與之前相同)
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
        console.log("題庫載入完成!");
    } catch (error) {
        console.error("無法載入題庫:", error);
    }
}

// 開始遊戲 (邏輯更新)
function startGame() {
    // 隱藏指示畫面，顯示遊戲主畫面
    instructionsScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    congratsScreen.classList.add('hidden'); // 確保恭喜畫面是隱藏的
    
    prepareGameQuestions();
    currentQuestionIndex = 0;
    
    renderLadder();
    displayQuestion();
}

// 準備30題遊戲題目 (與之前相同)
function prepareGameQuestions() {
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    const easySample = shuffle([...allQuestions.easy]).slice(0, EASY_COUNT);
    const mediumSample = shuffle([...allQuestions.medium]).slice(0, MEDIUM_COUNT);
    const hardSample = shuffle([...allQuestions.hard]).slice(0, HARD_COUNT);
    gameQuestions = [...easySample, ...mediumSample, ...hardSample];
}

// 渲染進度列 (與之前相同)
function renderLadder() {
    ladderList.innerHTML = '';
    prizeLadder.forEach((prize, index) => {
        const li = document.createElement('li');
        li.textContent = prize.toLocaleString();
        li.dataset.index = index;
        ladderList.appendChild(li);
    });
}

// 顯示當前題目 (邏輯更新)
function displayQuestion() {
    // 檢查是否已完成所有題目
    if (currentQuestionIndex >= gameQuestions.length) {
        endGame(true); // 玩家獲勝
        return;
    }

    updateLadderHighlight();

    const currentQuestion = gameQuestions[currentQuestionIndex];
    // 直接顯示題目文字，不再替換 ___
    questionTextEl.textContent = currentQuestion.question.replace('___', '______');

    optionsContainer.innerHTML = '';
    const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => handleAnswer(option));
        optionsContainer.appendChild(button);
    });
}

// 更新進度列高亮 (邏輯相同，但 CSS 效果不同)
function updateLadderHighlight() {
    const ladderItems = ladderList.querySelectorAll('li');
    ladderItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        item.classList.remove('current', 'passed'); // 先清除所有狀態
        if (index < currentQuestionIndex) {
            item.classList.add('passed'); // 已通過的題目 (綠底)
        } else if (index === currentQuestionIndex) {
            item.classList.add('current'); // 當前題目 (紅底)
        }
    });
}

// 處理玩家答案 (邏輯更新)
function handleAnswer(selectedOption) {
    // 暫時禁用選項按鈕，防止連續點擊
    optionsContainer.querySelectorAll('.option').forEach(btn => btn.disabled = true);

    const correctAnswer = gameQuestions[currentQuestionIndex].answer;
    
    if (selectedOption === correctAnswer) {
        // 答對了
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1000); // 延遲 1 秒後跳到下一題
    } else {
        // 答錯了
        setTimeout(() => {
            endGame(false);
        }, 1000);
    }
}

// 結束遊戲 (邏輯更新)
function endGame(isWinner) {
    gameContainer.classList.add('hidden'); // 隱藏遊戲主畫面

    if (isWinner) {
        // 顯示恭喜畫面
        congratsScreen.classList.remove('hidden');
        const video = document.getElementById('congrats-video');
        video.play(); // 播放影片
    } else {
        // 如果答錯了，可以簡單地 alert 或導回指示畫面
        alert('可惜，答錯了！再試一次吧！');
        // 重新載入頁面回到初始狀態
        window.location.reload();
    }
}

// 頁面載入時就先去抓題庫
loadQuestions();
