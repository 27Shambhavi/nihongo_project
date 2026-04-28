# script_detector.py — Japanese Script Detection Module
# Rule-based; no LLM.

def detect_scripts(text: str) -> dict:
    """
    Analyse text and return per-script counts, percentages, and sample chars.
    """
    counts = {
        "hiragana": 0,
        "katakana": 0,
        "kanji": 0,
        "latin": 0,
        "punctuation": 0,
        "other": 0,
    }
    samples = {k: [] for k in counts}

    for ch in text:
        code = ord(ch)
        if 0x3040 <= code <= 0x309F:
            counts["hiragana"] += 1
            if len(samples["hiragana"]) < 8:
                samples["hiragana"].append(ch)
        elif 0x30A0 <= code <= 0x30FF:
            counts["katakana"] += 1
            if len(samples["katakana"]) < 8:
                samples["katakana"].append(ch)
        elif (0x4E00 <= code <= 0x9FFF) or (0x3400 <= code <= 0x4DBF):
            counts["kanji"] += 1
            if len(samples["kanji"]) < 8:
                samples["kanji"].append(ch)
        elif ch.isascii() and not ch.isspace():
            if ch.isalpha() or ch.isdigit():
                counts["latin"] += 1
                if len(samples["latin"]) < 8:
                    samples["latin"].append(ch)
            else:
                counts["punctuation"] += 1
                if len(samples["punctuation"]) < 8:
                    samples["punctuation"].append(ch)
        elif ch in "。、！？「」『』（）〜・ー…":
            counts["punctuation"] += 1
            if len(samples["punctuation"]) < 8:
                samples["punctuation"].append(ch)
        elif not ch.isspace():
            counts["other"] += 1

    total = sum(counts.values()) or 1
    percentages = {k: round(v / total * 100, 1) for k, v in counts.items()}

    # Dominant script
    jp_scripts = {k: v for k, v in counts.items()
                  if k in ("hiragana", "katakana", "kanji")}
    dominant = max(jp_scripts, key=jp_scripts.get) if any(jp_scripts.values()) else "none"

    # Determine writing system label
    has_hiragana = counts["hiragana"] > 0
    has_katakana = counts["katakana"] > 0
    has_kanji    = counts["kanji"] > 0

    if has_hiragana and has_kanji and has_katakana:
        script_label = "Mixed (Hiragana + Katakana + Kanji)"
    elif has_hiragana and has_kanji:
        script_label = "Mixed (Hiragana + Kanji)"
    elif has_hiragana and has_katakana:
        script_label = "Mixed (Hiragana + Katakana)"
    elif has_hiragana:
        script_label = "Hiragana"
    elif has_katakana:
        script_label = "Katakana"
    elif has_kanji:
        script_label = "Kanji"
    elif counts["latin"] > 0:
        script_label = "Latin / English"
    else:
        script_label = "Unknown"

    return {
        "text": text,
        "counts": counts,
        "percentages": percentages,
        "samples": {k: "".join(v) for k, v in samples.items()},
        "dominant": dominant,
        "script_label": script_label,
        "is_japanese": has_hiragana or has_katakana or has_kanji,
    }
