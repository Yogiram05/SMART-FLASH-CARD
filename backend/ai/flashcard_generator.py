# Command-line Python entry point that converts notes into flashcard JSON.
import json
import sys

from preprocess import (
    build_frequency_map,
    clean_text,
    extract_keyword_candidates,
    load_nlp_pipeline,
    pick_context_sentence,
    split_paragraphs,
)


# Create a question from a keyword and its supporting sentence.
def build_flashcard(keyword, context_sentence):
    short_answer = context_sentence.strip()

    if len(short_answer) > 280:
        short_answer = short_answer[:277].rsplit(" ", 1)[0] + "..."

    question = f"What is {keyword}?"

    if keyword.lower().startswith(("a ", "an ", "the ")):
        question = f"Explain {keyword}."

    return {
        "question": question,
        "answer": short_answer,
        "status": "Not Known",
    }


# Turn a single paragraph into one or more flashcards.
def generate_from_paragraph(nlp, paragraph, max_cards=4):
    doc = nlp(paragraph)

    sentences = [
        sentence.text.strip()
        for sentence in doc.sents
        if sentence.text.strip()
    ]

    flashcards = []

    for sentence in sentences:

        if " is " in sentence:
            subject = sentence.split(" is ")[0].strip()

            flashcards.append({
                "question": f"What is {subject}?",
                "answer": sentence,
                "status": "Not Known"
            })

        elif " are " in sentence:
            subject = sentence.split(" are ")[0].strip()

            flashcards.append({
                "question": f"What are {subject}?",
                "answer": sentence,
                "status": "Not Known"
            })

    return flashcards


# Generate the full flashcard deck.
def generate_flashcards(notes):
    cleaned_notes = clean_text(notes)

    if not cleaned_notes.strip():
        return []

    nlp = load_nlp_pipeline()

    paragraphs = split_paragraphs(
        cleaned_notes
    )

    flashcards = []

    for paragraph in paragraphs:
        paragraph_cards = generate_from_paragraph(
            nlp,
            paragraph
        )

        flashcards.extend(paragraph_cards)

    unique_cards = []
    seen_questions = set()

    for card in flashcards:
        question_key = (
            card["question"]
            .strip()
            .lower()
        )

        if question_key in seen_questions:
            continue

        seen_questions.add(question_key)
        unique_cards.append(card)

    return unique_cards[:20]


# Read stdin from Node.js and return JSON.
def main():
    try:
        raw_input = sys.stdin.read().strip()

        payload = json.loads(
            raw_input or "{}"
        )

        notes = payload.get(
            "notes",
            ""
        )

        flashcards = generate_flashcards(
            notes
        )

        output = {
            "flashcards": flashcards,
            "meta": {
                "count": len(flashcards)
            }
        }

        sys.stdout.write(
            json.dumps(
                output,
                ensure_ascii=False
            )
        )

    except Exception as error:
        sys.stderr.write(str(error))
        sys.exit(1)


if __name__ == "__main__":
    main()