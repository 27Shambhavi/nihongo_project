// src/components/ScriptDetect.js — Script Detection & Visualization
import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const SCRIPT_META = {
  hiragana:    { color: '#34d399', label: 'Hiragana',    emoji: 'あ' },
  katakana:    { color: '#38bdf8', label: 'Katakana',    emoji: 'ア' },
  kanji:       { color: '#f87171', label: 'Kanji',       emoji: '漢' },
  latin:       { color: '#fbbf24', label: 'Latin',       emoji: 'A'  },
  punctuation: { color: '#94a3b8', label: 'Punctuation', emoji: '。' },
  other:       { color: '#64748b', label: 'Other',       emoji: '？' },
};

const EXAMPLES = [
  'こんにちは、世界！',
  'カタカナテスト',
  '日本語を勉強しています。',
  '東京はTokyoとも書きます。',
];

function Donut({ segments }) {
  const r = 70, cx = 90, cy = 90;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.filter(s => s.value > 0).map((s) => {
    const dash = (s.value / 100) * circ;
    const arc = { ...s, dash, offset };
    offset += dash;
    return arc;
  });
  const dominant = segments.reduce((a, b) => a.value > b.value ? a : b, segments[0]);
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="22" />
      {arcs.map((arc, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={arc.color} strokeWidth="22"
          strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
          strokeDashoffset={-arc.offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#e2e8f0"
        fontSize="26" fontFamily="'Noto Sans JP', sans-serif">
        {dominant?.emoji || '字'}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#64748b" fontSize="11">scripts</text>
    </svg>
  );
}

export default function ScriptDetect() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detect = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/script/detect?text=${encodeURIComponent(text.trim())}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(err.message || 'Detection failed.');
    } finally { setLoading(false); }
  };

  const segments = result
    ? Object.entries(result.percentages || {}).filter(([, v]) => v > 0)
        .map(([k, v]) => ({ key: k, value: v, color: SCRIPT_META[k]?.color || '#64748b', emoji: SCRIPT_META[k]?.emoji || '?' }))
    : [];

  return (
    <section id="script-section">
      <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.92rem' }}>
        Analyse which Japanese scripts appear in your text, with counts and percentages.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {EXAMPLES.map((ex, i) => (
          <button key={i} className="btn btn-ghost"
            onClick={() => { setText(ex); setResult(null); }}
            style={{ fontSize: '0.85rem', fontFamily: "'Noto Sans JP', sans-serif" }}>
            {ex}
          </button>
        ))}
      </div>

      <textarea id="script-input" rows={3}
        placeholder="Enter Japanese text…" value={text}
        onChange={e => { setText(e.target.value); setResult(null); }}
        style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.1rem', marginBottom: 14 }} />

      <button id="script-detect-btn" className="btn btn-primary" onClick={detect}
        disabled={!text.trim() || loading}
        style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem' }}>
        {loading ? <><span className="spinner" /> Analysing…</> : '🔎 Detect Scripts'}
      </button>

      {error && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ padding: '8px 22px', borderRadius: 99, fontWeight: 700, fontSize: '0.95rem',
              background: 'rgba(124,111,247,0.12)', border: '1px solid rgba(124,111,247,0.3)', color: '#a78bfa' }}>
              {result.script_label}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {segments.length > 0 && <div style={{ flexShrink: 0 }}><Donut segments={segments} /></div>}
            <div style={{ flex: 1, minWidth: 200 }}>
              {Object.entries(result.counts || {}).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).map(([k, v]) => {
                const meta = SCRIPT_META[k] || {};
                const pct = result.percentages?.[k] || 0;
                return (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ color: meta.color, fontWeight: 600, fontSize: '0.9rem' }}>
                        {meta.emoji} {meta.label}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{v} · {pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                    {result.samples?.[k] && (
                      <div style={{ marginTop: 3, fontSize: '0.78rem', color: '#475569', fontFamily: "'Noto Sans JP'" }}>
                        {result.samples[k]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
