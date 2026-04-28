// src/components/FuriganaReader.js
// Unique feature: paste Japanese text → see furigana above every kanji
// Click any kanji/compound to open a detailed info card

import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EXAMPLES = [
  '東京は日本の首都です。',
  '私は毎日日本語を勉強しています。',
  '山田先生は学校で教えています。',
  '今日の天気はとても良いですね。',
  '旅行のために新聞を読みました。',
];

const LEVEL_COLOR = { n5:'#34d399', n4:'#38bdf8', n3:'#a78bfa', n2:'#fbbf24', n1:'#f87171' };

// ── Furigana segment renderer ─────────────────────────────────────────────────
function FuriganaText({ segments, onKanjiClick, showFurigana }) {
  return (
    <div style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      fontSize: '1.5rem',
      lineHeight: 3.2,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      gap: '2px',
    }}>
      {segments.map((seg, i) => {
        const isKanji    = seg.type === 'kanji' || seg.type === 'kanji_unknown';
        const isCompound = seg.type === 'compound';
        const clickable  = isKanji || isCompound;

        return (
          <ruby
            key={i}
            onClick={clickable ? () => onKanjiClick(seg) : undefined}
            style={{
              cursor: clickable ? 'pointer' : 'default',
              padding: '0 1px',
              borderRadius: 4,
              background: isCompound
                ? 'rgba(124,111,247,0.12)'
                : isKanji
                  ? 'rgba(248,113,113,0.1)'
                  : 'transparent',
              transition: 'background 0.15s',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title={clickable ? `Click for details on "${seg.text}"` : undefined}
          >
            {seg.text}
            <rt style={{
              fontSize: '0.55rem',
              color: isCompound ? '#a78bfa' : '#f87171',
              letterSpacing: '0.04em',
              visibility: showFurigana && seg.reading ? 'visible' : 'hidden',
              fontFamily: "'Noto Sans JP', sans-serif",
              lineHeight: 1,
              marginBottom: 2,
            }}>
              {seg.reading || '　'}
            </rt>
          </ruby>
        );
      })}
    </div>
  );
}

