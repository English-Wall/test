// 遊戲設定
const EASY_COUNT = 13;
const MEDIUM_COUNT = 13;
const HARD_COUNT = 4;

const prizeLadder = [
    100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, // 簡單
    300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, // 中等
    925000, 950000, 975000, 1000000 // 困難
];

// DOM 元素
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const ladderList = document.getElementById('ladder-list');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// 遊戲狀態
let allQuestions = { easy: [], medium: [], hard: [] };
let gameQuestions = [];
let currentQuestionIndex = 0;


// 監聽開始按鈕
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});


// 非同步載入所有題庫
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

// 開始遊戲
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // 準備本局題目
    prepareGameQuestions();
    currentQuestionIndex = 0;
    
    // 渲染畫面
    renderLadder();
    displayQuestion();
}

// 準備30題遊戲題目
function prepareGameQuestions() {
    // 洗牌函式
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    const easySample = shuffle([...allQuestions.easy]).slice(0, EASY_COUNT);
    const mediumSample = shuffle([...allQuestions.medium]).slice(0, MEDIUM_COUNT);
    const hardSample = shuffle([...allQuestions.hard]).slice(0, HARD_COUNT);

    gameQuestions = [...easySample, ...mediumSample, ...hardSample];
}

// 頁面載入時就先去抓題庫
loadQuestions();


// 渲染進度列
function renderLadder() {
    ladderList.innerHTML = '';
    prizeLadder.forEach((prize, index) => {
        const li = document.createElement('li');
        li.textContent = prize.toLocaleString(); // 格式化數字 e.g., 1,000,000
        li.dataset.index = index;
        ladderList.appendChild(li);
    });
}

// 顯示當前題目
function displayQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        endGame(true); // 玩家獲勝
        return;
    }

    // 更新進度列高亮
    updateLadderHighlight();

    const currentQuestion = gameQuestions[currentQuestionIndex];
    
    // 將 ___ 替換為可放置答案的格
    const questionHTML = currentQuestion.question.replace('___', '<span id="answer-slot"></span>');
    questionTextEl.innerHTML = questionHTML;

  }));

    // 隨機排序選項
    const shuffledOptions = optionsWithFlag.sort(() => Math.random() - 0.5);

    // 顯示選項按鈕
    optionsContainer.innerHTML = '';
    shuffledOptions.forEach(optionObj => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = optionObj.text;
        button.addEventListener('click', () => handleAnswer(optionObj));
        optionsContainer.appendChild(button);
    });
}


// 更新進度列高亮
function updateLadderHighlight() {
    const ladderItems = ladderList.querySelectorAll('li');
    ladderItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        if (index === currentQuestionIndex) {
            item.classList.add('current');
            item.classList.remove('passed');
        } else if (index < currentQuestionIndex) {
            item.classList.add('passed');
            item.classList.remove('current');
        } else {
            item.classList.remove('current', 'passed');
        }
    });
}


// 處理玩家答案
function handleAnswer(selectedOption) {
    const correctAnswer = gameQuestions[currentQuestionIndex].answer;
    
    if (selectedOption === correctAnswer) {
        // 答對了
        document.getElementById('answer-slot').textContent = correctAnswer;
        // 視覺回饋 (可以做得更炫)
        document.getElementById('answer-slot').style.borderColor = 'green';
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); // 延遲 1.5 秒後跳到下一題

    } else {
        // 答錯了
        endGame(false);
    }
}

// 結束遊戲
function endGame(isWinner) {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    const endMessage = document.getElementById('end-message');

    if (isWinner) {
        endMessage.textContent = `恭喜你！贏得了 ${prizeLadder[prizeLadder.length - 1].toLocaleString()}！`;
    } else {
        const prizeWon = currentQuestionIndex > 0 ? prizeLadder[currentQuestionIndex - 1] : 0;
        endMessage.textContent = `遊戲結束！您獲得了 ${prizeWon.toLocaleString()}。`;
    }
}
