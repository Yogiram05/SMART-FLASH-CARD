const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    generateFlashcards,
    saveFlashcards,
    getFlashcards,
    updateFlashcard,
    deleteFlashcard
} = require("../controllers/flashcardController");

// Protect every flashcard route with JWT middleware.
router.post("/generate", protect, generateFlashcards);
router.post("/save", protect, saveFlashcards);
router.get("/", protect, getFlashcards);
router.put("/:id", protect, updateFlashcard);
router.delete("/:id", protect, deleteFlashcard);

module.exports = router;