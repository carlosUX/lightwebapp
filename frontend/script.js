document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generateBtn");

  if (generateBtn) {
    generateBtn.addEventListener("click", generate);
  } else {
    console.error("Button with ID 'generateBtn' not found!");
  }

  // Check if 'marked' is available
  if (typeof marked === "undefined") {
    console.error("Marked.js is missing! Ensure it's included in your HTML.");
  }
});

async function generate() {
  const promptElement = document.getElementById("prompt");
  const resultElement = document.getElementById("result");

  if (!promptElement || !resultElement) {
    console.error("Missing input or result elements!");
    return;
  }

  const prompt = promptElement.value;

  if (!prompt) {
    resultElement.innerText = "Please enter a prompt!";
    return;
  }

  try {
    const response = await fetch(
      "https://structura-ai.services.ai.azure.com/",
      //const response = await fetch("http://127.0.0.1:8000/generate/", {
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ensure API authentication if required
          Authorization: "Bearer YOUR_API_KEY",
        },
        body: JSON.stringify({ prompt: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();

    // Debugging: Log the entire API response for validation
    console.log("DEBUG: API Response:", JSON.stringify(result, null, 2));

    let wireframeDescription = "";

    // Updated response parsing structure
    if (
      result.message?.choices?.length &&
      typeof result.message.choices[0]?.message?.content === "string"
    ) {
      wireframeDescription = result.message.choices[0].message.content;
    } else if (
      result.choices?.length &&
      typeof result.choices[0]?.message?.content === "string"
    ) {
      wireframeDescription = result.choices[0].message.content;
    } else {
      wireframeDescription = JSON.stringify(result, null, 2);
    }

    // Convert Markdown to HTML using Marked.js
    if (typeof marked !== "undefined") {
      resultElement.innerHTML = marked.parse(wireframeDescription);
    } else {
      resultElement.innerText = wireframeDescription;
      console.error("Marked.js not found! Showing plain text instead.");
    }
  } catch (error) {
    console.error("Request failed:", error);
    resultElement.innerText = `Something went wrong. Error: ${error.message}`;
  }
}
