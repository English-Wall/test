document.addEventListener('DOMContentLoaded', () => {
  let rewardShown = false;
  const puzzleDiv = document.querySelector('.puzzle');
  const answerDiv = document.querySelector('.answer');
  const checkBtn = document.getElementById('checkBtn');
  const hintBtn = document.getElementById('hintBtn');
  const resultDiv = document.getElementById('result');
  const hintP = document.querySelector('.hint p');
  const rewardBtn = document.getElementById('reward');
  const submissionDiv = document.getElementById('submission');
  const submitBtn = document.getElementById('submit');
  const submitFeedback = document.getElementById('submitFeedback');

  const questions = [
    {
      word: 'abrade',
      hint: 'To scrape or wear away a surface or a part by mechanical or chemical action.'
    }
  ];

  let currentQuestionIndex = 0;
  let draggedLetter = null;

  function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5);
  }

  function getRandomColor() {
    const colors = ['#f7b7b7', '#b7d7f7', '#d7f7b7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function moveLetter(letter, targetDiv) {
    if (!letter || letter.classList.contains('locked')) return;
    targetDiv.appendChild(letter);
    updateClickHandler(letter);
  }

  function updateClickHandler(letter) {
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);
    if (letter.parentElement === puzzleDiv) {
      letter.addEventListener('click', handlePuzzleLetterClick);
    } else {
      letter.addEventListener('click', handleAnswerLetterClick);
    }
  }

  function handlePuzzleLetterClick(e) {
    moveLetter(e.target, answerDiv);
  }

  function handleAnswerLetterClick(e) {
    moveLetter(e.target, puzzleDiv);
  }

  function handleDragStart(e) {
    draggedLetter = e.target;
    e.dataTransfer.setData('text/plain', draggedLetter.textContent);
  }

  function lockLetter(letter) {
    letter.classList.add('locked');
    letter.setAttribute('draggable', 'false');
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);
    letter.removeEventListener('dragstart', handleDragStart);
  }

  function giveHint() {
    if (answerDiv.children.length > 0) {
      hintBtn.disabled = true;
      return;
    }
    const correctWord = questions[currentQuestionIndex].word;
    const firstLetter = Array.from(puzzleDiv.children).find(l => l.textContent === correctWord[0]);
    if (firstLetter) {
      moveLetter(firstLetter, answerDiv);
      lockLetter(firstLetter);
      hintBtn.disabled = true;
    }
  }

  function checkAnswer() {
    const currentWord = questions[currentQuestionIndex].word;
    const answer = Array.from(answerDiv.children).map(l => l.textContent).join('');
    if (answer === currentWord) {
      resultDiv.textContent = 'Correct!';
      resultDiv.style.color = 'green';
      showRewardButton();

      const meaningDiv = document.createElement('div');
      meaningDiv.innerHTML = `<strong>${currentWord}：磨損、刮除</strong>`;
      meaningDiv.style.marginTop = '8px';
      meaningDiv.style.marginBottom = '4px';
      meaningDiv.style.fontSize = '18px';
      meaningDiv.style.color = '#333';
      puzzleDiv.innerHTML = '';
      puzzleDiv.appendChild(meaningDiv);
    } else {
      resultDiv.textContent = 'Try Again!';
      resultDiv.style.color = 'red';
      setTimeout(loadQuestion, 1200);
    }
  }

  function loadQuestion() {
    puzzleDiv.innerHTML = '';
    answerDiv.innerHTML = '';
    resultDiv.textContent = '';
    hintBtn.disabled = false;
    rewardBtn.style.display = 'none';
    submissionDiv.style.display = 'none';
    rewardShown = false;

    const current = questions[currentQuestionIndex];
    hintP.textContent = `Hint: ${current.hint}`;
    shuffleWord(current.word).forEach(char => {
      const letter = document.createElement('div');
      letter.className = 'letter';
      letter.textContent = char;
      letter.style.backgroundColor = getRandomColor();
      letter.addEventListener('dragstart', handleDragStart);
      letter.addEventListener('click', handlePuzzleLetterClick);
      puzzleDiv.appendChild(letter);
    });
  }

  function showRewardButton() {
    if (rewardShown) return;
    rewardShown = true;
    rewardBtn.style.display = 'block';
  }

  // 綁定按鈕事件
  checkBtn.addEventListener('click', checkAnswer);
  hintBtn.addEventListener('click', giveHint);

  rewardBtn.addEventListener('click', () => {
    submissionDiv.style.display = 'block';
  });

  // 送資料到 Google Sheet
  submitBtn.addEventListener('click', () => {
    const idNumber = document.getElementById('idNumber').value.trim();
    const wordOfDay = document.getElementById('wordOfDay').value.trim();

    if (!idNumber || !wordOfDay) {
      submitFeedback.textContent = "請完整填寫所有欄位!";
      submitFeedback.style.color = "red";
      return;
    }

    // TODO: 改成你的 Google Apps Script 部署網址
    const scriptURL = "你的Google Apps Script網址";

    fetch(scriptURL, {
      method: "POST",
      body: new URLSearchParams({
        idNumber: idNumber,
        wordOfDay: wordOfDay
      })
    })
    .then(response => {
      submitFeedback.textContent = "✅ 提交成功!";
      submitFeedback.style.color = "green";
    })
    .catch(error => {
      submitFeedback.textContent = "❌ 提交失敗，請再試一次!";
      submitFeedback.style.color = "red";
    });
  });

  // 載入第一題
  loadQuestion();
});
