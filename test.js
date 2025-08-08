// index.js
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyA29rmo77UMZzbtZh6KFax2GmSYcpCNi-8" // Keep this secret
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.candidates[0].content.parts[0].text;
    res.json({ text });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(5000, () => console.log("API running on http://localhost:5000"));
