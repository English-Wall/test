const question = {
    correct: "bubbles",
    options: ["particles", "bubbles", "droplets", "blisters"]
};

// Google Apps Script 的網址
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzZz9ax_VSA2TFG0PNebQU9_I_XRj9-g0uKQHnPAptzZILXi3F227Or7G476F-F12flQ/exec';

function disableOptions() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
}

function loadQuestion() {
    // 隱藏 ID 輸入表單並清空回饋訊息
    document.getElementById("id-form-container").style.display = "none";
    document.getElementById("submit-feedback").textContent = "";
    document.getElementById("feedback").textContent = "";

    // 顯示問題圖片
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
                
                // 顯示答案圖片
                document.getElementById("question").innerHTML = `
                    <img src="answer.png" alt="Answer Image" style="max-width: 100%; height: auto;">
                `;

                // *** 修改點：顯示 ID 輸入表單，而不是 'next' 按鈕 ***
                document.getElementById("id-form-container").style.display = "block";

            } else {
                btn.classList.add("incorrect");
                document.getElementById("feedback").textContent = "❌ Wrong. Try again.";
                btn.disabled = true;
            }
        };
        optionsDiv.appendChild(btn);
    });
}

// *** 修改點：為新的 "送出" 按鈕加上事件 ***
document.getElementById("submit-id").onclick = () => {
    const idInput = document.getElementById("id-input");
    const idNumber = idInput.value.trim(); // 取得輸入的 ID 並移除前後空白
    const submitFeedback = document.getElementById("submit-feedback");

    if (idNumber === "") {
        submitFeedback.textContent = "⚠️ ID 不能為空！";
        submitFeedback.style.color = "red";
        return;
    }
    
    submitFeedback.textContent = "傳送中...";
    submitFeedback.style.color = "black";
    document.getElementById("submit-id").disabled = true; // 防止重複點擊

    // 使用 Fetch API 將資料送到 Google Apps Script
    fetch(SCRIPT_URL, {
        method: 'POST', // 使用 POST 方法
        mode: 'no-cors', // 由於 Google Script 的限制，通常需要用 no-cors
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: idNumber }) // 將 ID 包裝成 JSON 格式送出
    })
    .then(response => {
        // 因為是 no-cors 模式，我們無法直接讀取回應內容，但可以假設成功
        submitFeedback.textContent = "🎉 成功送出！";
        submitFeedback.style.color = "green";
        idInput.value = ""; // 清空輸入框
    })
    .catch(error => {
        // 處理網路錯誤等問題
        console.error('Error:', error);
        submitFeedback.textContent = "❌ 傳送失敗，請再試一次。";
        submitFeedback.style.color = "red";
    })
    .finally(() => {
        document.getElementById("submit-id").disabled = false; // 無論成功失敗，都恢復按鈕功能
    });
};


// 頁面載入時執行
loadQuestion();
