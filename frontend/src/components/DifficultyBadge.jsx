import React from 'react';
import { Zap, ShieldCheck, Flame } from 'lucide-react';

export function DifficultyBadge({ difficulty = 'Medium', showIcon = true }) {
  const diff = (difficulty || 'Medium').toLowerCase();

  let className = 'badge-medium';
  let Icon = Zap;

  if (diff === 'easy') {
    className = 'badge-easy';
    Icon = ShieldCheck;
  } else if (diff === 'hard') {
    className = 'badge-hard';
    Icon = Flame;
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
    >
      {showIcon && <Icon size={13} />}
      {difficulty}
    </span>
  );
}
