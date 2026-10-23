'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, Download, RefreshCw, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { FormQuestion, FormAnswers } from '@/types/form';
import { FORM_METADATA } from '@/data/questions';
import { generateFormPdf } from '@/lib/pdfGenerator';

interface SuccessScreenProps {
  answers: FormAnswers;
  questions: FormQuestion[];
  onRestart: () => void;
  submissionDate: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  answers,
  questions,
  onRestart,
  submissionDate,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0052FF', '#2563eb', '#60a5fa', '#93c5fd', '#ffffff'],
      });
    } catch {
      // safe fallback if canvas is restricted
    }
  }, []);

  const handleDownloadPdf = () => {
    try {
      generateFormPdf({
        answers,
        questions,
        submissionDate,
      });
      setPdfGenerated(true);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f7ff] via-white to-[#f8fbff] text-slate-800 flex flex-col justify-between items-center py-12 px-4">
      {/* Decorative top glow */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center my-auto">
        {/* SONDA Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 p-3 rounded-2xl bg-white shadow-sm border border-slate-100"
        >
          <Image
            src="/assets/aistudio/sonda-logo-png_seeklogo-443758_745c1cb4.png"
            alt="SONDA"
            width={160}
            height={50}
            priority
            referrerPolicy="no-referrer"
            className="h-auto w-36 object-contain"
          />
        </motion.div>

        {/* Animated Checkmark Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-6"
        >
          <Check className="w-10 h-10 stroke-[3]" />
        </motion.div>

        {/* Main Success Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3"
        >
          Obrigado pela sua colaboração!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg text-slate-600 max-w-lg mb-8 leading-relaxed"
        >
          Sua resposta foi registrada com sucesso e contribuirá diretamente para tornar o nosso ambiente de trabalho ainda mais seguro e saudável.
        </motion.p>

        {/* Receipt Card without protocol */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm mb-8 text-left space-y-4"
        >
          <div className="pb-3 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider">Comprovante de Envio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 mb-0.5">Formulário</p>
              <p className="font-semibold text-slate-800">{FORM_METADATA.title}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Data e Hora</p>
              <p className="font-semibold text-slate-800">{submissionDate}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Empresa</p>
              <p className="font-semibold text-slate-800">SONDA Brasil</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Status</p>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Registrado em Segurança do Trabalho
              </span>
            </div>
          </div>
        </motion.div>

        {/* Buttons Action Group */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 w-full"
        >
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-150 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            {pdfGenerated ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>PDF Baixado! Baixar novamente</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Gerar e Baixar PDF Oficial</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer shadow-2xs"
          >
            <Eye className="w-4 h-4" />
            <span>{showDetails ? 'Ocultar Respostas' : 'Visualizar Respostas'}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Novo Preenchimento</span>
          </button>
        </motion.div>

        {/* Detail answers accordion view if opened */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="w-full mt-6 bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-xs max-h-96 overflow-y-auto"
          >
            <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Resumo das Respostas Registradas:
            </h4>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="text-xs pb-3 border-b border-slate-100 last:border-b-0">
                  <span className="font-mono text-blue-600 font-bold mr-2">Q{q.id}.</span>
                  <span className="font-semibold text-slate-800">{q.title}</span>
                  <p className="mt-1 text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                    {answers[q.id] || '(Não informado)'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-xs text-slate-400 mt-12 text-center">
        <p>SONDA · make it easy · Segurança do Trabalho</p>
      </footer>
    </div>
  );
};
