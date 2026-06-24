const path = require("path");
const { spawn } = require("child_process");
const Flashcard = require("../models/Flashcard");

// Run the Python generator and return its JSON output.
const runPythonGenerator = (notes) => {
    return new Promise((resolve, reject) => {
        const pythonExecutable = process.env.PYTHON_BIN || "python";
        const scriptPath = path.join(__dirname, "..", "..", "ai", "flashcard_generator.py");
        const pythonProcess = spawn(pythonExecutable, [scriptPath], {
            env: {
                ...process.env,
                PYTHONIOENCODING: "utf-8"
            }
        });

        let stdout = "";
        let stderr = "";

        pythonProcess.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        pythonProcess.on("error", (error) => {
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(stderr || "Python generator exited with an error."));
            }

            try {
                const parsed = JSON.parse(stdout || "{}");
                return resolve(parsed);
            } catch (error) {
                return reject(new Error(`Invalid JSON from Python generator: ${error.message}`));
            }
        });

        pythonProcess.stdin.write(JSON.stringify({ notes }));
        pythonProcess.stdin.end();
    });
};

// Generate flashcards from raw notes through the Python NLP module.
const generateFlashcards = async (req, res) => {
    try {
        const { notes } = req.body;

        if (!notes || !notes.trim()) {
            return res.status(400).json({ message: "Notes are required to generate flashcards." });
        }

        const result = await runPythonGenerator(notes);

        return res.status(200).json({
            message: "Flashcards generated successfully.",
            flashcards: result.flashcards || []
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Save a batch of generated flashcards for the current user.
const saveFlashcards = async (req, res) => {
    try {
        const { flashcards } = req.body;

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            return res.status(400).json({ message: "Flashcards array is required." });
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
            return res.status(400).json({ message: "No valid flashcards were provided." });
        }

        const savedFlashcards = await Flashcard.insertMany(documents);

        return res.status(201).json({
            message: "Flashcards saved successfully.",
            flashcards: savedFlashcards
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Fetch all flashcards belonging to the authenticated user.
const getFlashcards = async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ userId: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: flashcards.length,
            flashcards
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update a flashcard that belongs to the authenticated user.
const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, status } = req.body;

        const flashcard = await Flashcard.findOne({ _id: id, userId: req.user._id });

        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard not found." });
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
        return res.status(500).json({ message: error.message });
    }
};

// Delete a flashcard that belongs to the authenticated user.
const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;

        const flashcard = await Flashcard.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard not found." });
        }

        return res.status(200).json({ message: "Flashcard deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateFlashcards,
    saveFlashcards,
    getFlashcards,
    updateFlashcard,
    deleteFlashcard
};