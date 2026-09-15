import React from 'react';

export function ScoreGauge({ score = 0, size = 140, strokeWidth = 10, label = 'Overall Score' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = 'var(--primary)';
  if (clampedScore >= 80) strokeColor = 'var(--success)';
  else if (clampedScore >= 60) strokeColor = 'var(--secondary)';
  else if (clampedScore >= 45) strokeColor = 'var(--warning)';
  else strokeColor = 'var(--danger)';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: size > 120 ? '2rem' : '1.4rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          lineHeight: 1
        }}>
          {clampedScore}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>/ 100</span>
      </div>
      {label && (
        <span style={{
          marginTop: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          {label}
        </span>
      )}
    </div>
  );
}
