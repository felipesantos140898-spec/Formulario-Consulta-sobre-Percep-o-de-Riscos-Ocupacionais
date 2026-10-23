import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SONDA - Consulta de Riscos Ocupacionais',
  description: 'Formulário interativo estilo Typeform para a consulta trimestral sobre percepção de riscos ocupacionais da SONDA com navegação fluida, transições suaves e design moderno azul e branco.',
  openGraph: {
    title: 'SONDA - Consulta de Riscos Ocupacionais',
    description: 'Formulário interativo estilo Typeform para a consulta trimestral sobre percepção de riscos ocupacionais da SONDA.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SONDA - Consulta de Riscos Ocupacionais',
    description: 'Formulário interativo estilo Typeform para a consulta trimestral sobre percepção de riscos ocupacionais da SONDA.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="antialiased bg-[#f8fafc] text-slate-800 selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
