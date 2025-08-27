const question = {
    correct: "transducer",
    options: ["transducer", "lock nut", "support", "key tab"]
};

function disableOptions() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
}

function loadQuestion() {
    const nextButton = document.getElementById("next");
    nextButton.disabled = true;
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
    const container = document.querySelector('.container');
    container.innerHTML = `
        <img src="answer.png" alt="Congratulations" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
        <p style="margin-top: 20px;">請輸入您的員工號以完成紀錄：</p>
        <input type="text" id="userId" placeholder="輸入 ID" style="padding: 10px; width: 80%; max-width: 300px; margin-top: 10px;">
        <button id="submitId" style="margin-top: 10px; padding: 10px 20px;">送出</button>
        <div id="submitFeedback" style="margin-top: 10px;"></div>
    `;

    // 重新綁定送出按鈕事件
    setTimeout(() => {
        document.getElementById("submitId").onclick = () => {
            const userId = document.getElementById("userId").value.trim();    
            if (!/^\d+$/.test(userId)) {
            document.getElementById("submitFeedback").textContent = "❗請輸入有效的員工號";
            return;
            }


            // 傳送資料到 Google Sheets API
            fetch("https://script.google.com/macros/s/AKfycbwlDx-5HWWcxPgSUpniZn26COmVVeuUIaPGo21jNUjHjVcZccUAyeLRFxMUdPqAxvlk/exec", {
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    question: "transducer",
                    result: "completed"
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.text())
            .then(response => {
                document.getElementById("submitFeedback").textContent = "✅ 已成功送出，明天再繼續！";
            })
            .catch(error => {
                document.getElementById("submitFeedback").textContent = "❌ 發生錯誤，請稍後再試。";
                console.error("Error:", error);
            });
        };
    }, 0);
};

loadQuestion();
