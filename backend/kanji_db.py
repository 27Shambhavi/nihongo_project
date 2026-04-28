# kanji_db.py — Built-in kanji dictionary for lookup & furigana
# Rule-based, no LLM. Contains ~120 common JLPT kanji.

KANJI_DB = {
    # ── N5 ────────────────────────────────────────────────────────────────────
    "日": {"on": ["ニチ","ジツ"], "kun": ["ひ","か"], "meaning": "sun, day",        "strokes": 4,  "level": "n5", "examples": [{"word":"日本","read":"にほん","meaning":"Japan"},{"word":"今日","read":"きょう","meaning":"today"}]},
    "月": {"on": ["ゲツ","ガツ"], "kun": ["つき"],    "meaning": "moon, month",     "strokes": 4,  "level": "n5", "examples": [{"word":"月曜日","read":"げつようび","meaning":"Monday"},{"word":"来月","read":"らいげつ","meaning":"next month"}]},
    "火": {"on": ["カ"],         "kun": ["ひ"],       "meaning": "fire",            "strokes": 4,  "level": "n5", "examples": [{"word":"火曜日","read":"かようび","meaning":"Tuesday"},{"word":"花火","read":"はなび","meaning":"fireworks"}]},
    "水": {"on": ["スイ"],       "kun": ["みず"],     "meaning": "water",           "strokes": 4,  "level": "n5", "examples": [{"word":"水曜日","read":"すいようび","meaning":"Wednesday"},{"word":"水泳","read":"すいえい","meaning":"swimming"}]},
    "木": {"on": ["モク","ボク"], "kun": ["き","こ"],  "meaning": "tree, wood",      "strokes": 4,  "level": "n5", "examples": [{"word":"木曜日","read":"もくようび","meaning":"Thursday"},{"word":"木村","read":"きむら","meaning":"Kimura (name)"}]},
    "金": {"on": ["キン","コン"], "kun": ["かね","かな"],"meaning": "gold, money",  "strokes": 8,  "level": "n5", "examples": [{"word":"金曜日","read":"きんようび","meaning":"Friday"},{"word":"お金","read":"おかね","meaning":"money"}]},
    "土": {"on": ["ド","ト"],    "kun": ["つち"],     "meaning": "earth, soil",     "strokes": 3,  "level": "n5", "examples": [{"word":"土曜日","read":"どようび","meaning":"Saturday"},{"word":"土地","read":"とち","meaning":"land"}]},
    "山": {"on": ["サン"],       "kun": ["やま"],     "meaning": "mountain",        "strokes": 3,  "level": "n5", "examples": [{"word":"富士山","read":"ふじさん","meaning":"Mt. Fuji"},{"word":"山田","read":"やまだ","meaning":"Yamada (name)"}]},
    "川": {"on": ["セン"],       "kun": ["かわ"],     "meaning": "river",           "strokes": 3,  "level": "n5", "examples": [{"word":"川口","read":"かわぐち","meaning":"Kawaguchi"},{"word":"小川","read":"おがわ","meaning":"stream"}]},
    "人": {"on": ["ジン","ニン"], "kun": ["ひと"],     "meaning": "person",          "strokes": 2,  "level": "n5", "examples": [{"word":"日本人","read":"にほんじん","meaning":"Japanese person"},{"word":"外国人","read":"がいこくじん","meaning":"foreigner"}]},
    "大": {"on": ["ダイ","タイ"], "kun": ["おお"],     "meaning": "big, large",      "strokes": 3,  "level": "n5", "examples": [{"word":"大学","read":"だいがく","meaning":"university"},{"word":"大きい","read":"おおきい","meaning":"big"}]},
    "小": {"on": ["ショウ"],     "kun": ["こ","ちい"], "meaning": "small",           "strokes": 3,  "level": "n5", "examples": [{"word":"小学校","read":"しょうがっこう","meaning":"elementary school"},{"word":"小さい","read":"ちいさい","meaning":"small"}]},
    "中": {"on": ["チュウ"],     "kun": ["なか"],     "meaning": "middle, inside",  "strokes": 4,  "level": "n5", "examples": [{"word":"中学校","read":"ちゅうがっこう","meaning":"middle school"},{"word":"中国","read":"ちゅうごく","meaning":"China"}]},
    "上": {"on": ["ジョウ","ショウ"],"kun": ["うえ","あ"],"meaning": "above, up",   "strokes": 3,  "level": "n5", "examples": [{"word":"上手","read":"じょうず","meaning":"skillful"},{"word":"上がる","read":"あがる","meaning":"to rise"}]},
    "下": {"on": ["カ","ゲ"],    "kun": ["した","さ"], "meaning": "below, down",     "strokes": 3,  "level": "n5", "examples": [{"word":"下手","read":"へた","meaning":"unskillful"},{"word":"地下","read":"ちか","meaning":"underground"}]},
    "本": {"on": ["ホン"],       "kun": ["もと"],     "meaning": "book, origin",    "strokes": 5,  "level": "n5", "examples": [{"word":"日本","read":"にほん","meaning":"Japan"},{"word":"本当","read":"ほんとう","meaning":"really"}]},
    "国": {"on": ["コク"],       "kun": ["くに"],     "meaning": "country",         "strokes": 8,  "level": "n5", "examples": [{"word":"外国","read":"がいこく","meaning":"foreign country"},{"word":"国語","read":"こくご","meaning":"national language"}]},
    "語": {"on": ["ゴ"],         "kun": ["かた"],     "meaning": "language, word",  "strokes": 14, "level": "n5", "examples": [{"word":"日本語","read":"にほんご","meaning":"Japanese language"},{"word":"英語","read":"えいご","meaning":"English"}]},
    "学": {"on": ["ガク"],       "kun": ["まな"],     "meaning": "study, learning", "strokes": 8,  "level": "n5", "examples": [{"word":"大学","read":"だいがく","meaning":"university"},{"word":"学ぶ","read":"まなぶ","meaning":"to learn"}]},
    "校": {"on": ["コウ"],       "kun": [],          "meaning": "school",           "strokes": 10, "level": "n5", "examples": [{"word":"学校","read":"がっこう","meaning":"school"},{"word":"高校","read":"こうこう","meaning":"high school"}]},
    "先": {"on": ["セン"],       "kun": ["さき"],     "meaning": "ahead, previous", "strokes": 6,  "level": "n5", "examples": [{"word":"先生","read":"せんせい","meaning":"teacher"},{"word":"先週","read":"せんしゅう","meaning":"last week"}]},
    "生": {"on": ["セイ","ショウ"],"kun": ["い","う","は","なま"],"meaning": "life, birth","strokes": 5,"level": "n5","examples": [{"word":"学生","read":"がくせい","meaning":"student"},{"word":"先生","read":"せんせい","meaning":"teacher"}]},
    "年": {"on": ["ネン"],       "kun": ["とし"],     "meaning": "year",            "strokes": 6,  "level": "n5", "examples": [{"word":"今年","read":"ことし","meaning":"this year"},{"word":"毎年","read":"まいとし","meaning":"every year"}]},
    "時": {"on": ["ジ"],         "kun": ["とき"],     "meaning": "time, hour",      "strokes": 10, "level": "n5", "examples": [{"word":"時間","read":"じかん","meaning":"time"},{"word":"何時","read":"なんじ","meaning":"what time"}]},
    "間": {"on": ["カン","ケン"], "kun": ["ま","あいだ"],"meaning": "interval, between","strokes": 12,"level": "n5","examples": [{"word":"時間","read":"じかん","meaning":"time"},{"word":"人間","read":"にんげん","meaning":"human being"}]},
    "食": {"on": ["ショク"],     "kun": ["た","く"],  "meaning": "eat, food",       "strokes": 9,  "level": "n5", "examples": [{"word":"食べる","read":"たべる","meaning":"to eat"},{"word":"食事","read":"しょくじ","meaning":"meal"}]},
    "飲": {"on": ["イン"],       "kun": ["の"],       "meaning": "drink",           "strokes": 12, "level": "n5", "examples": [{"word":"飲む","read":"のむ","meaning":"to drink"},{"word":"飲み物","read":"のみもの","meaning":"beverage"}]},
    "見": {"on": ["ケン"],       "kun": ["み","みえ"], "meaning": "see, look",       "strokes": 7,  "level": "n5", "examples": [{"word":"見る","read":"みる","meaning":"to see"},{"word":"見物","read":"けんぶつ","meaning":"sightseeing"}]},
    "行": {"on": ["コウ","ギョウ"],"kun": ["い","おこな"],"meaning": "go, conduct",  "strokes": 6,  "level": "n5", "examples": [{"word":"行く","read":"いく","meaning":"to go"},{"word":"旅行","read":"りょこう","meaning":"travel"}]},
    "来": {"on": ["ライ"],       "kun": ["く","き"],  "meaning": "come",            "strokes": 7,  "level": "n5", "examples": [{"word":"来る","read":"くる","meaning":"to come"},{"word":"来週","read":"らいしゅう","meaning":"next week"}]},
    "東": {"on": ["トウ"],       "kun": ["ひがし"],   "meaning": "east",            "strokes": 8,  "level": "n5", "examples": [{"word":"東京","read":"とうきょう","meaning":"Tokyo"},{"word":"東西","read":"とうざい","meaning":"east and west"}]},
    "西": {"on": ["セイ","サイ"], "kun": ["にし"],     "meaning": "west",            "strokes": 6,  "level": "n5", "examples": [{"word":"西洋","read":"せいよう","meaning":"Western"},{"word":"関西","read":"かんさい","meaning":"Kansai"}]},
    "南": {"on": ["ナン"],       "kun": ["みなみ"],   "meaning": "south",           "strokes": 9,  "level": "n5", "examples": [{"word":"南北","read":"なんぼく","meaning":"north and south"},{"word":"東南","read":"とうなん","meaning":"southeast"}]},
    "北": {"on": ["ホク"],       "kun": ["きた"],     "meaning": "north",           "strokes": 5,  "level": "n5", "examples": [{"word":"北海道","read":"ほっかいどう","meaning":"Hokkaido"},{"word":"南北","read":"なんぼく","meaning":"north and south"}]},

    # ── N4 ────────────────────────────────────────────────────────────────────
    "思": {"on": ["シ"],         "kun": ["おも"],     "meaning": "think",           "strokes": 9,  "level": "n4", "examples": [{"word":"思う","read":"おもう","meaning":"to think"},{"word":"思想","read":"しそう","meaning":"thought"}]},
    "知": {"on": ["チ"],         "kun": ["し"],       "meaning": "know, wisdom",    "strokes": 8,  "level": "n4", "examples": [{"word":"知る","read":"しる","meaning":"to know"},{"word":"知識","read":"ちしき","meaning":"knowledge"}]},
    "会": {"on": ["カイ"],       "kun": ["あ"],       "meaning": "meeting, meet",   "strokes": 6,  "level": "n4", "examples": [{"word":"会社","read":"かいしゃ","meaning":"company"},{"word":"会議","read":"かいぎ","meaning":"meeting"}]},
    "社": {"on": ["シャ"],       "kun": ["やしろ"],   "meaning": "company, shrine", "strokes": 7,  "level": "n4", "examples": [{"word":"会社","read":"かいしゃ","meaning":"company"},{"word":"社会","read":"しゃかい","meaning":"society"}]},
    "電": {"on": ["デン"],       "kun": [],          "meaning": "electricity",      "strokes": 13, "level": "n4", "examples": [{"word":"電車","read":"でんしゃ","meaning":"train"},{"word":"電話","read":"でんわ","meaning":"telephone"}]},
    "話": {"on": ["ワ"],         "kun": ["はな","はなし"],"meaning": "talk, speak", "strokes": 13, "level": "n4", "examples": [{"word":"電話","read":"でんわ","meaning":"telephone"},{"word":"話す","read":"はなす","meaning":"to speak"}]},
    "書": {"on": ["ショ"],       "kun": ["か"],       "meaning": "write",           "strokes": 10, "level": "n4", "examples": [{"word":"書く","read":"かく","meaning":"to write"},{"word":"教科書","read":"きょうかしょ","meaning":"textbook"}]},
    "読": {"on": ["ドク"],       "kun": ["よ"],       "meaning": "read",            "strokes": 14, "level": "n4", "examples": [{"word":"読む","read":"よむ","meaning":"to read"},{"word":"読書","read":"どくしょ","meaning":"reading books"}]},
    "聞": {"on": ["ブン","モン"], "kun": ["き","きこ"], "meaning": "hear, listen",   "strokes": 14, "level": "n4", "examples": [{"word":"聞く","read":"きく","meaning":"to hear/ask"},{"word":"新聞","read":"しんぶん","meaning":"newspaper"}]},
    "新": {"on": ["シン"],       "kun": ["あたら","あら"],"meaning": "new",         "strokes": 13, "level": "n4", "examples": [{"word":"新聞","read":"しんぶん","meaning":"newspaper"},{"word":"新しい","read":"あたらしい","meaning":"new"}]},

    # ── N3 ────────────────────────────────────────────────────────────────────
    "気": {"on": ["キ","ケ"],    "kun": [],           "meaning": "spirit, energy",  "strokes": 6,  "level": "n3", "examples": [{"word":"天気","read":"てんき","meaning":"weather"},{"word":"元気","read":"げんき","meaning":"energetic"}]},
    "天": {"on": ["テン"],       "kun": ["あめ","あま"],"meaning": "heaven, sky",   "strokes": 4,  "level": "n3", "examples": [{"word":"天気","read":"てんき","meaning":"weather"},{"word":"天国","read":"てんごく","meaning":"heaven"}]},
    "力": {"on": ["リョク","リキ"],"kun": ["ちから"],  "meaning": "power, force",    "strokes": 2,  "level": "n3", "examples": [{"word":"努力","read":"どりょく","meaning":"effort"},{"word":"力強い","read":"ちからづよい","meaning":"powerful"}]},
    "心": {"on": ["シン"],       "kun": ["こころ"],   "meaning": "heart, mind",     "strokes": 4,  "level": "n3", "examples": [{"word":"心配","read":"しんぱい","meaning":"worry"},{"word":"安心","read":"あんしん","meaning":"peace of mind"}]},
    "体": {"on": ["タイ"],       "kun": ["からだ"],   "meaning": "body",            "strokes": 7,  "level": "n3", "examples": [{"word":"身体","read":"からだ","meaning":"body"},{"word":"体育","read":"たいいく","meaning":"PE"}]},
    "道": {"on": ["ドウ","トウ"], "kun": ["みち"],     "meaning": "road, way",       "strokes": 12, "level": "n3", "examples": [{"word":"道路","read":"どうろ","meaning":"road"},{"word":"武道","read":"ぶどう","meaning":"martial arts"}]},
    "場": {"on": ["ジョウ"],     "kun": ["ば"],       "meaning": "place, field",    "strokes": 12, "level": "n3", "examples": [{"word":"場所","read":"ばしょ","meaning":"place"},{"word":"工場","read":"こうじょう","meaning":"factory"}]},

    # ── N2/N1 ─────────────────────────────────────────────────────────────────
    "複": {"on": ["フク"],       "kun": [],           "meaning": "duplicate, complex","strokes": 14,"level": "n2","examples": [{"word":"複雑","read":"ふくざつ","meaning":"complex"},{"word":"複数","read":"ふくすう","meaning":"plural"}]},
    "革": {"on": ["カク"],       "kun": ["かわ"],     "meaning": "reform, leather", "strokes": 9,  "level": "n2", "examples": [{"word":"改革","read":"かいかく","meaning":"reform"},{"word":"革命","read":"かくめい","meaning":"revolution"}]},
    "創": {"on": ["ソウ"],       "kun": ["つく"],     "meaning": "create, originate","strokes": 12,"level": "n1","examples": [{"word":"創造","read":"そうぞう","meaning":"creation"},{"word":"創作","read":"そうさく","meaning":"creative work"}]},
    "統": {"on": ["トウ"],       "kun": ["す"],       "meaning": "unite, govern",   "strokes": 12, "level": "n1", "examples": [{"word":"統合","read":"とうごう","meaning":"integration"},{"word":"伝統","read":"でんとう","meaning":"tradition"}]},
}

