document.getElementById("summarize").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const summarytype = document.getElementById("summary-type").value;



    resultDiv.innerHTML = "<div class='loader'></div>";

    // Get the user's API key

    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            resultDiv.textContent = "API key not found. Please set it in the options.";
            return;
        }

        // Ask content.js for the page text
          chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.tabs.sendMessage(
            tab.id,
            { type: "GET_ARTICLE_TEXT" },
            async ({ text }) => {
               if (!text) {
                    resultDiv.textContent = "No text found on this page.";
                    return;
                }
                // Send text to Gemini
                try{
                    const summary = await getGeminiSummary(text, summarytype, geminiApiKey);
                    resultDiv.textContent = summary;
                } catch (error) {
                    resultDiv.textContent = "Error fetching summary: " + error.message;
                    return;
                }
                
            }
        );
    });

    })    
   
});



 async function getGeminiSummary(rawText, type, apiKey) {
        const max = 20000;
        const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;
        
    }