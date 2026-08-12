document.getElementById("summarize").addEventListener("click", () => {
    const result = document.getElementById("result");
    result.textContent = "Extracting article text...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tabs]) => {
        chrome.tabs.sendMessage(tabs.id,
             { type: "GET_ARTICLE_TEXT" },
              (response) => {
            result.textContent = response?.text
    ? response.text.slice(0, 300) + "..."
    : "No article text found.";
        }
    );
  });
});