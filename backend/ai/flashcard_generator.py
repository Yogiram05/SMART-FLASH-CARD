import json
import sys

from preprocess import (
    clean_text,
    load_nlp_pipeline,
    split_paragraphs,
)


def build_flashcard(question, answer):
    return {
        "question": question,
        "answer": answer,
        "status": "Not Known",
    }


def generate_from_paragraph(nlp, paragraph, max_cards=10):
    doc = nlp(paragraph)

    sentences = [
        sentence.text.strip()
        for sentence in doc.sents
        if sentence.text.strip()
    ]

    flashcards = []

    for sentence in sentences:

        sentence = sentence.strip().rstrip(".")

        words = sentence.split()

        if len(words) < 3:
            continue

        subject = words[0]

        flashcards.append(
            build_flashcard(
                f"What is {subject}?",
                sentence + "."
            )
        )

        if len(flashcards) >= max_cards:
            break

    return flashcards


def generate_flashcards(notes):
    cleaned_notes = clean_text(notes)

    if not cleaned_notes.strip():
        return []

    nlp = load_nlp_pipeline()

    paragraphs = split_paragraphs(cleaned_notes)

    flashcards = []

    for paragraph in paragraphs:
        flashcards.extend(
            generate_from_paragraph(
                nlp,
                paragraph
            )
        )

    unique_cards = []
    seen_questions = set()

    for card in flashcards:
        key = card["question"].lower().strip()

        if key in seen_questions:
            continue

        seen_questions.add(key)
        unique_cards.append(card)

    return unique_cards[:20]


def main():
    try:
        raw_input = sys.stdin.read().strip()

        payload = json.loads(raw_input or "{}")

        notes = payload.get("notes", "")

        flashcards = generate_flashcards(notes)

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