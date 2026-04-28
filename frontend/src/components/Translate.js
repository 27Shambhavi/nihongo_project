// src/components/Translate.js — Translation Panel
import React, { useState } from 'react';
import { SpeakButton } from '../utils/speak';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EXAMPLES = [
  '日本語を勉強しています。',
  'おはようございます！',
  '私は学校に行きます。',
  '東京は大きな都市です。',
];

export default function Translate() {
  const [text, setText]         = useState('');
  const [direction, setDir]     = useState('ja→en');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const targetLang = direction === 'ja→en' ? 'en' : 'ja';

  const translate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API}/translate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: text.trim(), target_lang: targetLang }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setDir(d => d === 'ja→en' ? 'en→ja' : 'ja→en');
    if (result) {
      setText(result.translated);
      setResult(null);
    }
  };

  return (
    <section id="translate-section">
      <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.92rem' }}>
        Translate between Japanese and English using the MyMemory translation API.
      </p>

      {/* Direction toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          flex: 1, textAlign: 'center', padding: '10px 16px',
          background: 'rgba(124,111,247,0.1)', borderRadius: 10,
          border: '1px solid rgba(124,111,247,0.25)',
          color: '#a78bfa', fontWeight: 600, fontSize: '0.9rem',
        }}>
          {direction === 'ja→en' ? '🇯🇵 Japanese' : '🇬🇧 English'}
        </div>

        <button id="swap-btn" className="btn btn-ghost" onClick={swap}
          style={{ fontSize: '1.2rem', padding: '10px 14px' }}>
          ⇄
        </button>

        <div style={{
          flex: 1, textAlign: 'center', padding: '10px 16px',
          background: 'rgba(56,189,248,0.1)', borderRadius: 10,
          border: '1px solid rgba(56,189,248,0.25)',
          color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem',
        }}>
          {direction === 'ja→en' ? '🇬🇧 English' : '🇯🇵 Japanese'}
        </div>
      </div>

      {/* Quick examples */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-label">Quick Examples</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXAMPLES.map((ex, i) => (
            <button key={i} className="btn btn-ghost"
              onClick={() => { setText(ex); setResult(null); }}
              style={{ fontSize: '0.8rem', padding: '6px 12px', fontFamily: "'Noto Sans JP', sans-serif" }}>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <textarea
          id="translate-input"
          rows={4}
          placeholder={direction === 'ja→en' ? 'Enter Japanese text…' : 'Enter English text…'}
          value={text}
          onChange={(e) => { setText(e.target.value); setResult(null); }}
          style={{ fontFamily: direction === 'ja→en' ? "'Noto Sans JP', sans-serif" : 'inherit',
                   fontSize: direction === 'ja→en' ? '1.1rem' : '1rem', paddingBottom: 42 }}
        />
        {text.trim() && (
          <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <SpeakButton text={text} lang={direction === 'ja→en' ? 'ja' : 'en'} />
          </div>
        )}
      </div>

      <button
        id="translate-btn"
        className="btn btn-primary"
        onClick={translate}
        disabled={!text.trim() || loading}
        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '13px' }}
      >
        {loading ? <><span className="spinner" /> Translating…</> : '🌐 Translate'}
      </button>

      {error && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10,
                      background: 'rgba(248,113,113,0.1)', color: '#f87171',
                      border: '1px solid rgba(248,113,113,0.2)', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="fade-in" style={{ marginTop: 24 }}>
          <div className="section-label">Translation Result</div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.07), rgba(124,111,247,0.07))',
            border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 14, padding: 22,
          }}>
            <div style={{ fontSize: '1.25rem', lineHeight: 1.8, color: '#e2e8f0',
                          fontFamily: direction === 'en→ja' ? "'Noto Sans JP', sans-serif" : 'inherit',
                          marginBottom: 14 }}>
              {result.translated}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-unk">
                {result.source_lang === 'ja' ? '🇯🇵 Japanese' : '🇬🇧 English'}
              </span>
              <span className="badge badge-n5">
                via {result.method === 'mymemory_api' ? 'MyMemory API' : 'Romaji Fallback'}
              </span>
              <SpeakButton text={result.translated} lang={direction === 'ja→en' ? 'en' : 'ja'} size="md" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