// ── Kanji info popup ──────────────────────────────────────────────────────────
function KanjiPopup({ item, onClose }) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!item) return;
    const char = item.text.length === 1 ? item.text : null;
    if (!char) {
      setDetail({ text: item.text, reading: item.reading, type: 'compound' });
      return;
    }
    fetch(`${API}/kanji/lookup/${encodeURIComponent(char)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setDetail(d || { text: char, reading: item.reading, type: 'simple' }))
      .catch(() => setDetail({ text: char, reading: item.reading, type: 'simple' }));
  }, [item]);

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          background: '#111827',
          border: '1px solid rgba(124,111,247,0.3)',
          borderRadius: 20, padding: 32, maxWidth: 440, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        {!detail ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <span className="spinner" />
          </div>
        ) : (
          <>
            {/* Big character */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                fontSize: '5rem', lineHeight: 1,
                fontFamily: "'Noto Sans JP', sans-serif",
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 8,
              }}>
                {detail.char || detail.text}
              </div>
              {detail.reading && (
                <div style={{ color: '#94a3b8', fontFamily: "'Noto Sans JP'", fontSize: '1.1rem' }}>
                  {detail.reading}
                </div>
              )}
              {detail.level && (
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  padding: '3px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700,
                  background: `${LEVEL_COLOR[detail.level]}22`,
                  color: LEVEL_COLOR[detail.level],
                  border: `1px solid ${LEVEL_COLOR[detail.level]}44`,
                }}>
                  JLPT {detail.level?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Meaning */}
            {detail.meaning && (
              <div style={{
                padding: '12px 16px', borderRadius: 12, marginBottom: 16,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                color: '#e2e8f0', fontSize: '1rem', textAlign: 'center',
              }}>
                {detail.meaning}
              </div>
            )}

            {/* Readings */}
            {(detail.on?.length > 0 || detail.kun?.length > 0) && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                {detail.on?.length > 0 && (
                  <div style={{ flex: 1, padding: '12px', borderRadius: 10,
                    background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700,
                                  marginBottom: 6, letterSpacing: '0.08em' }}>ON'YOMI</div>
                    <div style={{ fontFamily: "'Noto Sans JP'", color: '#e2e8f0', fontSize: '0.95rem' }}>
                      {detail.on.join('、')}
                    </div>
                  </div>
                )}
                {detail.kun?.length > 0 && (
                  <div style={{ flex: 1, padding: '12px', borderRadius: 10,
                    background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700,
                                  marginBottom: 6, letterSpacing: '0.08em' }}>KUN'YOMI</div>
                    <div style={{ fontFamily: "'Noto Sans JP'", color: '#e2e8f0', fontSize: '0.95rem' }}>
                      {detail.kun.join('、')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stroke count */}
            {detail.strokes && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Stroke Count: </span>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>{detail.strokes}</span>
                <span style={{ color: '#64748b', fontSize: '0.82rem' }}> strokes</span>
              </div>
            )}

            {/* Examples */}
            {detail.examples?.length > 0 && (
              <>
                <div className="section-label" style={{ marginBottom: 10 }}>Example Words</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {detail.examples.map((ex, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div>
                        <span style={{ fontFamily: "'Noto Sans JP'", fontSize: '1rem', color: '#e2e8f0' }}>
                          {ex.word}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: 8,
                                       fontFamily: "'Noto Sans JP'" }}>
                          【{ex.read}】
                        </span>
                      </div>
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button className="btn btn-ghost" onClick={onClose}
              style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FuriganaReader() {
  const [text, setText]         = useState('');
  const [segments, setSegments] = useState([]);
  const [showFurigana, setShow] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError]       = useState('');

  const annotate = async (t) => {
    const target = (t || text).trim();
    if (!target) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/kanji/furigana`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: target }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setSegments(data.segments || []);
    } catch (err) {
      setError(err.message || 'Failed to annotate.');
    } finally { setLoading(false); }
  };

  const loadExample = (ex) => {
    setText(ex);
    annotate(ex);
  };

  const kanjiCount    = segments.filter(s => s.type === 'kanji' || s.type === 'compound').length;
  const unknownCount  = segments.filter(s => s.type === 'kanji_unknown').length;

  return (
    <section id="furigana-section">
      <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: '0.92rem' }}>
        Paste any Japanese text to see <strong style={{ color: '#a78bfa' }}>furigana</strong> (reading aids) above every kanji.
        Click any highlighted word to view detailed information.
      </p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
        {[
          { color: 'rgba(124,111,247,0.25)', label: 'Known compound', border: '#7c6ff7' },
          { color: 'rgba(248,113,113,0.15)', label: 'Single kanji', border: '#f87171' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3,
              background: l.color, border: `1px solid ${l.border}` }} />
            <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Examples */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {EXAMPLES.map((ex, i) => (
          <button key={i} className="btn btn-ghost"
            onClick={() => loadExample(ex)}
            style={{ fontSize: '0.85rem', fontFamily: "'Noto Sans JP', sans-serif" }}>
            {ex.slice(0, 10)}…
          </button>
        ))}
      </div>

      {/* Input */}
      <textarea id="furigana-input" rows={3}
        placeholder="日本語のテキストをここに入力してください…"
        value={text}
        onChange={e => { setText(e.target.value); setSegments([]); }}
        style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.1rem', marginBottom: 14 }} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
        <button id="furigana-annotate-btn" className="btn btn-primary" onClick={() => annotate()}
          disabled={!text.trim() || loading}
          style={{ flex: 1, justifyContent: 'center', padding: '13px', fontSize: '1rem' }}>
          {loading ? <><span className="spinner" /> Annotating…</> : '🈂️ Add Furigana'}
        </button>
        {segments.length > 0 && (
          <button className="btn btn-ghost"
            onClick={() => setShow(s => !s)}
            style={{ padding: '13px 18px' }}>
            {showFurigana ? '👁️ Hide' : '👁️ Show'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Furigana render area */}
      {segments.length > 0 && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Annotated Text</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {kanjiCount} clickable segments
              </span>
              {unknownCount > 0 && (
                <span style={{ fontSize: '0.78rem', color: '#fbbf24' }}>
                  {unknownCount} unknown kanji
                </span>
              )}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '24px 20px', minHeight: 80,
          }}>
            <FuriganaText
              segments={segments}
              onKanjiClick={setSelected}
              showFurigana={showFurigana}
            />
          </div>

          <p style={{ marginTop: 10, color: '#475569', fontSize: '0.78rem' }}>
            💡 Click any <span style={{ color: '#a78bfa' }}>purple</span> (compound) or{' '}
            <span style={{ color: '#f87171' }}>red</span> (single kanji) highlighted text for details.
          </p>
        </div>
      )}

      {/* Popup */}
      {selected && <KanjiPopup item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
