'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Clock, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import { FORM_METADATA } from '@/data/questions';

interface WelcomeScreenProps {
  onStart: () => void;
  savedIndex?: number;
  totalQuestions: number;
  onResetDraft?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  savedIndex = 0,
  totalQuestions,
  onResetDraft,
}) => {
  const hasDraft = savedIndex > 0;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 md:py-12 bg-gradient-to-b from-white via-[#f8fbff] to-[#eef4ff] text-slate-800 relative overflow-hidden">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
          <span className="text-xs font-semibold tracking-wider text-blue-900 uppercase">
            Segurança do Trabalho
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl my-auto py-6 flex flex-col items-center text-center z-10"
      >
        {/* SONDA Logo with elegant fade-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8 p-3 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <Image
            src="/assets/aistudio/sonda-logo-png_seeklogo-443758_745c1cb4.png"
            alt="SONDA - make it easy"
            width={190}
            height={60}
            priority
            referrerPolicy="no-referrer"
            className="h-auto w-40 sm:w-48 object-contain"
          />
        </motion.div>

        {/* Survey Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wide mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>CANAL OFICIAL DO COLABORADOR</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4"
        >
          Consulta sobre Percepção de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            Riscos Ocupacionais
          </span>
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed mb-8"
        >
          {FORM_METADATA.description}
        </motion.p>

        {/* Key Features Minimal Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-10 text-left"
        >
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Rápido & Direto</p>
              <p className="text-xs text-slate-500">~{FORM_METADATA.estimatedTime}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Ambiente Seguro</p>
              <p className="text-xs text-slate-500">Opção 100% Anônima</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-mono font-bold">↵</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Navegação Fluida</p>
              <p className="text-xs text-slate-500">Teclado ou Toque</p>
            </div>
          </div>
        </motion.div>

        {/* Action Button Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-blue-300"
          >
            <span>{hasDraft ? `Continuar (${savedIndex + 1} de ${totalQuestions})` : 'Iniciar Consulta'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline-flex items-center ml-2 px-2 py-0.5 rounded text-[11px] font-mono bg-white/20 border border-white/30 text-white/95">
              Enter ↵
            </span>
          </button>

          {hasDraft && onResetDraft && (
            <button
              onClick={onResetDraft}
              className="inline-flex items-center gap-2 px-4 py-3 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recomeçar do início</span>
            </button>
          )}
        </motion.div>

        <p className="text-xs text-slate-400 mt-4">
          Pressione <strong className="text-slate-600 font-medium">Enter ↵</strong> para começar a qualquer momento
        </p>
      </motion.main>

      {/* Footer Info */}
      <footer className="w-full max-w-5xl flex items-center justify-center text-xs text-slate-500 pt-6 border-t border-slate-200/60 z-10">
        <span>make it easy</span>
      </footer>
    </div>
  );
};
