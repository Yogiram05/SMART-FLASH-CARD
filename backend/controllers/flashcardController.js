const { GoogleGenAI } = require("@google/genai");
const Flashcard = require("../models/Flashcard");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Generate flashcards using Gemini AI
const generateFlashcards = async (req, res) => {
    try {
        const { notes } = req.body;

        if (!notes || !notes.trim()) {
            return res.status(400).json({
                message: "Notes are required."
            });
        }

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

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let text = response.text.trim();

        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");

        const flashcards = JSON.parse(text);

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

// Save flashcards
const saveFlashcards = async (req, res) => {
    try {
        const { flashcards } = req.body;

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            return res.status(400).json({
                message: "Flashcards array is required."
            });
        }

        const documents = flashcards
            .filter((card) => card && card.question && card.answer)
            .map((card) => ({
                userId: req.user._id,
                question: card.question.trim(),
                answer: card.answer.trim(),
                status: card.status || "Not Known"
            }));

        if (documents.length === 0) {
            return res.status(400).json({
                message: "No valid flashcards were provided."
            });
        }

        const savedFlashcards = await Flashcard.insertMany(documents);

        return res.status(201).json({
            message: "Flashcards saved successfully.",
            flashcards: savedFlashcards
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Get flashcards
const getFlashcards = async (req, res) => {
    try {
        const flashcards = await Flashcard
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: flashcards.length,
            flashcards
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Update flashcard
const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, status } = req.body;

        const flashcard = await Flashcard.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({
                message: "Flashcard not found."
            });
        }

        if (question !== undefined) {
            flashcard.question = question.trim();
        }

        if (answer !== undefined) {
            flashcard.answer = answer.trim();
        }

        if (status !== undefined) {
            flashcard.status = status;
        }

        const updatedFlashcard = await flashcard.save();

        return res.status(200).json({
            message: "Flashcard updated successfully.",
            flashcard: updatedFlashcard
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Delete flashcard
const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;

        const flashcard = await Flashcard.findOneAndDelete({
            _id: id,
            userId: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({
                message: "Flashcard not found."
            });
        }

        return res.status(200).json({
            message: "Flashcard deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    generateFlashcards,
    saveFlashcards,
    getFlashcards,
    updateFlashcard,
    deleteFlashcard
};