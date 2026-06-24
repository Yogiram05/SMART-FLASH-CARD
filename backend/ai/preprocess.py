# Text preprocessing utilities used by the Python flashcard generator.

import re
from collections import Counter

import spacy


# Load spaCy model
def load_nlp_pipeline():
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        nlp = spacy.blank("en")

        if "sentencizer" not in nlp.pipe_names:
            nlp.add_pipe("sentencizer")

        return nlp


# Clean raw notes
def clean_text(text):
    if not text:
        return ""

    text = text.replace("\r\n", "\n")

    paragraphs = [
        re.sub(r"\s+", " ", paragraph).strip()
        for paragraph in text.split("\n\n")
    ]

    paragraphs = [p for p in paragraphs if p]

    return "\n\n".join(paragraphs)


# Split paragraphs
def split_paragraphs(text):
    cleaned_text = clean_text(text)

    if not cleaned_text:
        return []

    return [
        paragraph.strip()
        for paragraph in cleaned_text.split("\n\n")
        if paragraph.strip()
    ]


# Extract keywords
def extract_keyword_candidates(doc, limit=12):
    candidates = []

    # Named entities
    for entity in doc.ents:
        candidate = entity.text.strip()

        if candidate:
            candidates.append(candidate)

    # Noun chunks
    try:
        for chunk in doc.noun_chunks:
            candidate = chunk.text.strip()

            if candidate and len(candidate.split()) <= 5:
                candidates.append(candidate)

    except Exception:
        pass

    # Important nouns
    for token in doc:

        if token.is_stop:
            continue

        if token.is_punct:
            continue

        if token.is_space:
            continue

        if token.pos_ in {"NOUN", "PROPN"}:

            if len(token.text) > 2:

                lemma = token.lemma_.strip()

                if lemma:
                    candidates.append(lemma)

    filtered = []
    seen = set()

    for candidate in candidates:

        normalized = re.sub(
            r"\s+",
            " ",
            candidate
        ).strip(" .,:;!?\"'()[]{}")

        key = normalized.lower()

        if not normalized:
            continue

        if key in seen:
            continue

        seen.add(key)
        filtered.append(normalized)

        if len(filtered) >= limit:
            break

    return filtered


# Find best supporting sentence
def pick_context_sentence(sentences, keyword):

    keyword_lower = keyword.lower()

    for sentence in sentences:

        if keyword_lower in sentence.lower():
            return sentence.strip()

    if sentences:
        return sentences[0].strip()

    return ""


# Fallback frequency map
def build_frequency_map(doc):

    counts = Counter()

    for token in doc:

        if token.is_stop:
            continue

        if token.is_punct:
            continue

        if token.is_space:
            continue

        if token.pos_ in {"NOUN", "PROPN", "ADJ"}:

            lemma = token.lemma_.lower()

            if len(lemma) > 2:
                counts[lemma] += 1

    return counts