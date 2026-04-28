// src/components/DailyKanji.js — Daily Kanji card widget
// Shows in a slide-out panel triggered from header

import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const LEVEL_COLOR = { n5:'#34d399', n4:'#38bdf8', n3:'#a78bfa', n2:'#fbbf24', n1:'#f87171' };

export default function DailyKanji() {
  const [kanji, setKanji]   = useState(null);
  const [open, setOpen]     = useState(false);
  const [flipped, setFlip]  = useState(false);

  useEffect(() => {
    // Use day-of-year as seed so it changes daily
    const now  = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const seed  = Math.floor((now - start) / 86400000);
    fetch(`${API}/kanji/daily?seed=${seed}`)
      .then(r => r.ok ? r.json() : null)
      .then(setKanji)
      .catch(() => {});
  }, []);

  if (!kanji) return null;

  const lc = LEVEL_COLOR[kanji.level] || '#94a3b8';

  return (
    <>
      {/* Trigger button in header */}
      <button
        id="daily-kanji-btn"
        onClick={() => { setOpen(true); setFlip(false); }}
        title="Kanji of the Day"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '6px 14px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.2s',
          color: '#e2e8f0',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = lc}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
      >
        <span style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: '1.1rem', color: lc, fontWeight: 700,
        }}>{kanji.char}</span>
        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', flexDirection: 'column',
                        alignItems: 'flex-start', lineHeight: 1.3 }}>
          <span style={{ color: '#94a3b8' }}>Today's Kanji</span>
          <span style={{ color: lc }}>{kanji.level?.toUpperCase()}</span>
        </span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="fade-in"
            style={{
              width: '100%', maxWidth: 380,
              perspective: 1200,
            }}
          >
            {/* Card flip wrapper */}
            <div
              style={{
                position: 'relative', width: '100%',
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {/* ── Front face ── */}
              <div style={{
                backfaceVisibility: 'hidden',
                background: `linear-gradient(135deg, ${lc}15, #111827)`,
                border: `1px solid ${lc}40`,
                borderRadius: 24, padding: '40px 32px', textAlign: 'center',
                boxShadow: `0 0 60px ${lc}20`,
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: '0.1em',
                               textTransform: 'uppercase', marginBottom: 16 }}>
                  📅 Kanji of the Day
                </div>

                <div style={{
                  fontSize: '7rem', lineHeight: 1,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  background: `linear-gradient(135deg, ${lc}, #e2e8f0)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', marginBottom: 20,
                }}>
                  {kanji.char}
                </div>

                <div style={{
                  display: 'inline-block', padding: '5px 16px', borderRadius: 99,
                  background: `${lc}20`, color: lc,
                  border: `1px solid ${lc}40`, fontSize: '0.8rem', fontWeight: 700, marginBottom: 24,
                }}>
                  JLPT {kanji.level?.toUpperCase()} · {kanji.strokes} strokes
                </div>

                <button className="btn btn-primary" onClick={() => setFlip(true)}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  Reveal Details ✨
                </button>
              </div>

              {/* ── Back face ── */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: '#111827',
                border: `1px solid ${lc}40`,
                borderRadius: 24, padding: '28px 28px',
                boxShadow: `0 0 60px ${lc}20`,
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{
                    fontSize: '3.5rem', lineHeight: 1,
                    fontFamily: "'Noto Sans JP', sans-serif", color: lc,
                  }}>{kanji.char}</div>
                  <div>
                    <div style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 600 }}>
                      {kanji.meaning}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 2 }}>
                      {kanji.strokes} strokes · JLPT {kanji.level?.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Readings */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                  {kanji.on?.length > 0 && (
                    <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10,
                      background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700,
                                    letterSpacing: '0.08em', marginBottom: 4 }}>ON'YOMI</div>
                      <div style={{ fontFamily: "'Noto Sans JP'", color: '#e2e8f0' }}>
                        {kanji.on.join('、')}
                      </div>
                    </div>
                  )}
                  {kanji.kun?.length > 0 && (
                    <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10,
                      background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                      <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700,
                                    letterSpacing: '0.08em', marginBottom: 4 }}>KUN'YOMI</div>
                      <div style={{ fontFamily: "'Noto Sans JP'", color: '#e2e8f0' }}>
                        {kanji.kun.join('、')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Examples */}
                {kanji.examples?.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.08em',
                                   textTransform: 'uppercase', marginBottom: 8 }}>Example Words</div>
                    {kanji.examples.map((ex, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px', borderRadius: 8, marginBottom: 6,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div>
                          <span style={{ fontFamily: "'Noto Sans JP'", fontSize: '1rem',
                                         color: '#e2e8f0' }}>{ex.word}</span>
                          <span style={{ color: '#64748b', fontSize: '0.78rem', marginLeft: 6,
                                         fontFamily: "'Noto Sans JP'" }}>【{ex.read}】</span>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{ex.meaning}</span>
                      </div>
                    ))}
                  </>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn-ghost" onClick={() => setFlip(false)}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                    ← Flip Back
                  </button>
                  <button className="btn btn-ghost" onClick={() => setOpen(false)}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                    Close ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
