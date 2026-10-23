'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, CornerDownLeft, CheckSquare, Square } from 'lucide-react';
import { FormQuestion } from '@/types/form';

interface QuestionCardProps {
  question: FormQuestion;
  currentIndex: number;
  totalQuestions: number;
  currentValue: string;
  onChange: (value: string) => void;
  onSubmitNext: () => void;
  canAdvance: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentValue,
  onChange,
  onSubmitNext,
  canAdvance,
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Auto-focus input when navigating to a text or textarea question
  useEffect(() => {
    if (question.type === 'text' || question.type === 'textarea') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [question.id, question.type]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (question.type === 'textarea') {
        if (!e.shiftKey && canAdvance) {
          e.preventDefault();
          onSubmitNext();
        }
      } else {
        if (canAdvance) {
          e.preventDefault();
          onSubmitNext();
        }
      }
    }
  };

  // Helper for multiselect choices
  const selectedValues: string[] = currentValue
    ? currentValue.split('; ').filter(Boolean)
    : [];

  const handleToggleMultiSelect = (val: string) => {
    const isNone = val.toLowerCase().includes('nenhum');
    let nextList: string[];

    if (isNone) {
      // If clicking 'Nenhum', clear everything else
      if (selectedValues.includes(val)) {
        nextList = [];
      } else {
        nextList = [val];
      }
    } else {
      // If clicking any normal risk, remove 'Nenhum' if present
      const filtered = selectedValues.filter((v) => !v.toLowerCase().includes('nenhum'));
      if (filtered.includes(val)) {
        nextList = filtered.filter((v) => v !== val);
      } else {
        nextList = [...filtered, val];
      }
    }

    onChange(nextList.join('; '));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center py-4">
      {/* Question Header & Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
          <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {String(question.id).padStart(2, '0')}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 font-medium">{question.section}</span>
          {question.required && (
            <span className="text-red-500 font-bold ml-1" title="Pergunta Obrigatória">
              *
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {question.title}
        </h2>

        {question.subtitle && (
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 font-normal leading-relaxed">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Input Options / Control Area */}
      <div className="mb-8">
        {/* Multiselect / Checkboxes (Caixa de Seleção Múltipla) */}
        {question.type === 'multiselect' && question.options && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {question.options.map((option, idx) => {
                const isSelected = selectedValues.includes(option.value);
                const isNone = option.value.toLowerCase().includes('nenhum');

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggleMultiSelect(option.value)}
                    className={`group relative flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                        : isNone
                        ? 'border-slate-300 bg-slate-50/80 hover:border-blue-300 hover:bg-slate-100 sm:col-span-2'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/70 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'border-2 border-slate-300 group-hover:border-blue-400 bg-white'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : null}
                      </div>

                      <span
                        className={`text-sm font-semibold transition-colors leading-snug ${
                          isSelected
                            ? 'text-blue-950 font-bold'
                            : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>

                    <span
                      className={`hidden sm:inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-mono font-bold transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-blue-200/80 text-blue-900'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                      }`}
                    >
                      {option.keyHint || String(idx + 1)}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedValues.length > 0 && (
              <p className="text-xs text-blue-700 font-medium pt-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>
                  {selectedValues.length} {selectedValues.length === 1 ? 'risco selecionado' : 'riscos selecionados'}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Single Choice (Radio) */}
        {question.type === 'choice' && question.options && (
          <div
            className={`grid gap-3 ${
              question.options.length <= 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-3'
            }`}
          >
            {question.options.map((option, idx) => {
              const isSelected = currentValue === option.value;
              const defaultKey =
                option.keyHint ||
                (idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : String(idx + 1));

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`group relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/70 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}
                    >
                      {defaultKey}
                    </span>
                    <span
                      className={`text-base font-semibold transition-colors ${
                        isSelected ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Text Input */}
        {question.type === 'text' && (
          <div className="relative">
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={currentValue || ''}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={question.placeholder || 'Digite sua resposta...'}
              className="w-full text-lg sm:text-xl font-medium text-slate-900 placeholder:text-slate-400 py-3.5 px-4 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-hidden focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>
        )}

        {/* Textarea Input */}
        {question.type === 'textarea' && (
          <div className="relative">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              rows={4}
              value={currentValue || ''}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={question.placeholder || 'Insira sua resposta detalhadamente...'}
              className="w-full text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 p-4 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-hidden focus:ring-4 focus:ring-blue-100 transition-all resize-y shadow-2xs"
            />
            <div className="flex justify-between items-center text-xs text-slate-400 mt-1.5 px-1">
              <span>Shift + Enter para quebrar linha</span>
              <span>{(currentValue || '').length} caracteres</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Navigation Row */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onSubmitNext}
          disabled={!canAdvance}
          className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
            canAdvance
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>
            {question.type === 'multiselect'
              ? 'Continuar'
              : currentIndex === totalQuestions - 1
              ? 'Revisar & Finalizar'
              : 'OK'}
          </span>
          {currentIndex === totalQuestions - 1 ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4 stroke-[3]" />
          )}
        </button>

        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>Pressione</span>
          <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-slate-100 border border-slate-300 rounded text-slate-700 shadow-2xs">
            <span>Enter</span>
            <CornerDownLeft className="w-3 h-3 inline" />
          </kbd>
        </span>
      </div>
    </div>
  );
};
