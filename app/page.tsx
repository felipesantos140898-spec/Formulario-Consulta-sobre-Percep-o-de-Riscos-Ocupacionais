'use client';

import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { TypeformContainer } from '@/components/TypeformContainer';
import { ReviewScreen } from '@/components/ReviewScreen';
import { SuccessScreen } from '@/components/SuccessScreen';
import { QUESTIONS_DATA } from '@/data/questions';
import { FormAnswers } from '@/types/form';

const STORAGE_ANSWERS_KEY = 'sonda_survey_answers_v1';
const STORAGE_INDEX_KEY = 'sonda_survey_index_v1';

export default function Home() {
  const [view, setView] = useState<'welcome' | 'questions' | 'review' | 'success'>('welcome');
  const [answers, setAnswers] = useState<FormAnswers>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_ANSWERS_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_INDEX_KEY);
        if (saved) {
          const idx = parseInt(saved, 10);
          if (!isNaN(idx) && idx >= 0 && idx < QUESTIONS_DATA.length) {
            return idx;
          }
        }
      } catch {
        // ignore
      }
    }
    return 0;
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [submissionDate, setSubmissionDate] = useState<string>('');

  // Persist draft whenever answers or index change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
      localStorage.setItem(STORAGE_INDEX_KEY, currentIndex.toString());
    } catch {
      // ignore
    }
  }, [answers, currentIndex]);

  // Global enter key listener on welcome screen
  useEffect(() => {
    if (view === 'welcome') {
      const handleWelcomeEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          setView('questions');
        }
      };
      window.addEventListener('keydown', handleWelcomeEnter);
      return () => window.removeEventListener('keydown', handleWelcomeEnter);
    }
  }, [view]);

  const handleUpdateAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleResetDraft = () => {
    if (confirm('Tem certeza que deseja limpar o rascunho e recomeçar do início?')) {
      try {
        localStorage.removeItem(STORAGE_ANSWERS_KEY);
        localStorage.removeItem(STORAGE_INDEX_KEY);
      } catch {
        // ignore
      }
      setAnswers({});
      setCurrentIndex(0);
      setView('welcome');
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const generatedId = `SND-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(now);

    setTimeout(() => {
      setSubmissionId(generatedId);
      setSubmissionDate(formattedDate);
      setIsSubmitting(false);
      setView('success');
      // Clear draft storage on successful submission
      try {
        localStorage.removeItem(STORAGE_ANSWERS_KEY);
        localStorage.removeItem(STORAGE_INDEX_KEY);
      } catch {
        // ignore
      }
    }, 600);
  };

  const handleRestartNew = () => {
    setAnswers({});
    setCurrentIndex(0);
    setView('welcome');
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800">
      {view === 'welcome' && (
        <WelcomeScreen
          onStart={() => setView('questions')}
          savedIndex={currentIndex}
          totalQuestions={QUESTIONS_DATA.length}
          onResetDraft={currentIndex > 0 || Object.keys(answers).length > 0 ? handleResetDraft : undefined}
        />
      )}

      {view === 'questions' && (
        <TypeformContainer
          questions={QUESTIONS_DATA}
          answers={answers}
          onUpdateAnswer={handleUpdateAnswer}
          onGoToReview={() => setView('review')}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}

      {view === 'review' && (
        <ReviewScreen
          questions={QUESTIONS_DATA}
          answers={answers}
          onEditQuestion={(idx) => {
            setCurrentIndex(idx);
            setView('questions');
          }}
          onSubmit={handleSubmit}
          onBackToQuestions={() => setView('questions')}
          isSubmitting={isSubmitting}
        />
      )}

      {view === 'success' && (
        <SuccessScreen
          answers={answers}
          questions={QUESTIONS_DATA}
          onRestart={handleRestartNew}
          submissionDate={submissionDate}
        />
      )}
    </div>
  );
}
