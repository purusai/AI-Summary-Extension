document.getElementById("summarize").addEventListener("click", () => {
    const result = document.getElementById("result");
    result.textContent = "Extracting article text...";

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(
            tab.id,
            { type: "GET_ARTICLE_TEXT" },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    result.textContent = chrome.runtime.lastError.message;
                    return;
                }

                result.textContent = response?.text
                    ? response.text.slice(0, 300) + "..."
                    : "No article text found.";
            }
        );
    });
});