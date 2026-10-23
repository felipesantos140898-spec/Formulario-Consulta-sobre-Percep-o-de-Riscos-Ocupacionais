'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { FormQuestion, FormAnswers } from '@/types/form';
import { CheckCircle2, AlertCircle, ArrowLeft, Send, Edit2, ShieldCheck } from 'lucide-react';
import { FORM_METADATA } from '@/data/questions';

interface ReviewScreenProps {
  questions: FormQuestion[];
  answers: FormAnswers;
  onEditQuestion: (index: number) => void;
  onSubmit: () => void;
  onBackToQuestions: () => void;
  isSubmitting?: boolean;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  questions,
  answers,
  onEditQuestion,
  onSubmit,
  onBackToQuestions,
  isSubmitting = false,
}) => {
  // Check completion
  const answeredCount = questions.filter((q) => {
    if (q.id === 15 && answers[14] === 'Não') return true;
    return answers[q.id] && answers[q.id].trim() !== '';
  }).length;
  const isAllAnswered = answeredCount === questions.length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Group questions by section
  const sectionsMap = questions.reduce((acc, q, idx) => {
    if (!acc[q.section]) {
      acc[q.section] = [];
    }
    acc[q.section].push({ question: q, index: idx });
    return acc;
  }, {} as Record<string, { question: FormQuestion; index: number }[]>);

  return (
    <div className="min-h-screen w-full bg-[#f8fbff] text-slate-800 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <button
            type="button"
            onClick={onBackToQuestions}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar às perguntas</span>
          </button>

          <div className="flex items-center gap-3">
            <Image
              src="/assets/aistudio/sonda-logo-png_seeklogo-443758_745c1cb4.png"
              alt="SONDA"
              width={100}
              height={32}
              referrerPolicy="no-referrer"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>

        {/* Title & Progress Banner */}
        <div className="my-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Revisão Final das Respostas</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {FORM_METADATA.title}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Verifique se todas as informações estão corretas antes de submeter sua participação.
              </p>
            </div>

            <div className="sm:text-right shrink-0 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
              <span className="text-2xl font-extrabold text-blue-700 font-mono">
                {answeredCount}/{questions.length}
              </span>
              <p className="text-xs text-slate-500 font-medium">Questões Respondidas ({progressPercent}%)</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
            <div
              className="bg-blue-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Questions grouped by section */}
        <div className="space-y-6 mb-12">
          {Object.entries(sectionsMap).map(([sectionTitle, items]) => (
            <motion.div
              key={sectionTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">{sectionTitle}</h3>
                <span className="text-xs font-medium text-slate-500">
                  {items.length} {items.length === 1 ? 'questão' : 'questões'}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map(({ question, index }) => {
                  let val = answers[question.id];
                  if (question.id === 15 && answers[14] === 'Não') {
                    val = 'Nenhuma condição insegura informada (Não aplicável)';
                  }
                  const hasAnswer = val && val.trim() !== '';

                  return (
                    <div
                      key={question.id}
                      className="p-5 hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            Q{question.id}
                          </span>
                          <p className="text-sm font-semibold text-slate-900 leading-snug">
                            {question.title}
                          </p>
                        </div>

                        {question.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {question.subtitle}
                          </p>
                        )}

                        <div className="pt-1">
                          {hasAnswer ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-900">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              <span className="truncate max-w-md">{val}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Não respondida</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEditQuestion(index)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-blue-200"
                        title="Editar esta pergunta"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Actions Bar */}
        <div className="sticky bottom-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-800">
              {isAllAnswered
                ? 'Pronto para enviar!'
                : `Atenção: faltam ${questions.length - answeredCount} questão(ões) por responder.`}
            </p>
            <p className="text-xs text-slate-500">
              Ao enviar, seus dados serão registrados com total sigilo.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBackToQuestions}
              className="px-4 py-3 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer w-full sm:w-auto text-center"
            >
              Continuar Editando
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all duration-150 cursor-pointer w-full sm:w-auto disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirmar & Enviar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
