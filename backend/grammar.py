# grammar.py — Rule-based Japanese Grammar Analyzer (no LLM)

import re

# ── Particle definitions ─────────────────────────────────────────────────────
PARTICLES = [
    # Sort longer first so greedy matching works correctly
    ("なければならない", "necessity",    "must do",                     "verb"),
    ("ことができる",   "ability",       "can do / able to",           "verb"),
    ("てください",    "request",       "please do",                  "te-form"),
    ("ていない",      "neg-prog",      "is not doing",               "te-form"),
    ("ている",        "progressive",   "is doing (ongoing)",         "te-form"),
    ("ましょう",      "suggestion",    "let's …",                    "verb"),
    ("ません",        "neg-polite",    "does not (polite)",          "verb"),
    ("ました",        "past-polite",   "did (polite past)",          "verb"),
    ("だった",        "past",          "was",                        "copula"),
    ("はずだ",        "expectation",   "should be / expected to",    "verb"),
    ("べきだ",        "obligation",    "should / ought to",          "verb"),
    ("そうだ",        "hearsay",       "I heard that / looks like",  "verb"),
    ("ようだ",        "inference",     "it seems / it looks like",   "verb"),
    ("らしい",        "appearance",    "seems like / apparently",    "verb"),
    ("たい",          "desire",        "want to",                    "verb"),
    ("から",          "source",        "from / because",             "case"),
    ("まで",          "extent",        "until / up to",              "case"),
    ("より",          "comparison",    "than (comparison)",          "case"),
    ("です",          "copula-pol",    "is / am / are (polite)",     "copula"),
    ("ます",          "polite",        "polite verb ending",         "verb"),
    ("だ",            "copula",        "is / am / are (plain)",      "copula"),
    ("は",            "topic",         "as for … (topic marker)",    "case"),
    ("が",            "subject",       "subject marker",             "case"),
    ("を",            "object",        "direct object marker",       "case"),
    ("に",            "location",      "to / at / for",              "case"),
    ("で",            "location-act",  "at / by means of",           "case"),
    ("と",            "and-with",      "and / with / that",          "case"),
    ("か",            "question",      "question marker",            "ending"),
    ("ね",            "confirmation",  "right? / isn't it?",         "ending"),
    ("よ",            "assertion",     "you know / I tell you",      "ending"),
    ("て",            "te-form",       "te-form connector",          "te-form"),
    ("の",            "nominalizer",   "nominalizer / 's",           "case"),
    ("も",            "also",          "also / too / even",          "case"),
    ("へ",            "direction",     "toward (direction)",         "case"),
]

# ── Grammar pattern rules ────────────────────────────────────────────────────
# (regex, description, suggested_level)
GRAMMAR_PATTERNS = [
    # N5
    (r".+は.+です",        "Topic + Copula (XはYです)",       "n5"),
    (r".+が.+です",        "Subject + Copula (XがYです)",     "n5"),
    (r".+を.+",            "Direct object (Xを)",             "n5"),
    (r".+に行",            "Going to a place (～に行く)",      "n5"),
    (r".+てください",      "Polite request (～てください)",    "n5"),
    (r".+ましょう",        "Invitation / let's (ましょう)",   "n5"),
    (r".+ています",        "Progressive (～ています)",        "n5"),
    (r".+たい",            "Wanting to (～たい)",             "n5"),
    (r".+ことができ",      "Can/ability (～ことができる)",    "n5"),
    # N4
    (r".+なければならない", "Must do (～なければならない)",   "n4"),
    (r".+はずだ",          "Expectation (～はずだ)",          "n4"),
    (r".+そうだ",          "Hearsay/appearance (～そうだ)",   "n4"),
    (r".+ようだ",          "Inference (～ようだ)",            "n4"),
    (r".+らしい",          "Probability (～らしい)",          "n4"),
    # N3
    (r".+べきだ",          "Obligation (～べきだ)",           "n3"),
    (r".+ため[に]",        "Purpose (～ために)",              "n3"),
    (r".+ながら",          "While doing (～ながら)",          "n3"),
    (r".+のに",            "Despite / although (～のに)",     "n3"),
    # N2
    (r".+にもかかわらず",  "Despite (～にもかかわらず)",     "n2"),
    (r".+に対[しし]て",   "In relation to (～に対して)",    "n2"),
    # N1
    (r".+にほかならない",  "Nothing but (～にほかならない)", "n1"),
    (r".+をもって",        "By means of (～をもって)",       "n1"),
]

