// src/components/Quiz.js — Vocabulary Quiz (JLPT Flashcard Mode)
import React, { useState, useEffect, useCallback } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const LEVEL_META = {
  n5: { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)'  },
  n4: { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)'  },
  n3: { color: '#a78bfa', bg: 'rgba(124,111,247,0.1)', border: 'rgba(124,111,247,0.25)' },
  n2: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)'  },
  n1: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(words, count = 10) {
  const pool = shuffle(words).slice(0, count);
  return pool.map(word => {
    const distractors = shuffle(words.filter(w => w.word !== word.word)).slice(0, 3);
    const choices = shuffle([word, ...distractors]);
    return { word, choices, correctIdx: choices.findIndex(c => c.word === word.word) };
  });
}

// ── Animated progress ring ────────────────────────────────────────────────────
function Ring({ pct, color, size = 80 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${(pct/100)*circ} ${circ}`}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 0.6s ease' }} />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill={color} fontSize="14" fontWeight="700">{pct}%</text>
    </svg>
  );
}

export default function Quiz() {
  const [level,    setLevel]    = useState('n5');
  const [mode,     setMode]     = useState('ja→en');   // ja→en or en→ja
  const [words,    setWords]    = useState([]);
  const [questions,setQuestions]= useState([]);
  const [qIndex,   setQIndex]   = useState(0);
  const [chosen,   setChosen]   = useState(null);   // index of chosen option
  const [score,    setScore]    = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [phase,    setPhase]    = useState('setup'); // setup | quiz | result
  const [loading,  setLoading]  = useState(false);
  const [flipped,  setFlipped]  = useState(false);   // card reveal

  const fetchWords = useCallback(async (lvl) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/jlpt/${lvl}`);
      const data = await res.json();
      setWords(data.words || []);
    } catch { setWords([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWords(level); }, [level, fetchWords]);

  const startQuiz = () => {
    const qs = buildQuestions(words, Math.min(10, words.length));
    setQuestions(qs);
    setQIndex(0); setChosen(null); setScore(0); setStreak(0);
    setFlipped(false); setPhase('quiz');
  };

  const handleChoice = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setFlipped(true);
    const correct = idx === questions[qIndex].correctIdx;
    if (correct) { setScore(s => s + 1); setStreak(s => s + 1); }
    else          { setStreak(0); }
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= questions.length) {
      setPhase('result');
    } else {
      setQIndex(i => i + 1);
      setChosen(null); setFlipped(false);
    }
  };

  const q    = questions[qIndex];
  const pct  = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const lm   = LEVEL_META[level] || {};

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <section id="quiz-section">
        <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.92rem' }}>
          Test your Japanese vocabulary with interactive multiple-choice flashcards from the JLPT database.
        </p>

        {/* Level selector */}
        <div className="section-label">Choose Level</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {Object.entries(LEVEL_META).map(([lvl, m]) => (
            <button key={lvl} onClick={() => setLevel(lvl)}
              style={{
                flex: '1 0 60px', padding: '14px 8px', borderRadius: 12, border: 'none',
                cursor: 'pointer', transition: 'all 0.2s',
                background: level === lvl ? m.bg : 'rgba(255,255,255,0.03)',
                border: `2px solid ${level === lvl ? m.color : 'rgba(255,255,255,0.07)'}`,
                color: level === lvl ? m.color : '#64748b',
                fontWeight: level === lvl ? 700 : 400, fontSize: '1.1rem',
                transform: level === lvl ? 'scale(1.06)' : 'scale(1)',
              }}>
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="section-label">Quiz Direction</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          {[
            { id: 'ja→en', label: '🇯🇵 Japanese → English', sub: 'See word, guess meaning' },
            { id: 'en→ja', label: '🇬🇧 English → Japanese', sub: 'See meaning, guess word' },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{
                flex: 1, padding: '14px', borderRadius: 14, border: 'none',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                background: mode === m.id ? lm.bg : 'rgba(255,255,255,0.03)',
                border: `1px solid ${mode === m.id ? lm.color : 'rgba(255,255,255,0.08)'}`,
                color: '#e2e8f0',
              }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.sub}</div>
            </button>
          ))}
        </div>

        {/* Stats preview */}
        {words.length > 0 && (
          <div style={{ padding: '14px 18px', borderRadius: 12, marginBottom: 24,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '2rem' }}>📚</div>
            <div>
              <div style={{ color: '#e2e8f0', fontWeight: 600 }}>
                {words.length} words available in {level.toUpperCase()}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                You'll be tested on {Math.min(10, words.length)} random words
              </div>
            </div>
          </div>
        )}

        <button id="quiz-start-btn" className="btn btn-primary" onClick={startQuiz}
          disabled={words.length === 0 || loading}
          style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1.05rem' }}>
          {loading ? <><span className="spinner" /> Loading…</> : '🎮 Start Quiz'}
        </button>
      </section>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const grade = pct >= 90 ? { emoji: '🏆', label: 'Excellent!', color: '#fbbf24' }
                : pct >= 70 ? { emoji: '🎉', label: 'Good job!', color: '#34d399' }
                : pct >= 50 ? { emoji: '📖', label: 'Keep studying!', color: '#38bdf8' }
                :             { emoji: '💪', label: 'Keep practicing!', color: '#f87171' };
    return (
      <section className="fade-in" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>{grade.emoji}</div>
        <h2 style={{ color: grade.color, fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
          {grade.label}
        </h2>
        <p style={{ color: '#64748b', marginBottom: 32 }}>
          {level.toUpperCase()} · {mode} · {score}/{questions.length} correct
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Ring pct={pct} color={grade.color} size={120} />
        </div>

        {/* Score breakdown */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { label: 'Correct',   val: score,                  color: '#34d399' },
            { label: 'Incorrect', val: questions.length-score, color: '#f87171' },
            { label: 'Accuracy',  val: `${pct}%`,              color: grade.color },
          ].map(s => (
            <div key={s.label} style={{ padding: '16px 24px', borderRadius: 14, minWidth: 90,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={startQuiz}
            style={{ padding: '13px 32px' }}>🔄 Retry Same Level</button>
          <button className="btn btn-ghost" onClick={() => setPhase('setup')}
            style={{ padding: '13px 32px' }}>⚙️ Change Settings</button>
        </div>
      </section>
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  const question = mode === 'ja→en' ? q.word.word : q.word.meaning;
  const optionKey= mode === 'ja→en' ? 'meaning' : 'word';
  const isCorrect= chosen !== null && chosen === q.correctIdx;
  const lmc      = LEVEL_META[level];

  return (
    <section className="fade-in" id="quiz-active-section">
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`badge badge-${level}`}>{level.toUpperCase()}</span>
          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{mode}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {streak > 1 && (
            <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>
              🔥 {streak} streak
            </span>
          )}
          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {qIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: 28 }}>
        <div className="progress-fill"
          style={{ width: `${((qIndex) / questions.length) * 100}%`,
                   background: lmc?.color || '#7c6ff7' }} />
      </div>

      {/* Score */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: i < qIndex ? 20 : 8, height: 8, borderRadius: 99,
              transition: 'all 0.3s',
              background: i < qIndex
                ? (i < score || (i === qIndex - 1 && isCorrect) ? '#34d399' : '#f87171')
                : i === qIndex ? (lmc?.color || '#7c6ff7') : 'rgba(255,255,255,0.1)',
            }} />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div style={{
        background: `linear-gradient(135deg, ${lmc?.bg || 'rgba(124,111,247,0.1)'}, rgba(17,24,39,0.8))`,
        border: `1px solid ${lmc?.border || 'rgba(124,111,247,0.2)'}`,
        borderRadius: 20, padding: '40px 28px', textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em',
                       textTransform: 'uppercase', marginBottom: 16 }}>
          {mode === 'ja→en' ? 'What does this mean?' : 'Which word matches?'}
        </div>
        <div style={{
          fontFamily: mode === 'ja→en' ? "'Noto Sans JP', sans-serif" : 'inherit',
          fontSize: mode === 'ja→en' ? '3.5rem' : '1.6rem',
          color: lmc?.color || '#a78bfa', fontWeight: 700, lineHeight: 1.2,
        }}>
          {question}
        </div>
        {q.word.reading && mode === 'ja→en' && flipped && (
          <div style={{ color: '#64748b', fontFamily: "'Noto Sans JP'", fontSize: '1.1rem', marginTop: 12 }}>
            【{q.word.reading}】
          </div>
        )}
      </div>

      {/* Choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {q.choices.map((choice, i) => {
          const isThis    = i === q.correctIdx;
          const isChosen  = i === chosen;
          const revealed  = chosen !== null;
          let bg = 'rgba(255,255,255,0.03)';
          let border = 'rgba(255,255,255,0.08)';
          let color  = '#e2e8f0';
          if (revealed) {
            if (isThis)   { bg = 'rgba(52,211,153,0.12)'; border = '#34d399'; color = '#34d399'; }
            else if (isChosen) { bg = 'rgba(248,113,113,0.12)'; border = '#f87171'; color = '#f87171'; }
          }
          return (
            <button key={i}
              onClick={() => handleChoice(i)}
              disabled={chosen !== null}
              style={{
                width: '100%', padding: '14px 18px',
                borderRadius: 12, border: `1px solid ${border}`,
                background: bg, color: color,
                cursor: chosen !== null ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.25s', textAlign: 'left',
                fontFamily: mode === 'en→ja' ? "'Noto Sans JP', sans-serif" : 'inherit',
                fontSize: '1rem',
              }}>
              <span>{choice[optionKey]}</span>
              {revealed && isThis  && <span>✅</span>}
              {revealed && isChosen && !isThis && <span>❌</span>}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {chosen !== null && (
        <button className="btn btn-primary fade-in" onClick={nextQuestion}
          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem' }}>
          {qIndex + 1 >= questions.length ? '🏁 See Results' : 'Next →'}
        </button>
      )}
    </section>
  );
}
