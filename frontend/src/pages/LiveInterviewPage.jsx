import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { QuestionTimer } from '../components/QuestionTimer';
import { VoiceControlBar } from '../components/VoiceControlBar';
import { useVoiceInterview } from '../hooks/useVoiceInterview';
import {
  BrainCircuit,
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  Github,
  ExternalLink,
  Mic
} from 'lucide-react';

export function LiveInterviewPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [error, setError] = useState('');

  const answerRef = useRef('');
  answerRef.current = answerText;

  // Submit Answer handler
  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !answerRef.current.trim()) return;
    setError('');
    setEvaluating(true);
    try {
      const result = await api.submitAnswer(interviewId, {
        questionId: currentQuestion.id,
        answerText: answerRef.current.trim()
      });

      setLastFeedback({
        evaluation: result.evaluation,
        adaptationReason: result.nextQuestion?.adaptationReason,
        adaptationDirection: result.nextQuestion?.adaptationDirection
      });

      if (result.isFinished) {
        setTimeout(() => {
          navigate(`/interview/${interviewId}/report`);
        }, 1200);
      } else {
        setCurrentQuestion(result.nextQuestion);
        setAnswerText('');
      }
    } catch (err) {
      setError(err.message || 'Failed to evaluate answer');
    } finally {
      setEvaluating(false);
    }
  }, [currentQuestion, interviewId, navigate]);

  // Voice Interview Hook
  const {
    isSpeaking,
    isListening,
    autoSpeak,
    setAutoSpeak,
    lastCommand,
    speakQuestion,
    stopSpeaking,
    toggleListening,
    isTtsSupported,
    isSttSupported
  } = useVoiceInterview({
    onTranscript: (transcript) => {
      setAnswerText(prev => prev ? `${prev} ${transcript}` : transcript);
    },
    onSubmit: () => {
      handleSubmitAnswer();
    },
    onRepeatQuestion: () => {
      if (currentQuestion) {
        speakQuestion(currentQuestion.questionText);
      }
    },
    onClearAnswer: () => {
      setAnswerText('');
    }
  });

  // Fetch or initialize session
  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        const startResult = await api.startInterview(interviewId);
        
        if (startResult.status === 'completed') {
          navigate(`/interview/${interviewId}/report`);
          return;
        }

        setInterview(startResult.interview);
        setCurrentQuestion(startResult.currentQuestion);
      } catch (err) {
        setError(err.message || 'Failed to load interview session');
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [interviewId, navigate]);

  // Auto-speak new questions when loaded
  useEffect(() => {
    if (currentQuestion && autoSpeak) {
      speakQuestion(currentQuestion.questionText);
    }
  }, [currentQuestion, autoSpeak, speakQuestion]);

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
        <p style={{ color: 'var(--text-muted)' }}>Initializing AI Interview Room & Audio Channel...</p>
      </div>
    );
  }

  const order = currentQuestion?.order || 1;
  const total = currentQuestion?.totalQuestions || interview?.totalQuestions || 5;
  const progressPercent = Math.round((order / total) * 100);
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const isGitHubMode = !!interview?.repoUrl;

  return (
    <div className="container" style={{ padding: '30px 20px 80px 20px', maxWidth: '960px' }}>
      {/* Top Session Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Interview Session
            </span>
            {isGitHubMode && (
              <a
                href={interview.repoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  color: 'var(--secondary)',
                  textDecoration: 'none',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)'
                }}
              >
                <Github size={13} />
                {interview.repoName || 'Repo Defense'}
                <ExternalLink size={11} />
              </a>
            )}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {interview?.role} <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>({interview?.experienceLevel})</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <QuestionTimer key={currentQuestion?.id} isPaused={evaluating} />
          <DifficultyBadge difficulty={currentQuestion?.difficulty} />
        </div>
      </div>

      {/* Voice Control Bar (Audio Out + Microphone In + Voice Commands) */}
      <VoiceControlBar
        isSpeaking={isSpeaking}
        isListening={isListening}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
        onToggleListening={toggleListening}
        onReplayQuestion={() => currentQuestion && speakQuestion(currentQuestion.questionText)}
        isTtsSupported={isTtsSupported}
        isSttSupported={isSttSupported}
        lastCommand={lastCommand}
      />

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            Question {order} of {total}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{progressPercent}% Completed</span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Adaptive Transition Notification Banner */}
      {lastFeedback && (
        <div style={{
          background: lastFeedback.adaptationDirection === 'UP' 
            ? 'rgba(16, 185, 129, 0.1)' 
            : lastFeedback.adaptationDirection === 'DOWN' 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(99, 102, 241, 0.1)',
          border: `1px solid ${
            lastFeedback.adaptationDirection === 'UP' 
              ? 'rgba(16, 185, 129, 0.3)' 
              : lastFeedback.adaptationDirection === 'DOWN' 
                ? 'rgba(239, 68, 68, 0.3)' 
                : 'rgba(99, 102, 241, 0.3)'
          }`,
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {lastFeedback.adaptationDirection === 'UP' ? (
              <TrendingUp size={20} color="var(--success)" />
            ) : lastFeedback.adaptationDirection === 'DOWN' ? (
              <TrendingDown size={20} color="var(--danger)" />
            ) : (
              <Minus size={20} color="var(--primary)" />
            )}
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Previous Answer Evaluated: {lastFeedback.evaluation.overallScore}/100
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {lastFeedback.adaptationReason || lastFeedback.evaluation.feedback}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLastFeedback(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background: 'var(--danger-bg)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--danger)'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Question Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '6px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--primary)'
          }}>
            {currentQuestion?.category || (isGitHubMode ? 'Repository Code Defense' : 'General Question')}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Expected Focus: {(currentQuestion?.expectedTopics || []).slice(0, 3).join(', ')}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          lineHeight: 1.5,
          color: 'var(--text-main)',
          marginBottom: '24px'
        }}>
          {currentQuestion?.questionText}
        </h3>

        {/* Answer Text Area */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Your Response {isListening && <span style={{ color: 'var(--success)', fontWeight: 700 }}>• Transcribing voice in real time...</span>}
            </label>
            {isListening && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Say <strong style={{ color: 'var(--secondary)' }}>"Submit answer"</strong> aloud when finished
              </span>
            )}
          </div>

          <textarea
            disabled={evaluating}
            className="textarea-field"
            placeholder="Type or click 'Speak Answer' to talk... Explain your architectural decisions, trade-offs, and code structure."
            rows={8}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}>
            <span>Tip: Structured answers covering trade-offs and scaling score higher in problem-solving & communication.</span>
            <span>{wordCount} words | {answerText.length} characters</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px'
        }}>
          {answerText.length > 0 && (
            <button
              type="button"
              disabled={evaluating}
              onClick={() => setAnswerText('')}
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem' }}
            >
              <RotateCcw size={15} />
              Clear
            </button>
          )}

          <button
            type="button"
            disabled={evaluating || !answerText.trim()}
            onClick={handleSubmitAnswer}
            className="btn btn-primary"
            style={{ padding: '12px 28px', minWidth: '180px' }}
          >
            {evaluating ? (
              <>
                <Loader2 size={18} className="spinner" />
                Evaluating & Adapting...
              </>
            ) : (
              <>
                Submit Answer
                <Send size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluating State Notice */}
      {evaluating && (
        <div className="glass-panel pulse-glow" style={{
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid var(--primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              AI is analyzing technical depth, code trade-offs, and preparing question #{order + 1}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
