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

document.getElementById("next").onclick = () => {
  document.getElementById("submission").style.display = "block";
};

document.getElementById("submit").onclick = () => {
  const id = document.getElementById("idNumber").value.trim();
  const wordOfDay = document.getElementById("wordOfDay").value.trim();

  if (!id || !wordOfDay) {
    document.getElementById("submitFeedback").textContent = "❗未完成輸入";
    return;
  }

  fetch('https://script.google.com/macros/s/AKfycbxzZz9ax_VSA2TFG0PNebQU9_I_XRj9-g0uKQHnPAptzZILXi3F227Or7G476F-F12flQ/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `id=${encodeURIComponent(id)}&wordOfDay=${encodeURIComponent(wordOfDay)}`
  });

  document.getElementById("submitFeedback").textContent = "✅ Submitted! Thank you.";
  document.getElementById("submit").disabled = true;
};


loadQuestion();
