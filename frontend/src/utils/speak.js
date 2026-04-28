// src/utils/speak.js — Web Speech API helper (no external service)
// Works in all modern browsers. Japanese voice auto-selected if available.

export function speakJapanese(text, onStart, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // stop any current speech

  const utter = new SpeechSynthesisUtterance(text);

  // Prefer a Japanese voice if the browser has one
  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jpVoice) utter.voice = jpVoice;

  utter.lang = 'ja-JP';
  utter.rate = 0.85;   // slightly slower for learners
  utter.pitch = 1.0;

  if (onStart) utter.onstart = onStart;
  if (onEnd)   utter.onend   = onEnd;

  window.speechSynthesis.speak(utter);
}

// Reusable button component
import React, { useState, useEffect } from 'react';

export function SpeakButton({ text, lang = 'ja', size = 'sm', style = {} }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  if (!supported || !text?.trim()) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = lang === 'ja' ? 'ja-JP' : 'en-US';
    utter.rate  = lang === 'ja' ? 0.85 : 1.0;
    const voices = window.speechSynthesis.getVoices();
    const pref   = lang === 'ja'
      ? voices.find(v => v.lang.startsWith('ja'))
      : voices.find(v => v.lang.startsWith('en'));
    if (pref) utter.voice = pref;
    utter.onstart = () => setSpeaking(true);
    utter.onend   = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const pad = size === 'sm' ? '6px 10px' : '9px 16px';
  const fs  = size === 'sm' ? '0.8rem'   : '0.92rem';

  return (
    <button
      onClick={handleClick}
      title={speaking ? 'Stop speaking' : 'Read aloud'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: pad, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
        background: speaking ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
        color: speaking ? '#34d399' : '#64748b',
        cursor: 'pointer', fontSize: fs, transition: 'all 0.2s',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      <span style={{ fontSize: '1em' }}>{speaking ? '⏹️' : '🔊'}</span>
      {size !== 'sm' && <span>{speaking ? 'Stop' : 'Listen'}</span>}
    </button>
  );
}
