import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit,
  Zap,
  Target,
  BarChart4,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Cpu,
  Layers
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: BrainCircuit,
      title: 'Real-Time Adaptive Difficulty',
      desc: 'The AI dynamically tunes question difficulty based on your previous answer—stepping up to probe edge cases when you excel, or reinforcing core fundamentals when you need support.'
    },
    {
      icon: Zap,
      title: 'Instant Multi-Metric Evaluation',
      desc: 'Get immediate granular scoring on technical accuracy, communication clarity, problem-solving depth, and answer relevance after every response.'
    },
    {
      icon: Target,
      title: 'Granular Skill-Gap Analysis',
      desc: 'Pinpoints specific technical gaps (e.g., SQL window functions, React reconciliation, JVM memory) and ranks their severity.'
    },
    {
      icon: BarChart4,
      title: 'Actionable Learning Roadmaps',
      desc: 'Receive personalized study resources and a 4-step improvement plan tailored to the exact questions you encountered.'
    }
  ];

  const roles = [
    'Frontend Developer',
    'Python Developer',
    'Java Developer',
    'Data Analyst',
    'Full Stack Developer',
    'DevOps & Cloud Engineer',
    'HR & Behavioral'
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '24px'
          }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              Next-Gen AI Mock Interview Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: '24px'
          }}>
            Master Technical Interviews with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Real-Time Adaptive AI
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            marginBottom: '36px',
            lineHeight: 1.6
          }}>
            Simulate realistic FAANG-level interviews tailored to your target role. Experience dynamic questions that adapt to your exact skill level and receive deep hiring-manager feedback.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Link
              to={user ? '/interview/setup' : '/register'}
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '1.05rem' }}
            >
              Start Free Mock Interview
              <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1.05rem' }}
              >
                Try Demo Account
              </Link>
            )}
          </div>

          {/* Quick Role Badges */}
          <div style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginRight: '6px' }}>
              Supported Roles:
            </span>
            {roles.map(r => (
              <span
                key={r}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mock Preview Card */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div className="glass-panel" style={{ padding: '36px', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ef4444'
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#f59e0b'
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981'
              }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginLeft: '12px' }}>
                Live Interview Engine Preview
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge-medium">Adapted to: Medium</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>
                Question 2 of 5
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text-main)' }}>
              "How does React's `useEffect` hook handle dependencies and cleanup? What are the common causes of infinite render loops?"
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Category: React Hooks & Lifecycle | Expected: dependency array, cleanup function, stale closures
            </p>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: '#a5b4fc'
          }}>
            Candidate Answer: "useEffect runs after render. If dependencies change, the previous cleanup runs, then the new effect. Passing an object created inside render causes infinite loops due to referential equality checks..."
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>
                AI Evaluation: Score 86/100 (Difficulty Increased to Hard)
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Strong grasp of dependency equality and cleanup cycles. Next question will probe Concurrent Mode.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', fontSize: '0.78rem' }}>Tech: 88</span>
              <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', fontSize: '0.78rem' }}>Comm: 85</span>
              <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', fontSize: '0.78rem' }}>Problem: 85</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Built for Serious Technical Growth
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Everything you need to turn interview anxiety into confident mastery.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '32px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Icon size={24} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
