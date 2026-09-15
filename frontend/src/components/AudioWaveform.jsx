import React from 'react';

export function AudioWaveform({ isActive = false, color = 'var(--primary)', label = '', barCount = 12 }) {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px 14px',
      borderRadius: '20px',
      background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.04)',
      border: `1px solid ${isActive ? color : 'var(--border-subtle)'}`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        height: '18px'
      }}>
        {bars.map((b) => {
          const delay = (b * 0.12) % 0.8;
          const minHeight = 4;
          const maxHeight = 16;
          return (
            <span
              key={b}
              style={{
                width: '3px',
                borderRadius: '3px',
                background: color,
                height: isActive ? `${maxHeight}px` : `${minHeight}px`,
                animation: isActive ? `waveBar 0.8s ease-in-out infinite alternate` : 'none',
                animationDelay: `${delay}s`,
                transition: 'height 0.2s ease'
              }}
            />
          );
        })}
      </div>
      {label && (
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: isActive ? color : 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </span>
      )}
    </div>
  );
}
