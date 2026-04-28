# jlpt.py — JLPT classifier (rule-based, no LLM)
# Classifies a block of text into N5-N1 based on vocabulary lookup
# and structural heuristics.

from jlpt_data import JLPT_DATA, GRAMMAR_PATTERNS


# ── Build lookup sets for O(1) word membership tests ────────────────────────
_WORD_LEVEL: dict[str, str] = {}   # word → lowest JLPT level
for _level in ["n5", "n4", "n3", "n2", "n1"]:
    for _entry in JLPT_DATA.get(_level, []):
        w = _entry["word"]
        if w not in _WORD_LEVEL:          # n5 registered first → kept
            _WORD_LEVEL[w] = _level


def _level_num(level: str) -> int:
    return {"n5": 5, "n4": 4, "n3": 3, "n2": 2, "n1": 1}.get(level, 0)


def get_words(level: str) -> list:
    return JLPT_DATA.get(level.lower(), [])


def get_all_levels() -> dict:
    return JLPT_DATA


def get_grammar(level: str) -> list:
    return GRAMMAR_PATTERNS.get(level.lower(), [])


def get_all_grammar() -> dict:
    return GRAMMAR_PATTERNS


def classify_jlpt_level(word: str) -> str:
    """Classify a single word into a JLPT level."""
    return _WORD_LEVEL.get(word, "unknown")


def classify_text(text: str) -> dict:
    """
    Classify a text passage into a JLPT difficulty band.

    Algorithm:
      1. Check each word in the JLPT vocabulary database.
      2. The 'hardest' recognised word determines the floor level.
      3. Sentence length and kanji density provide adjustments.
    """
    import re

    # Tokenise very simply (split on spaces; also try sub-string matches)
    tokens = re.findall(r'[\u3040-\u30ff\u4e00-\u9fff]+', text)
    char_count = len([c for c in text if not c.isspace()])
    kanji_count = sum(1 for c in text if '\u4e00' <= c <= '\u9fff')

    matched_words = []
    level_votes   = {"n5": 0, "n4": 0, "n3": 0, "n2": 0, "n1": 0}

    # substring scan against known vocabulary
    for word, level in _WORD_LEVEL.items():
        if word in text:
            matched_words.append({"word": word, "level": level})
            level_votes[level] += 1

    # Determine ceiling by 'hardest' word found
    hard_level = "n5"
    for word_info in matched_words:
        if _level_num(word_info["level"]) < _level_num(hard_level):
            hard_level = word_info["level"]

    # Heuristic adjustments
    kanji_ratio = kanji_count / char_count if char_count else 0
    if char_count > 100 and _level_num(hard_level) > 3:
        hard_level = "n3"  # long complex text → at least n3
    if kanji_ratio > 0.4 and _level_num(hard_level) > 2:
        hard_level = "n2"  # kanji-heavy

    # Confidence score (0-100)
    total_votes = sum(level_votes.values()) or 1
    confidence  = min(100, int((level_votes.get(hard_level, 0) / total_votes) * 100 + 40))

    return {
        "text": text[:200],          # truncate for response size
        "level": hard_level,
        "level_display": hard_level.upper(),
        "confidence": confidence,
        "matched_words": matched_words[:20],   # first 20
        "level_votes": level_votes,
        "stats": {
            "char_count": char_count,
            "kanji_count": kanji_count,
            "kanji_ratio": round(kanji_ratio * 100, 1),
        },
        "description": _level_desc(hard_level),
    }


def _level_desc(level: str) -> str:
    desc = {
        "n5": "Beginner — Basic greetings, simple vocabulary.",
        "n4": "Elementary — Everyday expressions, simple sentences.",
        "n3": "Intermediate — Common topics, varied sentence patterns.",
        "n2": "Upper-Intermediate — Complex grammar, newspapers.",
        "n1": "Advanced — Abstract topics, formal writing, literature.",
    }
    return desc.get(level, "Unknown level.")