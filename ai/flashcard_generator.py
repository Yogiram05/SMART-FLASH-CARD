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
    sentences = [sentence.text.strip() for sentence in doc.sents if sentence.text.strip()]
    keywords = extract_keyword_candidates(doc, limit=max_cards * 2)

    if not keywords:
        frequency_map = build_frequency_map(doc)
        keywords = [item[0] for item in frequency_map.most_common(max_cards)]

    flashcards = []
    seen_questions = set()

    for keyword in keywords:
        context_sentence = pick_context_sentence(sentences, keyword)
        if not context_sentence:
            continue

        flashcard = build_flashcard(keyword, context_sentence)
        normalized_question = flashcard["question"].lower()
        if normalized_question in seen_questions:
            continue

        seen_questions.add(normalized_question)
        flashcards.append(flashcard)

        if len(flashcards) >= max_cards:
            break

    if not flashcards and sentences:
        flashcards.append({
            "question": "What is the main idea of this paragraph?",
            "answer": sentences[0][:280],
            "status": "Not Known",
        })

    return flashcards


# Generate the full flashcard deck across all paragraphs.
def generate_flashcards(notes):
    cleaned_notes = clean_text(notes)
    if not cleaned_notes.strip():
        return []

    nlp = load_nlp_pipeline()
    paragraphs = split_paragraphs(cleaned_notes)
    flashcards = []

    for paragraph in paragraphs:
        paragraph_cards = generate_from_paragraph(nlp, paragraph)
        flashcards.extend(paragraph_cards)

    unique_cards = []
    seen_questions = set()

    for card in flashcards:
        question_key = card["question"].strip().lower()
        if question_key in seen_questions:
            continue
        seen_questions.add(question_key)
        unique_cards.append(card)

    return unique_cards[:20]


# Read stdin from Node.js, generate cards, and print JSON only.
def main():
    try:
        raw_input = sys.stdin.read().strip()
        payload = json.loads(raw_input or "{}")
        notes = payload.get("notes", "")

        flashcards = generate_flashcards(notes)

        output = {
            "flashcards": flashcards,
            "meta": {
                "count": len(flashcards),
            },
        }

        sys.stdout.write(json.dumps(output, ensure_ascii=False))
    except Exception as error:
        sys.stderr.write(str(error))
        sys.exit(1)


if __name__ == "__main__":
    main()
