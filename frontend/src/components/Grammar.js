// src/components/Grammar.js — Grammar Analyzer
import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CATEGORY_COLOR = {
  case:   '#a78bfa',
  copula: '#38bdf8',
  verb:   '#34d399',
  'te-form': '#fbbf24',
  ending: '#f87171',
};

const EXAMPLES = [
  '私は学校に行きます。',
  '日本語を勉強しています。',
  'ここで食べてください。',
  '電車が来ています。',
];

export default function Grammar() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/grammar/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text.trim() }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(err.message || 'Analysis failed.');
    } finally { setLoading(false); }
  };

  return (
    <section id="grammar-section">
      <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.92rem' }}>
        Identify particles, grammar patterns, and sentence structure in Japanese text.
      </p>

      {/* Examples */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {EXAMPLES.map((ex, i) => (
          <button key={i} className="btn btn-ghost"
            onClick={() => { setText(ex); setResult(null); }}
            style={{ fontSize: '0.85rem', fontFamily: "'Noto Sans JP', sans-serif" }}>
            {ex}
          </button>
        ))}
      </div>

      <textarea id="grammar-input" rows={3}
        placeholder="Enter a Japanese sentence…" value={text}
        onChange={e => { setText(e.target.value); setResult(null); }}
        style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.1rem', marginBottom: 14 }} />

      <button id="grammar-analyze-btn" className="btn btn-primary" onClick={analyze}
        disabled={!text.trim() || loading}
        style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem' }}>
        {loading ? <><span className="spinner" /> Analysing…</> : '🔬 Analyse Grammar'}
      </button>

      {error && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          {/* Sentence structure */}
          <div className="section-label">Sentence Structure</div>
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '16px 18px',
            fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.15rem',
            color: '#e2e8f0', letterSpacing: '0.05em', marginBottom: 20,
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {result.original}
          </div>

          {result.sentence_structure && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Pattern:</span>
              <span style={{ padding: '5px 14px', borderRadius: 99,
                background: 'rgba(124,111,247,0.12)', color: '#a78bfa',
                fontWeight: 600, fontSize: '0.88rem' }}>
                {result.sentence_structure}
              </span>
              {result.estimated_level && (
                <span className={`badge badge-${result.estimated_level}`}>
                  {result.estimated_level.toUpperCase()}
                </span>
              )}
            </div>
          )}

          {/* Particles */}
          {result.particles?.length > 0 && (
            <>
              <div className="section-label">Particles Found</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
                {result.particles.map((p, i) => {
                  const col = CATEGORY_COLOR[p.category] || '#94a3b8';
                  return (
                    <div key={i} style={{
                      padding: '8px 14px', borderRadius: 99,
                      background: `${col}18`,
                      border: `1px solid ${col}40`,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ fontFamily: "'Noto Sans JP'", fontSize: '1.2rem',
                                     fontWeight: 700, color: col }}>{p.particle}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.meaning}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Grammar Patterns */}
          {result.patterns?.length > 0 && (
            <>
              <div className="section-label">Grammar Patterns</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {result.patterns.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 16px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{p.description}</span>
                    <span className={`badge badge-${p.level}`}>{p.level.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Explanation */}
          {result.explanation?.length > 0 && (
            <div style={{ background: 'rgba(124,111,247,0.07)', borderRadius: 12,
                          padding: '14px 18px', border: '1px solid rgba(124,111,247,0.15)' }}>
              {result.explanation.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < result.explanation.length - 1 ? 6 : 0 }}>
                  <span style={{ color: '#7c6ff7' }}>→</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{line}</span>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {result.particles?.length === 0 && result.patterns?.length === 0 && (
            <div style={{ textAlign: 'center', color: '#475569', padding: '20px',
                          fontSize: '0.9rem' }}>
              No particles or grammar patterns detected. Try a longer sentence.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
