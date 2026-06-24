const generateFlashcards = async (req, res) => {
    try {
        const { notes } = req.body;

        if (!notes || !notes.trim()) {
            return res.status(400).json({
                message: "Notes are required."
            });
        }

        console.log(
            "API KEY =",
            process.env.GEMINI_API_KEY ? "FOUND" : "NOT FOUND"
        );

        const prompt = `
Generate study flashcards from the notes below.

Return ONLY valid JSON.

Format:

[
  {
    "question":"...",
    "answer":"...",
    "status":"Not Known"
  }
]

Rules:
- Create meaningful questions.
- Answers should be clear and concise.
- Generate 5 to 10 flashcards.

Notes:
${notes}
`;

        let response;

        try {
            response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt
            });
        } catch (geminiError) {
            console.error("Gemini Error:", geminiError);

            return res.status(500).json({
                message: "Gemini AI is busy. Please try again after a few seconds."
            });
        }

        let text = response.text.trim();

        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");
        text = text.trim();

        let flashcards;

        try {
            flashcards = JSON.parse(text);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.log("Gemini Output:", text);

            return res.status(500).json({
                message: "Invalid response received from Gemini."
            });
        }

        return res.status(200).json({
            message: "Flashcards generated successfully.",
            flashcards
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
};