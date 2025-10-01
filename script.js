const question = {
  correct: "bubbles",
  options: ["particles", "bubbles", "blisters"]
};

function disableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
}

function loadQuestion() {
  const nextButton = document.getElementById("next");
  nextButton.disabled = true;
  nextButton.style.display = "none";
  document.getElementById("feedback").textContent = "";

  document.getElementById("question").innerHTML = `
    <img src="question.png" alt="Question Image" style="max-width: 100%; height: auto;">
  `;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  question.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = `option-btn option-btn-${index + 1}`;
    btn.onclick = () => {
      if (option === question.correct) {
        btn.classList.add("correct");
        document.getElementById("feedback").textContent = "✅ Correct!";
        disableOptions();
        nextButton.disabled = false;
        nextButton.style.display = "block";
        document.getElementById("question").innerHTML = `
          <img src="answer.png" alt="Answer Image" style="max-width: 100%; height: auto;">
        `;
      } else {
        btn.classList.add("incorrect");
        document.getElementById("feedback").textContent = "❌ Wrong. Try again.";
        btn.disabled = true;
      }
    };
    optionsDiv.appendChild(btn);
  });
}

document.getElementById("next").onclick = () => {
  document.getElementById("submission").style.display = "block";
};

document.getElementById("submit").onclick = () => {
  const id = document.getElementById("idNumber").value.trim();
  const word = document.getElementById("wordOfDay").value.trim();
  const status = document.getElementById("submitFeedback");

  // 驗證 ID 是否為數字
  if (!/^\d+$/.test(id)) {
    status.textContent = "❗ 請輸入正確的數字員工號";
    return;
  }

  // 驗證 word 是否為英文字母
  if (!/^[a-zA-Z]+$/.test(word)) {
    status.textContent = "❗ 請輸入正確的英文單字";
    return;
  }

 status.textContent = "Submitting...";
  document.getElementById("submit").disabled = true; // 先禁用按鈕防止重複提交

  fetch("https://script.google.com/macros/s/AKfycbxN_QRhW6F7ogSh_twhLlfMZNbSyGlzip3AmhiWHt1wJ0It4fReU53RJ5Ub5w_nWTLE/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${encodeURIComponent(id)}&word=${encodeURIComponent(word)}`
  })
  .then(response => response.json()) // 解析從 Apps Script 回傳的 JSON
  .then(data => {
    status.textContent = data.message; // 顯示從後端傳來的訊息
    if (data.status === 'success') {
      document.getElementById("submit").disabled = true; // 成功後保持禁用
    } else {
      document.getElementById("submit").disabled = false; // 失敗後重新啟用按鈕
    }
  })
  .catch((error) => {
    console.error("Submission error:", error);
    status.textContent = "❌ Submission failed. Check console for details.";
    document.getElementById("submit").disabled = false; // 發生錯誤時也重新啟用按鈕
  });
};

loadQuestion();
