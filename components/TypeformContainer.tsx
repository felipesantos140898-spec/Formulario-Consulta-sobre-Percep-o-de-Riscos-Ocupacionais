'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, ListChecks, Volume2, VolumeX, Zap } from 'lucide-react';
import { FormQuestion, FormAnswers } from '@/types/form';
import { QuestionCard } from '@/components/QuestionCard';
import { playHapticSound } from '@/lib/sound';

interface TypeformContainerProps {
  questions: FormQuestion[];
  answers: FormAnswers;
  onUpdateAnswer: (questionId: number, value: string) => void;
  onGoToReview: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const TypeformContainer: React.FC<TypeformContainerProps> = ({
  questions,
  answers,
  onUpdateAnswer,
  onGoToReview,
  currentIndex,
  setCurrentIndex,
}) => {
  const [direction, setDirection] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const currentValue = answers[currentQuestion.id] || '';

  // Determine the next index respecting conditional branching
  const getNextIndex = useCallback(
    (fromIndex: number, currentAnswerVal?: string): number => {
      const q = questions[fromIndex];
      const ans = currentAnswerVal !== undefined ? currentAnswerVal : answers[q.id];

      // Conditional rule: Question 14 (Oportunidades de Melhoria)
      // If user answered 'Não', skip Question 15 (index 14) and jump to Question 16 (index 15)
      if (q.id === 14) {
        if (ans === 'Não') {
          return fromIndex + 2; // Jump directly to Q16 (Participação do Empregado)
        }
      }

      return fromIndex + 1;
    },
    [questions, answers]
  );

  // Determine the previous index respecting conditional branching
  const getPrevIndex = useCallback(
    (fromIndex: number): number => {
      if (fromIndex <= 0) return 0;
      const q = questions[fromIndex];

      // If we are at Question 16 (Participação) and Question 14 was answered 'Não', jump back to Q14
      if (q.id === 16 && answers[14] === 'Não') {
        const q14Index = questions.findIndex((item) => item.id === 14);
        if (q14Index !== -1) return q14Index;
      }

      return fromIndex - 1;
    },
    [questions, answers]
  );

  // Progress Calculation
  const answeredCount = questions.filter((q) => {
    if (q.id === 15 && answers[14] === 'Não') return true;
    return answers[q.id] && answers[q.id].trim() !== '';
  }).length;
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / total) * 100));

  // Check if current question can advance
  const canAdvance =
    !currentQuestion.required || (currentValue && currentValue.trim().length > 0);

  const handleNext = useCallback(() => {
    if (!canAdvance) return;

    if (soundEnabled) playHapticSound('next');

    const nextIdx = getNextIndex(currentIndex);

    if (nextIdx < total) {
      setDirection(1);
      setCurrentIndex(nextIdx);
    } else {
      if (soundEnabled) playHapticSound('finish');
      onGoToReview();
    }
  }, [canAdvance, soundEnabled, currentIndex, total, getNextIndex, setCurrentIndex, onGoToReview]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      if (soundEnabled) playHapticSound('back');
      const prevIdx = getPrevIndex(currentIndex);
      setDirection(-1);
      setCurrentIndex(prevIdx);
    }
  }, [currentIndex, soundEnabled, getPrevIndex, setCurrentIndex]);

  // Handle single option choice selection
  const handleOptionSelect = useCallback(
    (val: string) => {
      onUpdateAnswer(currentQuestion.id, val);

      // If question 14 is answered 'Não', also auto-set question 15
      if (currentQuestion.id === 14 && val === 'Não') {
        onUpdateAnswer(15, 'Nenhuma condição insegura informada (Não aplicável)');
      }

      if (soundEnabled) playHapticSound('select');

      if (autoAdvance) {
        setTimeout(() => {
          const nextIdx = getNextIndex(currentIndex, val);
          if (nextIdx < total) {
            setDirection(1);
            setCurrentIndex(nextIdx);
          } else {
            onGoToReview();
          }
        }, 280);
      }
    },
    [
      currentQuestion.id,
      onUpdateAnswer,
      soundEnabled,
      autoAdvance,
      currentIndex,
      total,
      getNextIndex,
      setCurrentIndex,
      onGoToReview,
    ]
  );

  // Keyboard Navigation: shortcuts for choices and arrows
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'ArrowDown' && !isInput && canAdvance) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' && !isInput) {
        e.preventDefault();
        handlePrev();
      }

      // Hotkeys for choice options when not in input
      if (!isInput && currentQuestion.type === 'choice' && currentQuestion.options) {
        const key = e.key.toUpperCase();
        if (currentQuestion.options.length === 2) {
          if (key === 'S' || key === '1') {
            e.preventDefault();
            handleOptionSelect('Sim');
          } else if (key === 'N' || key === '2') {
            e.preventDefault();
            handleOptionSelect('Não');
          }
        } else if (currentQuestion.options.length === 3) {
          if (key === 'A' || key === '1') {
            e.preventDefault();
            handleOptionSelect(currentQuestion.options[0].value);
          } else if (key === 'B' || key === '2') {
            e.preventDefault();
            handleOptionSelect(currentQuestion.options[1].value);
          } else if (key === 'C' || key === '3') {
            e.preventDefault();
            handleOptionSelect(currentQuestion.options[2].value);
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentQuestion, canAdvance, handleNext, handlePrev, handleOptionSelect]);

  // Animation variants for smooth vertical slide
  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 35 : -35,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: 'spring' as const, stiffness: 320, damping: 28 },
        opacity: { duration: 0.22 },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -35 : 35,
      opacity: 0,
      transition: {
        duration: 0.18,
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-white via-[#f8fbff] to-[#f0f7ff] text-slate-800 overflow-hidden select-none">
      {/* Top Floating Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo & Section indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/aistudio/sonda-logo-png_seeklogo-443758_745c1cb4.png"
                alt="SONDA"
                width={85}
                height={26}
                priority
                referrerPolicy="no-referrer"
                className="h-6 w-auto object-contain"
              />
            </div>

            <span className="hidden sm:inline-block text-slate-300 font-light">|</span>

            <span className="hidden sm:inline-block text-xs font-semibold text-slate-600 truncate max-w-xs">
              {currentQuestion.section}
            </span>
          </div>

          {/* Center progress pill */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200">
            <span className="text-blue-600 font-mono font-bold">{currentIndex + 1}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-mono">{total}</span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline font-mono text-slate-500">{progressPercent}%</span>
          </div>

          {/* Right utilities & Review button */}
          <div className="flex items-center gap-2">
            {/* Auto-advance toggle */}
            <button
              type="button"
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                autoAdvance
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-400 hover:text-slate-600 border border-transparent'
              }`}
              title="Avanço automático ao selecionar respostas de escolha única"
            >
              <Zap className={`w-3.5 h-3.5 ${autoAdvance ? 'text-blue-600 fill-blue-600' : ''}`} />
              <span className="text-[11px]">Auto</span>
            </button>

            {/* Sound toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={soundEnabled ? 'Silenciar sons' : 'Ativar sons suaves'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-600" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Review Button */}
            <button
              type="button"
              onClick={onGoToReview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              <ListChecks className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Revisar ({answeredCount})</span>
              <span className="sm:hidden">Revisar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Question Presentation Stage */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 pt-20 pb-24 w-full max-w-4xl mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <QuestionCard
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={total}
              currentValue={currentValue}
              onChange={(val) => onUpdateAnswer(currentQuestion.id, val)}
              onSubmitNext={handleNext}
              canAdvance={Boolean(canAdvance)}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Floating Navigation Dock */}
      <footer className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-lg p-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`p-2.5 rounded-lg text-slate-700 transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'hover:bg-slate-100 hover:text-blue-600'
            }`}
            title="Pergunta anterior (Seta para cima)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-slate-200 mx-0.5" />

          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
              !canAdvance
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
            title="Próxima pergunta (Seta para baixo / Enter)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Bottom Left status indicator */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Rascunho salvo automaticamente</span>
      </div>
    </div>
  );
};
