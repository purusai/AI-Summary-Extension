document.getElementById("summarize").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const summarytype =
        document.getElementById("summary-type").value;

    resultDiv.innerHTML = "<div class='loader'></div>";

    chrome.storage.sync.get(
        ["geminiApiKey"],
        ({ geminiApiKey }) => {

            if (!geminiApiKey) {
                resultDiv.textContent =
                    "API key not found. Please set it in options.";
                return;
            }

            chrome.tabs.query(
                { active: true, currentWindow: true },
                ([tab]) => {

                    chrome.tabs.sendMessage(
                        tab.id,
                        { type: "GET_ARTICLE_TEXT" },
                        async (response) => {

                            if (chrome.runtime.lastError) {
                                resultDiv.textContent =
                                    "Content script not found: " +
                                    chrome.runtime.lastError.message;
                                return;
                            }

                            if (!response) {
                                resultDiv.textContent =
                                    "No response from content script.";
                                return;
                            }

                            const { text } = response;

                            if (!text || text.trim().length === 0) {
                                resultDiv.textContent =
                                    "No text found on this page.";
                                return;
                            }

                            try {
                                const summary =
                                    await getGeminiSummary(
                                        text,
                                        summarytype,
                                        geminiApiKey
                                    );

                                resultDiv.textContent = summary;
                            } catch (error) {
                                resultDiv.textContent =
                                    "Error fetching summary: " +
                                    error.message;
                            }
                        }
                    );
                }
            );
        }
    );
});

async function getGeminiSummary(rawText, type, apiKey) {
    const max = 20000;
    const text =
        rawText.length > max
            ? rawText.slice(0, max) + "..."
            : rawText;

    const promptMap = {
        brief: `Summarize the following text in a concise manner:\n\n${text}`,
        detailed: `Provide a detailed summary of the following text:\n\n${text}`,
        bullet: `Summarize the following text in bullet points:\n\n${text}`
    };

    const prompt = promptMap[type] || promptMap.brief;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary generated."
    );
}




// copy button functionality
document.getElementById("copy-button").addEventListener("click", () => {
    const txt = document.getElementById("result").innerText;
    if (!txt) return;
    navigator.clipboard.writeText(txt);
});