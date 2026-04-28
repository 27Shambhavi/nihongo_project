// src/components/OCR.js — Image Upload & OCR Module
import React, { useState, useRef, useCallback } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CHAR_COLOR = {
  hiragana: '#34d399',
  katakana: '#38bdf8',
  kanji:    '#f87171',
  latin:    '#fbbf24',
  punctuation: '#94a3b8',
  other:    '#94a3b8',
};

export default function OCR() {
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  }, [handleFile]);

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API}/ocr`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'OCR request failed.');
    } finally {
      setLoading(false);
    }
  };

  const charDetail = result?.analysis?.char_detail || [];
  const counts     = result?.analysis?.counts || {};
  const total      = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <section id="ocr-section">
      <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.92rem' }}>
        Upload an image containing Japanese text. Tesseract OCR will extract and analyse each character.
      </p>

      {/* Drop Zone */}
      <div
        id="ocr-dropzone"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? '#7c6ff7' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 16,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(124,111,247,0.07)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.22s ease',
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          {preview ? '✅ Image ready — click Extract Text to analyse' : 'Drag & drop or click to select image'}
        </p>
        {preview && (
          <img
            src={preview} alt="preview"
            style={{ maxHeight: 180, maxWidth: '100%', marginTop: 16,
                     borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}
          />
        )}
        <input
          ref={fileRef} type="file" accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      <button
        id="ocr-submit-btn"
        className="btn btn-primary"
        onClick={submit}
        disabled={!file || loading}
        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '13px' }}
      >
        {loading ? <><span className="spinner" /> Extracting…</> : '🔍 Extract Text'}
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10,
                      background: 'rgba(248,113,113,0.1)', color: '#f87171',
                      border: '1px solid rgba(248,113,113,0.2)', fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="fade-in" style={{ marginTop: 28 }}>
          {/* Extracted text */}
          <div className="section-label">Extracted Text</div>
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 20, marginBottom: 24,
            fontFamily: "'Noto Sans JP', sans-serif", fontSize: '1.3rem',
            lineHeight: 2, color: '#e2e8f0', minHeight: 60,
          }}>
            {result.text || '(no text detected)'}
          </div>

          {/* Script bar */}
          <div className="section-label">Script Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => (
              <div key={k}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                               fontSize: '0.8rem', marginBottom: 4, color: '#94a3b8' }}>
                  <span style={{ textTransform: 'capitalize', color: CHAR_COLOR[k] || '#94a3b8' }}>{k}</span>
                  <span>{v} ({Math.round(v / total * 100)}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"
                    style={{ width: `${(v / total) * 100}%`,
                             background: CHAR_COLOR[k] || '#94a3b8' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Character chips */}
          {charDetail.length > 0 && (
            <>
              <div className="section-label">Character Analysis</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {charDetail.map((item, i) => {
                  const cls = `char-chip chip-${item.type}` ;
                  return (
                    <div key={i} className={cls} title={item.type}>
                      {item.char}
                      <span>{item.type.slice(0, 4)}</span>
                    </div>
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
