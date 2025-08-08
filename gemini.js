import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyA29rmo77UMZzbtZh6KFax2GmSYcpCNi-8'; // replace with your actual API key
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;

export const fetchGeminiTips = async () => {
  const prompt = "Give me 10 short new useful tips  each 2 lines related to food ,expiry and medicine usage. Reply only as an array of strings.";

  try {
    const response = await axios.post(GEMINI_ENDPOINT, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const rawText = response.data.candidates[0].content.parts[0].text;
    
   const cleanedText = rawText
      .replace(/```json|```|'''json|'''/g, '')
      .trim();

    // Now try to parse
    const tips = JSON.parse(cleanedText);
    return tips;
  } catch (error) {
    console.error('Gemini error:', error);
    return ['Eating nutritious foods like apples daily strengthens your immune system and overall health, helping you avoid frequent visits to the doctor. 🍎👨‍⚕️'];
  }
};
