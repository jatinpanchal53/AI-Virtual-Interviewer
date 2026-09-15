import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { ScoreGauge } from '../components/ScoreGauge';
import { DifficultyBadge } from '../components/DifficultyBadge';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Compass,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  History,
  Loader2,
  FileText,
  Sparkles,
  Target
} from 'lucide-react';

export function ReportDashboardPage() {
  const { interviewId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    api.getResults(interviewId)
      .then(data => {
        setReport(data);
        // Expand first question by default
        if (data.questions && data.questions.length > 0) {
          setExpandedQuestions({ [data.questions[0].id]: true });
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load report');
      })
      .finally(() => setLoading(false));
  }, [interviewId]);

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: '16px'
      }}>
        <Loader2 size={40} className="spinner" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Synthesizing Full Performance Report & Skill Gaps...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', fontSize: '1.1rem', marginBottom: '20px' }}>
          {error || 'Report not available'}
        </p>
        <Link to="/history" className="btn btn-secondary">
          Back to History
        </Link>
      </div>
    );
  }

  const { breakdown = {} } = report;

  return (
    <div className="container" style={{ padding: '40px 20px 100px 20px', maxWidth: '1080px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Trophy size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {report.interviewType === 'Project Defense' ? 'GitHub Code Defense Report' : 'Interview Performance Report'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            {report.role}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Completed on {new Date(report.completedAt || report.createdAt).toLocaleDateString()} • {report.experienceLevel} • {report.interviewType} Focus
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/interview/setup" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <RotateCcw size={16} />
            Retake Interview
          </Link>
          <Link to="/history" className="btn btn-secondary" style={{ padding: '10px 18px' }}>
            <History size={16} />
            All Sessions
          </Link>
        </div>
      </div>

      {/* Score Overview Panel */}
      <div className="glass-panel" style={{ padding: '36px', marginBottom: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '36px',
          alignItems: 'center'
        }}>
          {/* Main Circular Gauge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid var(--border-subtle)',
            paddingRight: '20px'
          }}>
            <ScoreGauge score={report.overallScore || 0} size={160} strokeWidth={12} label="Composite Performance Score" />
          </div>

          {/* Subscore Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
              Competency Breakdown
            </h3>

            {[
              { label: 'Technical Accuracy & Depth', value: breakdown.technicalScore || 0, color: 'var(--primary)' },
              { label: 'Problem Solving & Structure', value: breakdown.problemSolvingScore || 0, color: 'var(--secondary)' },
              { label: 'Communication & Articulation', value: breakdown.communicationScore || 0, color: 'var(--accent-purple)' },
              { label: 'Answer Relevance & Precision', value: breakdown.relevanceScore || 0, color: 'var(--accent-pink)' }
            ].map((metric, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{metric.label}</span>
                  <span style={{ fontWeight: 700, color: metric.color }}>{metric.value}/100</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${metric.value}%`,
                    height: '100%',
                    background: metric.color,
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--secondary)" />
            AI Executive Evaluation Summary
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {report.summary}
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '32px' }}>
        {/* Strengths */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--success)'
          }}>
            <CheckCircle2 size={20} />
            Identified Strengths
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(report.strengths || []).map((st, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}>
                <span style={{ color: 'var(--success)', marginTop: '2px' }}>✓</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--warning)'
          }}>
            <AlertTriangle size={20} />
            Areas for Growth
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(report.weaknesses || []).map((wk, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}>
                <span style={{ color: 'var(--warning)', marginTop: '2px' }}>•</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skill-Gap Analysis & Actionable Plan */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Target size={20} color="var(--primary)" />
          Skill-Gap Analysis Matrix
        </h3>

        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '28px' }}>
          {(report.skillGaps || []).map((gapItem, idx) => {
            const severityColor = gapItem.severity === 'High' ? 'var(--danger)' : gapItem.severity === 'Medium' ? 'var(--warning)' : 'var(--secondary)';
            return (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{gapItem.skill}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `${severityColor}20`,
                    color: severityColor,
                    border: `1px solid ${severityColor}50`
                  }}>
                    {gapItem.severity} Severity
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {gapItem.gap}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recommended Topics */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} color="var(--secondary)" />
            Recommended Study Topics
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(report.recommendedTopics || []).map((top, idx) => (
              <span key={idx} style={{
                fontSize: '0.85rem',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: 'var(--secondary)',
                fontWeight: 600
              }}>
                {top}
              </span>
            ))}
          </div>
        </div>

        {/* Personalized Improvement Plan */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} color="var(--accent-purple)" />
            Personalized 4-Step Action Plan
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(report.improvementPlan || []).map((step, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-purple)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Per-Question Detailed Breakdown */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="var(--primary)" />
          Question-by-Question Detailed Review
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(report.questions || []).map((qItem, idx) => {
            const isExpanded = !!expandedQuestions[qItem.id];
            return (
              <div
                key={qItem.id || idx}
                style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div
                  onClick={() => toggleQuestion(qItem.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--primary)'
                    }}>
                      Q{qItem.order || idx + 1}
                    </span>
                    <DifficultyBadge difficulty={qItem.difficulty} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {qItem.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: qItem.overallScore >= 80 ? 'var(--success)' : qItem.overallScore >= 50 ? 'var(--warning)' : 'var(--danger)'
                    }}>
                      Score: {qItem.overallScore}/100
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '14px', color: 'var(--text-main)' }}>
                      "{qItem.questionText}"
                    </p>

                    {/* Candidate Answer */}
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      padding: '14px 18px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#cbd5e1'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Candidate Answer:
                      </div>
                      {qItem.answerText || '(No answer provided)'}
                    </div>

                    {/* AI Feedback */}
                    <div style={{
                      background: 'rgba(99, 102, 241, 0.08)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      padding: '14px 18px',
                      borderRadius: '8px',
                      marginBottom: '14px'
                    }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                        Hiring Lead Feedback:
                      </span>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {qItem.feedback}
                      </p>
                    </div>

                    {/* Strengths & Weaknesses for this question */}
                    <div className="grid grid-cols-2 gap-4">
                      {qItem.strengths && qItem.strengths.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>Strengths:</span>
                          <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {qItem.strengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                      {qItem.missingConcepts && qItem.missingConcepts.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning)' }}>Missing Concepts:</span>
                          <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {qItem.missingConcepts.map((m, mIdx) => <li key={mIdx}>{m}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
