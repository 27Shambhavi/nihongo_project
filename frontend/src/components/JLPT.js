// src/components/JLPT.js — JLPT Level Classifier
import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const LEVEL_META = {
  n5: { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  label: 'N5', title: 'Beginner',           star: '⭐' },
  n4: { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)',  label: 'N4', title: 'Elementary',         star: '⭐⭐' },
  n3: { color: '#a78bfa', bg: 'rgba(124,111,247,0.1)', border: 'rgba(124,111,247,0.25)', label: 'N3', title: 'Intermediate',       star: '⭐⭐⭐' },
  n2: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)',  label: 'N2', title: 'Upper-Intermediate', star: '⭐⭐⭐⭐' },
  n1: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', label: 'N1', title: 'Advanced',           star: '⭐⭐⭐⭐⭐' },
};

const EXAMPLES = [
  { text: 'こんにちは、私は学生です。',   hint: 'N5 example' },
  { text: '電車が遅れていて、困っています。', hint: 'N4 example' },
  { text: '環境問題について考えてみましょう。', hint: 'N3 example' },
];

export default function JLPT() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const classify = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/jlpt/classify?text=${encodeURIComponent(text.trim())}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(err.message || 'Classification failed.');
    } finally { setLoading(false); }
  };

  const meta = result ? LEVEL_META[result.level] : null;

  return (
    <section id="jlpt-section">
      <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.92rem' }}>
        Classify Japanese text into a JLPT difficulty band (N5–N1) using vocabulary lookup and structural heuristics.
      </p>

      {/* Level scale */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {Object.entries(LEVEL_META).map(([k, m]) => (
          <div key={k} style={{
            flex: 1, textAlign: 'center', padding: '10px 4px',
            background: result?.level === k ? m.bg : 'rgba(255,255,255,0.02)',
            border: `1px solid ${result?.level === k ? m.border : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 10, transition: 'all 0.3s',
            transform: result?.level === k ? 'scale(1.05)' : 'scale(1)',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: m.color }}>{m.label}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{m.title}</div>
          </div>
        ))}
      </div>

      {/* Examples */}
      <div style={{ marginBottom: 16 }}>
        {EXAMPLES.map((ex, i) => (
          <button key={i} className="btn btn-ghost"
            onClick={() => { setText(ex.text); setResult(null); }}
            style={{ fontSize: '0.82rem', fontFamily: "'Noto Sans JP', sans-serif",
                     display: 'block', width: '100%', textAlign: 'left',
                     marginBottom: 6, padding: '10px 14px' }}>
            <span style={{ color: '#64748b', marginRight: 8, fontSize: '0.75rem' }}>{ex.hint}</span>
            {ex.text}
          </button>
        ))}
      </div>

      <textarea id="jlpt-input" rows={4}
        placeholder="Enter Japanese text to classify…" value={text}
        onChange={e => { setText(e.target.value); setResult(null); }}
        style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.05rem', marginBottom: 14 }} />

      <button id="jlpt-classify-btn" className="btn btn-primary" onClick={classify}
        disabled={!text.trim() || loading}
        style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem' }}>
        {loading ? <><span className="spinner" /> Classifying…</> : '🎓 Classify Level'}
      </button>

      {error && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {result && meta && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          {/* Big level card */}
          <div style={{
            background: meta.bg, border: `2px solid ${meta.border}`,
            borderRadius: 18, padding: '28px 24px', textAlign: 'center', marginBottom: 20,
          }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: meta.color, letterSpacing: '-0.02em' }}>
              {meta.label}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 4 }}>{meta.title}</div>
            <div style={{ color: '#e2e8f0', marginTop: 10, fontSize: '0.92rem' }}>{result.description}</div>
            <div style={{ marginTop: 14, fontSize: '1.1rem' }}>{meta.star}</div>
          </div>

          {/* Confidence bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem',
                          color: '#64748b', marginBottom: 6 }}>
              <span>Confidence</span>
              <span>{result.confidence}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"
                style={{ width: `${result.confidence}%`, background: meta.color }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { label: 'Characters', val: result.stats?.char_count },
              { label: 'Kanji', val: result.stats?.kanji_count },
              { label: 'Kanji %', val: `${result.stats?.kanji_ratio}%` },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, minWidth: 80, padding: '12px 10px', textAlign: 'center',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0' }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Matched words */}
          {result.matched_words?.length > 0 && (
            <>
              <div className="section-label">Matched Vocabulary</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.matched_words.map((w, i) => {
                  const wm = LEVEL_META[w.level];
                  return (
                    <span key={i} style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: '0.82rem',
                      background: wm?.bg || 'rgba(100,116,139,0.1)',
                      color: wm?.color || '#94a3b8',
                      border: `1px solid ${wm?.border || 'transparent'}`,
                      fontFamily: "'Noto Sans JP', sans-serif",
                    }}>
                      {w.word}
                      <span style={{ marginLeft: 6, fontSize: '0.7rem', opacity: 0.7 }}>{w.level?.toUpperCase()}</span>
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
