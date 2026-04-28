# main.py — FastAPI Application Entry Point
# nihongo_project backend

from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import ocr
import translator
import grammar
import script_detector
import jlpt
import kanji_db

# ── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Nihongo Project API",
    description="AI-based Japanese Language Learning Assistant (rule-based)",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Root ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Meta"])
def root():
    return {
        "message": "Nihongo Project API v2",
        "endpoints": ["/ocr", "/translate", "/grammar/analyze",
                      "/jlpt/classify", "/script/detect"],
    }


# ── OCR ──────────────────────────────────────────────────────────────────────
@app.post("/ocr", tags=["OCR"])
async def process_image(file: UploadFile = File(...)):
    """Upload an image to extract Japanese text via Tesseract OCR."""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    content = await file.read()
    text     = ocr.extract_japanese_text(content)
    analysis = ocr.analyze_text(text)
    return {"text": text, "analysis": analysis}


@app.get("/ocr/char-type/{char}", tags=["OCR"])
def get_char_type(char: str):
    """Return the script type for a single character."""
    return {"char": char, "type": ocr.detect_character_type(char)}


# ── Translation ───────────────────────────────────────────────────────────────
class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "en"   # "en" or "ja"


@app.post("/translate", tags=["Translation"])
def translate_text(request: TranslateRequest):
    """Translate Japanese ↔ English using the MyMemory API."""
    return translator.translate(request.text, request.target_lang)


@app.get("/translate/detect", tags=["Translation"])
def detect_lang(text: str = Query(..., description="Text to detect")):
    """Detect whether the input text is Japanese or English."""
    return {"language": translator.detect_language(text), "text": text}


# ── Grammar ───────────────────────────────────────────────────────────────────
class GrammarRequest(BaseModel):
    sentence: str


@app.post("/grammar/analyze", tags=["Grammar"])
def analyze_grammar(request: GrammarRequest):
    """Full grammar analysis: particles, patterns, sentence structure."""
    return grammar.analyze_grammar(request.sentence)


@app.post("/grammar/structure", tags=["Grammar"])
def analyze_structure(request: GrammarRequest):
    """Segment a sentence into labeled chunks based on particles."""
    return grammar.analyze_sentence_structure(request.sentence)


@app.get("/grammar/particle/{particle}", tags=["Grammar"])
def get_particle_info(particle: str):
    """Return grammar information for a specific particle."""
    info = grammar.get_grammar_info(particle)
    if info:
        return {"particle": particle, **info}
    raise HTTPException(status_code=404, detail=f"Particle '{particle}' not found.")


# ── JLPT ──────────────────────────────────────────────────────────────────────
@app.get("/jlpt/classify", tags=["JLPT"])
def classify_text(text: str = Query(..., description="Text to classify")):
    """Classify text into a JLPT difficulty level (N5–N1)."""
    return jlpt.classify_text(text)


# kept for backward compat with spec
@app.get("/jlpt/classify/{text}", tags=["JLPT"])
def classify_text_path(text: str):
    """Classify text (path param version)."""
    return jlpt.classify_text(text)


@app.get("/jlpt/{level}", tags=["JLPT"])
def get_jlpt_words(level: str):
    """Get vocabulary list for a JLPT level (n5/n4/n3/n2/n1)."""
    words = jlpt.get_words(level)
    if not words:
        raise HTTPException(status_code=404, detail=f"No data for level '{level}'.")
    return {"level": level, "words": words}


@app.get("/jlpt/grammar/{level}", tags=["JLPT"])
def get_grammar_patterns(level: str):
    """Get grammar patterns for a JLPT level."""
    patterns = jlpt.get_grammar(level)
    return {"level": level, "patterns": patterns}


# ── Script Detection ──────────────────────────────────────────────────────────
@app.get("/script/detect", tags=["Script"])
def detect_script(text: str = Query(..., description="Text to analyse")):
    """Detect which Japanese scripts are present in the text."""
    return script_detector.detect_scripts(text)


# kept for backward compat with spec
@app.get("/script/detect/{text}", tags=["Script"])
def detect_script_path(text: str):
    """Detect scripts (path param version)."""
    return script_detector.detect_scripts(text)


# ── Kanji Lookup & Furigana ───────────────────────────────────────────────────
@app.get("/kanji/lookup/{char}", tags=["Kanji"])
def lookup_kanji(char: str):
    """Look up a single kanji character: readings, meaning, stroke count."""
    if len(char) != 1:
        raise HTTPException(status_code=400, detail="Provide exactly one character.")
    info = kanji_db.lookup_kanji(char)
    if info:
        return {"char": char, **info}
    raise HTTPException(status_code=404, detail=f"Kanji '{char}' not in database.")


@app.get("/kanji/daily", tags=["Kanji"])
def daily_kanji(seed: int = 0):
    """Return the 'kanji of the day' based on a numeric seed (use day-of-year)."""
    return kanji_db.get_daily_kanji(seed)


class FuriganaRequest(BaseModel):
    text: str


@app.post("/kanji/furigana", tags=["Kanji"])
def annotate_furigana(request: FuriganaRequest):
    """Annotate Japanese text with furigana readings for each segment."""
    segments = kanji_db.annotate_furigana(request.text)
    return {"text": request.text, "segments": segments}