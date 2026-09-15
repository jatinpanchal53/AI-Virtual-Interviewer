import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Universal Voice & Audio Interview Hook
 * Supports Web Speech API (SpeechSynthesis for AI Voice Out & SpeechRecognition for Candidate Mic In)
 */
export function useVoiceInterview({ onTranscript, onSubmit, onRepeatQuestion, onClearAnswer } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [lastCommand, setLastCommand] = useState('');
  const [micError, setMicError] = useState('');

  // Keep callback refs stable across renders
  const callbacksRef = useRef({ onTranscript, onSubmit, onRepeatQuestion, onClearAnswer });
  useEffect(() => {
    callbacksRef.current = { onTranscript, onSubmit, onRepeatQuestion, onClearAnswer };
  });

  const activeUtteranceRef = useRef(null);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  const isTtsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const isSttSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Resume SpeechSynthesis on first user interaction to bypass autoplay restrictions
  useEffect(() => {
    const unlockAudio = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Stop AI Voice Out
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      activeUtteranceRef.current = null;
      setIsSpeaking(false);
    }
  }, []);

  // AI Voice Out (Text-to-Speech)
  const speakQuestion = useCallback((text) => {
    if (!isTtsSupported || typeof window === 'undefined' || !window.speechSynthesis || !text) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const cleanText = text.replace(/[`*_#]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick natural sounding English voice if loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira')) && 
          v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };
      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        setIsSpeaking(false);
        activeUtteranceRef.current = null;
      };

      // Keep strong reference to prevent GC bug in Chromium
      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak error:', err);
      setIsSpeaking(false);
    }
  }, [isTtsSupported, speechRate]);

  // Stop Candidate Microphone
  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
  }, []);

  // Start Candidate Microphone
  const startListening = useCallback(() => {
    if (!isSttSupported) {
      setMicError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setMicError('');
    stopSpeaking(); // Mute AI before listening

    if (recognitionRef.current) {
      try {
        isListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start caught error:', err.message);
        // If already started, update state
        setIsListening(true);
        isListeningRef.current = true;
      }
    }
  }, [isSttSupported, stopSpeaking]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  // Initialize Speech Recognition once
  useEffect(() => {
    if (!isSttSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setMicError('');
    };

    recognition.onend = () => {
      // If user intended to keep listening, attempt restart
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (_) {
          setIsListening(false);
          isListeningRef.current = false;
        }
      } else {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error event:', event.error);
      if (event.error === 'not-allowed') {
        setMicError('Microphone access was denied. Please allow microphone permissions in your browser bar.');
        setIsListening(false);
        isListeningRef.current = false;
      } else if (event.error === 'no-speech') {
        // Normal silence timeout, ignore
      } else {
        setMicError(`Speech error: ${event.error}`);
      }
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const lower = transcriptSegment.toLowerCase().trim();

          // Check for Voice Commands
          if (lower.includes('submit answer') || lower.includes('send answer') || lower === 'submit') {
            setLastCommand('Submit Answer');
            if (callbacksRef.current.onSubmit) callbacksRef.current.onSubmit();
            return;
          }
          if (lower.includes('repeat question') || lower.includes('read question') || lower.includes('replay question')) {
            setLastCommand('Repeat Question');
            if (callbacksRef.current.onRepeatQuestion) callbacksRef.current.onRepeatQuestion();
            return;
          }
          if (lower.includes('clear answer') || lower.includes('erase answer')) {
            setLastCommand('Clear Answer');
            if (callbacksRef.current.onClearAnswer) callbacksRef.current.onClearAnswer();
            return;
          }

          currentTranscript += transcriptSegment + ' ';
        } else {
          currentTranscript += transcriptSegment;
        }
      }

      if (currentTranscript && callbacksRef.current.onTranscript) {
        callbacksRef.current.onTranscript(currentTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      try {
        recognition.stop();
      } catch (_) {}
    };
  }, [isSttSupported]);

  return {
    isSpeaking,
    isListening,
    autoSpeak,
    setAutoSpeak,
    speechRate,
    setSpeechRate,
    lastCommand,
    micError,
    speakQuestion,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
    isTtsSupported,
    isSttSupported
  };
}
