// src/App.js — Main Application Dashboard
import React, { useState, useEffect } from 'react';
import './App.css';
import OCR            from './components/OCR';
import Translate      from './components/Translate';
import ScriptDetect   from './components/ScriptDetect';
import JLPT           from './components/JLPT';
import Grammar        from './components/Grammar';
import FuriganaReader from './components/FuriganaReader';
import DailyKanji     from './components/DailyKanji';
import Quiz           from './components/Quiz';

const API = 'http://localhost:8000';

const TABS = [
  { id: 'ocr',      label: 'OCR',       icon: '🖼️', title: 'Image OCR',           subtitle: 'Extract text from images' },
  { id: 'translate',label: 'Translate', icon: '🌐', title: 'Translation',          subtitle: 'Japanese ↔ English' },
  { id: 'script',   label: 'Scripts',   icon: '字',  title: 'Script Detection',    subtitle: 'Hiragana · Katakana · Kanji' },
  { id: 'jlpt',    label: 'JLPT',      icon: '🎓', title: 'JLPT Classifier',     subtitle: 'N5 → N1 difficulty' },
  { id: 'grammar',  label: 'Grammar',   icon: '🔬', title: 'Grammar Analyzer',    subtitle: 'Particles & patterns' },
  { id: 'furigana', label: 'Furigana',  icon: '🈂️', title: 'Furigana Reader',     subtitle: 'Reading aids · Click kanji for details' },
  { id: 'quiz',     label: 'Quiz',      icon: '🎮', title: 'Vocabulary Quiz',      subtitle: 'Test yourself · JLPT flashcards' },
];

export default function App() {
  const [tab, setTab]           = useState('ocr');
  const [apiStatus, setStatus]  = useState('checking');

  // ── Health check ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/`)
      .then(r => r.ok ? setStatus('online') : setStatus('offline'))
      .catch(() => setStatus('offline'));
  }, []);

  const current = TABS.find(t => t.id === tab);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={{
        background: 'rgba(17,24,39,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--grad-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 700, boxShadow: '0 4px 16px rgba(124,111,247,0.35)',
            }}>
              日
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.2 }}>
                日本語 AI Assistant
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1 }}>
                Japanese Language Learning Platform
              </div>
            </div>
          </div>

          {/* Right side: Daily Kanji + API Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <DailyKanji />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: apiStatus === 'online' ? '#34d399' : apiStatus === 'offline' ? '#f87171' : '#fbbf24',
                boxShadow: `0 0 8px ${apiStatus === 'online' ? '#34d399' : apiStatus === 'offline' ? '#f87171' : '#fbbf24'}`,
              }} />
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                API {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking…'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Offline banner ─────────────────────────────────────────────────── */}
      {apiStatus === 'offline' && (
        <div style={{
          background: 'rgba(248,113,113,0.1)', borderBottom: '1px solid rgba(248,113,113,0.2)',
          padding: '10px 24px', textAlign: 'center', color: '#f87171', fontSize: '0.85rem',
        }}>
          ⚠️ Backend API is offline. Start it with:{' '}
          <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 4 }}>
            cd backend &amp;&amp; uvicorn main:app --reload
          </code>
        </div>
      )}

      {/* ── Hero section ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(124,111,247,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '48px 24px 36px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #e2e8f0 0%, #a78bfa 60%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 12, lineHeight: 1.2,
        }}>
          日本語を学ぼう
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
          OCR · Translation · Script Detection · JLPT Classification · Grammar Analysis
        </p>
      </div>

      {/* ── Tab navigation ─────────────────────────────────────────────────── */}
      <nav style={{
        background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px',
        position: 'sticky', top: 64, zIndex: 90,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', gap: 4, overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {TABS.map(t => (
            <button key={t.id}
              id={`tab-${t.id}`}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '16px 18px', background: 'none', border: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap',
                color: tab === t.id ? '#a78bfa' : '#64748b',
                borderBottom: `2px solid ${tab === t.id ? '#7c6ff7' : 'transparent'}`,
                fontWeight: tab === t.id ? 600 : 400,
                fontSize: '0.88rem',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '32px 24px 60px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

        {/* Section header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4,
                       display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{current?.icon}</span>
            {current?.title}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>{current?.subtitle}</p>
        </div>

        {/* Feature card */}
        <div className="card" style={{ padding: '32px' }}>
          {tab === 'ocr'      && <OCR />}
          {tab === 'translate'&& <Translate />}
          {tab === 'script'   && <ScriptDetect />}
          {tab === 'jlpt'     && <JLPT />}
          {tab === 'grammar'  && <Grammar />}
          {tab === 'furigana' && <FuriganaReader />}
          {tab === 'quiz'     && <Quiz />}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '20px',
        color: '#334155', fontSize: '0.78rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        日本語 AI Assistant · Rule-based · No LLM · FastAPI + React
      </footer>
    </div>
  );
}