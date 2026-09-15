import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  Layout,
  Code2,
  Coffee,
  BarChart3,
  Layers,
  Cloud,
  Users,
  Briefcase,
  Sliders,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Github,
  Search,
  CheckCircle2,
  FileCode2,
  FolderTree
} from 'lucide-react';

const ICON_MAP = {
  Layout: Layout,
  Code2: Code2,
  Coffee: Coffee,
  BarChart3: BarChart3,
  Layers: Layers,
  Cloud: Cloud,
  Users: Users
};

export function InterviewSetupPage() {
  const [setupMode, setSetupMode] = useState('role'); // 'role' | 'github'
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // GitHub State
  const [repoUrl, setRepoUrl] = useState('');
  const [analyzingRepo, setAnalyzingRepo] = useState(false);
  const [repoAnalysis, setRepoAnalysis] = useState(null);

  // Interview Parameters
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState('Technical');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getRoles()
      .then(data => {
        setRoles(data);
        if (data.length > 0) {
          setSelectedRole(data[0]);
        }
      })
      .catch(() => {
        setError('Failed to fetch available roles');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyzeRepo = async () => {
    if (!repoUrl.trim()) return;
    setError('');
    setAnalyzingRepo(true);
    try {
      const data = await api.analyzeRepo(repoUrl.trim());
      setRepoAnalysis(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze GitHub repository');
    } finally {
      setAnalyzingRepo(false);
    }
  };

  const handleStart = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        experienceLevel,
        interviewType: setupMode === 'github' ? 'Project Defense' : interviewType,
        totalQuestions
      };

      if (setupMode === 'github') {
        if (!repoUrl.trim()) {
          throw new Error('Please enter a GitHub repository URL');
        }
        payload.repoUrl = repoUrl.trim();
        payload.role = repoAnalysis?.fullName ? `${repoAnalysis.fullName} Project Defense` : 'GitHub Project Defense';
      } else {
        if (!selectedRole) {
          throw new Error('Please select a target job role');
        }
        payload.role = selectedRole.title;
      }

      const interview = await api.createInterview(payload);
      navigate(`/interview/${interview.id}/live`);
    } catch (err) {
      setError(err.message || 'Failed to start interview');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} className="spinner" color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px 20px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sliders size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            Interview Setup & Mode Selection
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Configure Your Mock Session</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Choose between standard role-based technical questions or deep project defense on your own GitHub repository.
        </p>
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

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        padding: '6px',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        width: 'fit-content'
      }}>
        <button
          type="button"
          onClick={() => setSetupMode('role')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: setupMode === 'role' ? 'var(--primary)' : 'transparent',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Briefcase size={17} />
          1. Role-Based Mock Interview
        </button>

        <button
          type="button"
          onClick={() => setSetupMode('github')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: setupMode === 'github' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'transparent',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Github size={17} />
          2. GitHub Repo Project Defense
          <span style={{
            fontSize: '0.68rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '2px 6px',
            borderRadius: '4px',
            color: '#34d399'
          }}>
            AI Ingest
          </span>
        </button>
      </div>

      {/* Mode 1: Role Selection Grid */}
      {setupMode === 'role' && (
        <section style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--secondary)" />
            Select Target Job Role
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {roles.map(r => {
              const Icon = ICON_MAP[r.icon] || Code2;
              const isSelected = selectedRole?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r)}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                    boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={22} color={isSelected ? '#fff' : 'var(--text-muted)'} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{r.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{r.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {r.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-muted)'
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mode 2: GitHub Repository Input & Ingestion */}
      {setupMode === 'github' && (
        <section className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Github size={20} color="var(--secondary)" />
            Paste Your GitHub Repository Link
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            The AI will inspect your repository's structure, README, package manifests, and architectural layers to construct realistic code defense questions.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="https://github.com/facebook/react or username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeRepo()}
              />
            </div>
            <button
              type="button"
              onClick={handleAnalyzeRepo}
              disabled={analyzingRepo || !repoUrl.trim()}
              className="btn btn-secondary"
              style={{ padding: '12px 22px', borderColor: 'var(--secondary)' }}
            >
              {analyzingRepo ? <Loader2 size={16} className="spinner" /> : <Search size={16} />}
              {analyzingRepo ? 'Analyzing Repo...' : 'Inspect Repo'}
            </button>
          </div>

          {/* Quick Repo Examples */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '24px' }}>
            <span>Quick test repos:</span>
            {[
              { label: 'Express.js', url: 'https://github.com/expressjs/express' },
              { label: 'Next.js', url: 'https://github.com/vercel/next.js' },
              { label: 'FastAPI', url: 'https://github.com/fastapi/fastapi' }
            ].map(sample => (
              <button
                key={sample.label}
                type="button"
                onClick={() => { setRepoUrl(sample.url); setRepoAnalysis(null); }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px 8px',
                  fontSize: '0.78rem'
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Analyzed Repo Insights Card */}
          {repoAnalysis && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--secondary)" />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {repoAnalysis.fullName}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600 }}>
                  Primary: {repoAnalysis.primaryLanguage}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {repoAnalysis.description}
              </p>

              {/* Detected Tech Badges */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Detected Technologies & Dependencies:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(repoAnalysis.detectedTech || []).map((t, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'var(--text-main)'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* File layout sample */}
              {repoAnalysis.keyFiles && repoAnalysis.keyFiles.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Key Architecture Files:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {repoAnalysis.keyFiles.slice(0, 6).map((f, idx) => (
                      <span key={idx} style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.3)',
                        color: '#94a3b8'
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Step 2: Experience & Type & Questions */}
      <section className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
          2. Difficulty & Length Parameters
        </h3>

        <div className="grid grid-cols-3 gap-6">
          {/* Experience Level */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>
              Experience Level
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    background: experienceLevel === lvl ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    borderColor: experienceLevel === lvl ? 'var(--primary)' : 'var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  {lvl} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({lvl === 'Beginner' ? 'Easy Start' : lvl === 'Intermediate' ? 'Medium Start' : 'Hard Start'})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type (or fixed if GitHub mode) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>
              Interview Focus
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {setupMode === 'github' ? (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid var(--secondary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}>
                  Project Defense & Architecture
                </div>
              ) : (
                ['Technical', 'HR', 'Mixed'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInterviewType(type)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      background: interviewType === type ? 'var(--secondary)' : 'rgba(255,255,255,0.04)',
                      border: '1px solid',
                      borderColor: interviewType === type ? 'var(--secondary)' : 'var(--border-subtle)',
                      color: interviewType === type ? '#090d16' : '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    {type} {type === 'Mixed' ? '(Tech + HR)' : ''}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>
              Number of Questions
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[3, 5, 7].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalQuestions(num)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    background: totalQuestions === num ? 'var(--accent-purple)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    borderColor: totalQuestions === num ? 'var(--accent-purple)' : 'var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  {num} Questions {num === 3 ? '(Quick Drill)' : num === 5 ? '(Standard Mock)' : '(Deep Evaluation)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Launch CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '24px',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid var(--border-active)',
        borderRadius: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {setupMode === 'github' ? 'Ready for GitHub Project Defense' : `Ready for ${selectedRole?.title} Interview`}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {totalQuestions} questions | {experienceLevel} Baseline | Voice-Command Enabled 🎙️
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={submitting || (setupMode === 'github' && !repoUrl.trim())}
          className="btn btn-primary"
          style={{ padding: '14px 32px', fontSize: '1.05rem' }}
        >
          {submitting ? <Loader2 size={20} className="spinner" /> : (
            <>
              Launch Adaptive Interview
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
