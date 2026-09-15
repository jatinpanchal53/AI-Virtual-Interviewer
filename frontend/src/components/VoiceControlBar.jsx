import React, { useState } from 'react';
import { AudioWaveform } from './AudioWaveform';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Command,
  AlertCircle
} from 'lucide-react';

export function VoiceControlBar({
  isSpeaking,
  isListening,
  autoSpeak,
  onToggleAutoSpeak,
  onToggleListening,
  onReplayQuestion,
  isTtsSupported = true,
  isSttSupported = true,
  lastCommand = '',
  micError = ''
}) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px'
      }}>
        {/* Left: Waveform & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSpeaking ? (
            <AudioWaveform isActive={true} color="var(--secondary)" label="AI Speaking Aloud..." />
          ) : isListening ? (
            <AudioWaveform isActive={true} color="var(--success)" label="Listening to Microphone..." />
          ) : (
            <AudioWaveform isActive={false} color="var(--text-dim)" label="Audio Ready" />
          )}

          {lastCommand && (
            <span style={{
              fontSize: '0.78rem',
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(99, 102, 241, 0.25)',
              color: '#818cf8',
              fontWeight: 700
            }}>
              Voice Command: "{lastCommand}"
            </span>
          )}
        </div>

        {/* Right: Interactive Audio Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Replay Question TTS Button */}
          <button
            type="button"
            onClick={onReplayQuestion}
            className="btn btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              color: 'var(--secondary)'
            }}
            title="Speak the current question aloud"
          >
            <Volume2 size={16} />
            {isSpeaking ? 'Restart Audio' : 'Play Question Audio'}
          </button>

          {/* Auto Speak Toggle */}
          <button
            type="button"
            onClick={onToggleAutoSpeak}
            className="btn btn-secondary"
            style={{
              padding: '8px 12px',
              fontSize: '0.85rem',
              borderColor: autoSpeak ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-subtle)',
              color: autoSpeak ? 'var(--text-main)' : 'var(--text-muted)'
            }}
            title={autoSpeak ? 'Auto AI voice is ON' : 'Auto AI voice is OFF'}
          >
            {autoSpeak ? <Volume2 size={15} color="var(--primary)" /> : <VolumeX size={15} />}
            AI Auto-Speak: {autoSpeak ? 'ON' : 'OFF'}
          </button>

          {/* Candidate Mic Toggle Button */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`btn ${isListening ? 'pulse-glow' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              background: isListening ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: `1px solid ${isListening ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`
            }}
          >
            {isListening ? (
              <>
                <Mic size={16} />
                Stop Microphone
              </>
            ) : (
              <>
                <MicOff size={16} />
                Speak Answer
              </>
            )}
          </button>

          {/* Voice Commands Guide Toggle */}
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Voice Commands Guide"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {/* Mic Permission Warning Banner */}
      {micError && (
        <div style={{
          marginTop: '8px',
          padding: '10px 14px',
          background: 'var(--danger-bg)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--danger)',
          fontSize: '0.82rem'
        }}>
          <AlertCircle size={16} />
          <span>{micError}</span>
        </div>
      )}

      {/* Voice Commands Cheat Sheet */}
      {showHelp && (
        <div style={{
          marginTop: '10px',
          padding: '14px 18px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Command size={15} color="var(--primary)" />
              Hands-Free Voice Commands
            </span>
            <button
              onClick={() => setShowHelp(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            <div><strong style={{ color: 'var(--secondary)' }}>"Submit answer"</strong> → Evaluates & moves to next question</div>
            <div><strong style={{ color: 'var(--secondary)' }}>"Repeat question"</strong> → AI reads question aloud again</div>
            <div><strong style={{ color: 'var(--secondary)' }}>"Clear answer"</strong> → Erases text to re-speak</div>
          </div>
        </div>
      )}
    </div>
  );
}