LEVEL_ORDER = {"n5": 5, "n4": 4, "n3": 3, "n2": 2, "n1": 1}


# ── Helpers ──────────────────────────────────────────────────────────────────
def _find_particles(sentence: str) -> list:
    found = []
    seen  = set()
    for particle, ptype, meaning, category in PARTICLES:
        if particle in sentence and particle not in seen:
            # find all positions
            start = 0
            while True:
                idx = sentence.find(particle, start)
                if idx == -1:
                    break
                found.append({
                    "particle": particle,
                    "type": ptype,
                    "meaning": meaning,
                    "category": category,
                    "position": idx,
                })
                start = idx + 1
            seen.add(particle)
    # sort by position in sentence
    found.sort(key=lambda x: x["position"])
    return found


def _match_patterns(sentence: str) -> list:
    matched = []
    for pattern, desc, level in GRAMMAR_PATTERNS:
        if re.search(pattern, sentence):
            matched.append({
                "pattern": pattern,
                "description": desc,
                "level": level,
            })
    return matched


def _highest_level(patterns: list) -> str | None:
    if not patterns:
        return None
    return min(patterns, key=lambda p: LEVEL_ORDER.get(p["level"], 99))["level"]


# ── Public API ───────────────────────────────────────────────────────────────
def analyze_grammar(sentence: str) -> dict:
    """Full grammar analysis of a Japanese sentence."""
    particles = _find_particles(sentence)
    patterns  = _match_patterns(sentence)
    level     = _highest_level(patterns)

    # Sentence structure heuristic
    structure_parts = []
    for p in particles:
        if p["type"] == "topic":
            structure_parts.append("Topic")
        elif p["type"] == "subject":
            structure_parts.append("Subject")
        elif p["type"] == "object":
            structure_parts.append("Object")
        elif p["type"] in ("copula", "copula-pol"):
            structure_parts.append("Predicate")
        elif p["type"] == "polite":
            structure_parts.append("Verb(polite)")
    structure = " → ".join(dict.fromkeys(structure_parts)) or "Undetermined"

    explanation = []
    if particles:
        explanation.append(f"Found {len(particles)} particle(s): "
                           + ", ".join(p["particle"] for p in particles[:6]))
    if patterns:
        explanation.append(f"Matched {len(patterns)} grammar pattern(s).")
    if level:
        explanation.append(f"Estimated difficulty: JLPT {level.upper()}")

    return {
        "original": sentence,
        "particles": particles,
        "patterns": patterns,
        "sentence_structure": structure,
        "estimated_level": level,
        "explanation": explanation,
    }


def get_grammar_info(particle: str) -> dict | None:
    """Return info dict for a specific particle string."""
    for p, ptype, meaning, category in PARTICLES:
        if p == particle:
            return {"type": ptype, "meaning": meaning, "category": category}
    return None


def analyze_sentence_structure(sentence: str) -> dict:
    """Break a sentence into labeled token chunks based on particles."""
    particles = _find_particles(sentence)
    components = []

    prev = 0
    for info in particles:
        idx = info["position"]
        chunk = sentence[prev:idx]
        if chunk:
            components.append({"text": chunk, "role": "content"})
        components.append({
            "text": info["particle"],
            "role": "particle",
            "meaning": info["meaning"],
            "type": info["type"],
        })
        prev = idx + len(info["particle"])
    tail = sentence[prev:]
    if tail:
        components.append({"text": tail, "role": "content"})

    return {"sentence": sentence, "components": components}