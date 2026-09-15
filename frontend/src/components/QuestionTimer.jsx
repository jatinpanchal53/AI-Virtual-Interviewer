import React, { useState, useEffect } from 'react';
import { Clock, Pause, Play } from 'lucide-react';

export function QuestionTimer({ onTick, isPaused = false }) {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (active && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (onTick) onTick(next);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [active, isPaused, onTick]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid var(--border-subtle)',
      fontSize: '0.85rem',
      fontFamily: 'var(--font-mono)'
    }}>
      <Clock size={15} color="var(--secondary)" />
      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatTime(seconds)}</span>
      <button
        onClick={() => setActive(!active)}
        type="button"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)'
        }}
        title={active ? 'Pause timer' : 'Resume timer'}
      >
        {active ? <Pause size={12} /> : <Play size={12} />}
      </button>
    </div>
  );
}
