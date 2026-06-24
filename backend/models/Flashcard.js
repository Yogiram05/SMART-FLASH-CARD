const mongoose = require("mongoose");

const flashcardSchema = mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    question: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Not Known"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Flashcard", flashcardSchema);