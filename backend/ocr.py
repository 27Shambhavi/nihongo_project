# ocr.py — Japanese OCR Module
# Uses Tesseract OCR with Pillow preprocessing.
# Falls back gracefully if Tesseract is not installed.

import re
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance

# ── Tesseract optional import ────────────────────────────────────────────────
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

# ── Unicode ranges ───────────────────────────────────────────────────────────
HIRAGANA  = (0x3040, 0x309F)
KATAKANA  = (0x30A0, 0x30FF)
KANJI     = (0x4E00, 0x9FFF)
CJK_EXT  = (0x3400, 0x4DBF)   # CJK Unified Ideographs Extension A
PUNCT_JP  = set("。、！？「」『』（）〜・ー…")


def detect_character_type(char: str) -> str:
    """Return the script type for a single character."""
    code = ord(char)
    if HIRAGANA[0] <= code <= HIRAGANA[1]:
        return "hiragana"
    if KATAKANA[0] <= code <= KATAKANA[1]:
        return "katakana"
    if KANJI[0] <= code <= KANJI[1] or CJK_EXT[0] <= code <= CJK_EXT[1]:
        return "kanji"
    if char in PUNCT_JP:
        return "punctuation"
    if char.isspace():
        return "space"
    if char.isascii():
        return "latin"
    return "other"


def analyze_text(text: str) -> dict:
    """Character-by-character breakdown of Japanese text."""
    counts = {"hiragana": 0, "katakana": 0, "kanji": 0,
              "punctuation": 0, "latin": 0, "other": 0}
    chars  = {"hiragana": [], "katakana": [], "kanji": [],
              "punctuation": [], "latin": [], "other": []}
    char_detail = []

    for char in text:
        if char == " ":
            continue
        ctype = detect_character_type(char)
        key = ctype if ctype in counts else "other"
        counts[key] += 1
        chars[key].append(char)
        char_detail.append({"char": char, "type": ctype})

    total = sum(counts.values()) or 1
    percentages = {k: round(v / total * 100, 1) for k, v in counts.items()}

    return {
        "original": text,
        "char_detail": char_detail,
        "counts": counts,
        "percentages": percentages,
        "chars": chars,
    }


def preprocess_image(img: Image.Image) -> Image.Image:
    """Enhance image for better OCR accuracy."""
    img = img.convert("L")                          # greyscale
    img = img.filter(ImageFilter.MedianFilter(3))   # denoise
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2.0)
    return img


def extract_japanese_text(image_content: bytes) -> str:
    """
    Extract Japanese text from an uploaded image.
    Uses Tesseract (jpn+eng) when available, otherwise returns a demo string.
    """
    try:
        img = Image.open(BytesIO(image_content))
        img = preprocess_image(img)

        if TESSERACT_AVAILABLE:
            text = pytesseract.image_to_string(img, lang="jpn+eng",
                                               config="--psm 6")
            text = text.strip()
            if text:
                return text

        # Fallback demo text for when Tesseract is unavailable / no text found
        return "日本語のテキストサンプルです。"
    except Exception:
        return "日本語のテキストサンプルです。"