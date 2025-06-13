document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generateBtn");

  if (generateBtn) {
    generateBtn.addEventListener("click", generate);
  } else {
    console.error("Button with ID 'generateBtn' not found!");
  }
});

async function generate() {
  const prompt = document.getElementById("prompt").value;

  if (!prompt) {
    document.getElementById("result").innerText = "Please enter a prompt!";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/generate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();

    // Log full response for debugging
    console.log("DEBUG: Full API response:", JSON.stringify(result, null, 2));

    let wireframeDescription = "";

    // Using the updated structure from your API response:
    if (
      result.message &&
      result.message.choices &&
      Array.isArray(result.message.choices) &&
      result.message.choices.length > 0 &&
      result.message.choices[0].message &&
      typeof result.message.choices[0].message.content === "string"
    ) {
      wireframeDescription = result.message.choices[0].message.content;
    } else if (
      result.choices &&
      Array.isArray(result.choices) &&
      result.choices.length > 0 &&
      result.choices[0].message &&
      typeof result.choices[0].message.content === "string"
    ) {
      wireframeDescription = result.choices[0].message.content;
    } else {
      // Fallback: stringifies the entire object if structure doesn't match
      wireframeDescription = JSON.stringify(result, null, 2);
    }

    // Convert Markdown to HTML using Marked and update the page
    document.getElementById("result").innerHTML =
      marked.parse(wireframeDescription);
  } catch (error) {
    console.error("Request failed:", error);
    document.getElementById("result").innerText =
      "Something went wrong. Try again!";
  }
}
