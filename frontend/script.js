// Nihongo Project Frontend Script

const API_URL = "http://localhost:8000";

document.getElementById("fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show loading
    document.getElementById("loading").classList.add("active");
    document.getElementById("resultSection").classList.remove("active");

    try {
        // Upload and process image
        const formData = new FormData();
        formData.append("file", file);

        // OCR Request
        const ocrResponse = await fetch(`${API_URL}/ocr`, {
            method: "POST",
            body: formData,
        });
        const ocrData = await ocrResponse.json();

        // Display OCR result
        document.getElementById("ocrResult").textContent = ocrData.text || "テキストが見つかりません";

        // Translation Request
        const translateResponse = await fetch(`${API_URL}/translate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: ocrData.text, target_lang: "en" }),
        });
        const translateData = await translateResponse.json();

        // Display translation result
        document.getElementById("translationResult").textContent = translateData.translated || "-";

        // Show results
        document.getElementById("resultSection").classList.add("active");
    } catch (error) {
        console.error("Error:", error);
        alert("エラーが発生しました");
    } finally {
        document.getElementById("loading").classList.remove("active");
    }
});

// JLPT Level Selection
async function loadJLPTWords(level) {
    try {
        const response = await fetch(`${API_URL}/jlpt/${level}`);
        const data = await response.json();
        console.log(`${level.toUpperCase()} Words:`, data);
        return data;
    } catch (error) {
        console.error("Error loading JLPT words:", error);
    }
}