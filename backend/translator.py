# translator.py — Rule-based + MyMemory API translation
# No local LLM. Uses the free MyMemory translation REST API as primary,
# with a phonetic rule-based romanisation as fallback.

import re
import unicodedata
import requests

# ── MyMemory free API (no key needed, 5 000 words/day) ──────────────────────
MYMEMORY_URL = "https://api.mymemory.translated.net/get"
REQUEST_TIMEOUT = 5  # seconds

# ── Simple kana → romaji lookup (for fallback display only) ─────────────────
HIRAGANA_ROMAJI = {
    "あ":"a","い":"i","う":"u","え":"e","お":"o",
    "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
    "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
    "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
    "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
    "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
    "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
    "や":"ya","ゆ":"yu","よ":"yo",
    "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
    "わ":"wa","を":"wo","ん":"n",
    "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
    "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
    "だ":"da","ぢ":"di","づ":"du","で":"de","ど":"do",
    "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
    "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
}
KATAKANA_ROMAJI = {
    chr(ord(k) + 0x60): v for k, v in HIRAGANA_ROMAJI.items()
    if 0x3041 <= ord(k) <= 0x3096
}


def _to_romaji(text: str) -> str:
    """Very basic kana → romaji for fallback."""
    result = []
    for ch in text:
        if ch in HIRAGANA_ROMAJI:
            result.append(HIRAGANA_ROMAJI[ch])
        elif ch in KATAKANA_ROMAJI:
            result.append(KATAKANA_ROMAJI[ch])
        else:
            result.append(ch)
    return "".join(result)


def detect_language(text: str) -> str:
    """Detect whether text is Japanese or likely Latin/English."""
    jp_chars = sum(
        1 for ch in text
        if ('\u3040' <= ch <= '\u30ff') or ('\u4e00' <= ch <= '\u9faf')
    )
    return "ja" if jp_chars > len(text) * 0.1 else "en"


def _api_translate(text: str, src: str, tgt: str) -> str | None:
    """Call MyMemory API. Returns translated string or None on failure."""
    try:
        resp = requests.get(
            MYMEMORY_URL,
            params={"q": text, "langpair": f"{src}|{tgt}"},
            timeout=REQUEST_TIMEOUT,
        )
        if resp.status_code == 200:
            data = resp.json()
            if data.get("responseStatus") == 200:
                translated = data["responseData"]["translatedText"]
                if translated and translated.upper() != text.upper():
                    return translated
    except Exception:
        pass
    return None


def translate(text: str, target_lang: str = "en") -> dict:
    """
    Translate text.
    Strategy:
      1. Detect source language
      2. Try MyMemory API
      3. Fall back to romaji + note
    """
    if not text.strip():
        return {"original": text, "translated": "", "source_lang": "unknown",
                "target_lang": target_lang, "method": "none"}

    src_lang = detect_language(text)

    # ── Determine API langpair ───────────────────────────────────────────────
    if target_lang == "en":
        api_src, api_tgt = src_lang if src_lang != "en" else "ja", "en"
    elif target_lang == "ja":
        api_src, api_tgt = "en", "ja"
    else:
        api_src, api_tgt = src_lang, target_lang

    translated = _api_translate(text, api_src, api_tgt)
    method = "mymemory_api"

    if translated is None:
        # Fallback: romanise (only useful for Japanese → display)
        translated = _to_romaji(text)
        method = "romaji_fallback"

    return {
        "original": text,
        "translated": translated,
        "source_lang": src_lang,
        "target_lang": target_lang,
        "method": method,
    }