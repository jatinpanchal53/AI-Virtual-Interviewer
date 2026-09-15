import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import {
  History,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Play
} from 'lucide-react';

export function HistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getUserInterviews()
      .then(data => setInterviews(data))
      .catch(err => setError(err.message || 'Failed to fetch interview history'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Loader2 size={36} className="spinner" color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px 20px', maxWidth: '960px' }}>
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
            <History size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Interview Archive
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Your Interview History</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review past session reports, track your score progression, and identify skill growth.
          </p>
        </div>

        <Link to="/interview/setup" className="btn btn-primary">
          <PlusCircle size={16} />
          New Interview
        </Link>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--danger)'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Sparkles size={40} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No interview sessions yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
            Take your first adaptive AI mock interview to analyze your technical skills and generate a customized roadmap.
          </p>
          <Link to="/interview/setup" className="btn btn-primary">
            Start Your First Session
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {interviews.map(item => {
            const isCompleted = item.status === 'completed';
            const dateStr = new Date(item.completedAt || item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  {/* Score badge / status icon */}
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: isCompleted 
                      ? (item.overallScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : item.overallScore >= 50 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                      : 'rgba(99, 102, 241, 0.15)',
                    border: `1px solid ${
                      isCompleted 
                        ? (item.overallScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : item.overallScore >= 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)')
                        : 'rgba(99, 102, 241, 0.3)'
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isCompleted && item.overallScore !== null ? (
                      <>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          color: item.overallScore >= 80 ? 'var(--success)' : item.overallScore >= 50 ? 'var(--warning)' : 'var(--danger)',
                          lineHeight: 1
                        }}>
                          {Math.round(item.overallScore)}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>/ 100</span>
                      </>
                    ) : (
                      <Clock size={22} color="var(--primary)" />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{item.role}</h3>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: isCompleted ? 'var(--success)' : 'var(--primary)'
                      }}>
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>{item.experienceLevel} Level</span>
                      <span>•</span>
                      <span>{item.interviewType}</span>
                      <span>•</span>
                      <span>{item.totalQuestions} Questions</span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <Link
                      to={`/interview/${item.id}/report`}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.88rem', padding: '9px 18px' }}
                    >
                      View Report
                      <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <Link
                      to={`/interview/${item.id}/live`}
                      className="btn btn-primary"
                      style={{ fontSize: '0.88rem', padding: '9px 18px' }}
                    >
                      Resume Session
                      <Play size={15} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