# ── Kana reading helpers ──────────────────────────────────────────────────────
# Simple hiragana annotations for common kanji compounds
FURIGANA_MAP = {
    "日本語": "にほんご",
    "日本":   "にほん",
    "東京":   "とうきょう",
    "大学":   "だいがく",
    "学校":   "がっこう",
    "先生":   "せんせい",
    "学生":   "がくせい",
    "時間":   "じかん",
    "今日":   "きょう",
    "明日":   "あした",
    "昨日":   "きのう",
    "電車":   "でんしゃ",
    "電話":   "でんわ",
    "会社":   "かいしゃ",
    "新聞":   "しんぶん",
    "食べる": "たべる",
    "飲む":   "のむ",
    "行く":   "いく",
    "来る":   "くる",
    "見る":   "みる",
    "書く":   "かく",
    "読む":   "よむ",
    "話す":   "はなす",
    "聞く":   "きく",
    "思う":   "おもう",
    "知る":   "しる",
    "日本人": "にほんじん",
    "外国人": "がいこくじん",
    "日曜日": "にちようび",
    "月曜日": "げつようび",
    "火曜日": "かようび",
    "水曜日": "すいようび",
    "木曜日": "もくようび",
    "金曜日": "きんようび",
    "土曜日": "どようび",
    "富士山": "ふじさん",
    "北海道": "ほっかいどう",
    "関西":   "かんさい",
    "勉強":   "べんきょう",
    "練習":   "れんしゅう",
    "旅行":   "りょこう",
    "食事":   "しょくじ",
    "天気":   "てんき",
    "元気":   "げんき",
    "心配":   "しんぱい",
    "道路":   "どうろ",
    "場所":   "ばしょ",
    "大切":   "たいせつ",
    "世界":   "せかい",
    "言葉":   "ことば",
    "意味":   "いみ",
    "文化":   "ぶんか",
    "社会":   "しゃかい",
    "経済":   "けいざい",
    "政治":   "せいじ",
    "環境":   "かんきょう",
    "問題":   "もんだい",
    "解決":   "かいけつ",
    "方法":   "ほうほう",
    "理由":   "りゆう",
    "原因":   "げんいん",
    "結果":   "けっか",
    "目的":   "もくてき",
    "影響":   "えいきょう",
    "状況":   "じょうきょう",
    "必要":   "ひつよう",
    "重要":   "じゅうよう",
    "可能":   "かのう",
    "確認":   "かくにん",
    "説明":   "せつめい",
    "理解":   "りかい",
    "研究":   "けんきゅう",
    "開発":   "かいはつ",
    "技術":   "ぎじゅつ",
    "情報":   "じょうほう",
    "人間":   "にんげん",
}


