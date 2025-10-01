const question = {
  correct: "bubbles",
  options: ["particles", "bubbles", "droplets", "blisters"]
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
    status.textContent = "❗ ID must be numeric.";
    return;
  }

  // 驗證 word 是否為英文字母
  if (!/^[a-zA-Z]+$/.test(word)) {
    status.textContent = "❗ Word must contain only English letters.";
    return;
  }

  status.textContent = "Submitting...";

  fetch("https://script.google.com/macros/s/你的網址/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `id=${encodeURIComponent(id)}&word=${encodeURIComponent(word)}`
  })
  .then(() => {
    status.textContent = "✅ Submitted!";
    document.getElementById("submit").disabled = true;
  })
  .catch(() => {
    status.textContent = "❌ Submission failed. Try again.";
  });
};

loadQuestion();