def lookup_kanji(char: str) -> dict | None:
    """Return kanji info dict or None if not found."""
    return KANJI_DB.get(char)


def get_daily_kanji(seed: int) -> dict:
    """Return a deterministic 'kanji of the day' based on day seed."""
    keys = list(KANJI_DB.keys())
    key  = keys[seed % len(keys)]
    info = KANJI_DB[key].copy()
    info["char"] = key
    return info


def annotate_furigana(text: str) -> list:
    """
    Annotate Japanese text with furigana readings.
    Returns a list of segments: {text, reading, type}
    - type: 'compound' (known compound), 'kanji' (single known kanji),
             'kana' (hiragana/katakana), 'other'
    """
    segments = []
    i = 0
    while i < len(text):
        # Try longest compound match first (up to 6 chars)
        matched = False
        for length in range(min(6, len(text) - i), 1, -1):
            chunk = text[i:i+length]
            if chunk in FURIGANA_MAP:
                segments.append({
                    "text":    chunk,
                    "reading": FURIGANA_MAP[chunk],
                    "type":    "compound",
                })
                i += length
                matched = True
                break

        if matched:
            continue

        ch   = text[i]
        code = ord(ch)

        # Single kanji
        if (0x4E00 <= code <= 0x9FFF or 0x3400 <= code <= 0x4DBF):
            info = KANJI_DB.get(ch)
            reading = info["kun"][0] if info and info.get("kun") else (info["on"][0].lower() if info and info.get("on") else "")
            segments.append({
                "text":    ch,
                "reading": reading,
                "type":    "kanji" if reading else "kanji_unknown",
                "info":    info,
            })
        # Hiragana / katakana — no annotation needed
        elif 0x3040 <= code <= 0x30FF:
            segments.append({"text": ch, "reading": "", "type": "kana"})
        # Other (latin, punctuation, space)
        else:
            segments.append({"text": ch, "reading": "", "type": "other"})

        i += 1

    return segments
