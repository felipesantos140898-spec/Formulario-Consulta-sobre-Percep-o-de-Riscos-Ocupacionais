import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormQuestion, FormAnswers } from '@/types/form';
import { FORM_METADATA } from '@/data/questions';

export function generateFormPdf({
  answers,
  questions,
  submissionDate,
}: {
  answers: FormAnswers;
  questions: FormQuestion[];
  submissionDate: string;
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header banner (SONDA Blue)
  doc.setFillColor(0, 82, 255); // #0052FF SONDA Blue
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SONDA', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('make it easy', 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SEGURANÇA DO TRABALHO', pageWidth - 14, 15, { align: 'right' });

  // Document Title
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(FORM_METADATA.title, 14, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Relatório de Percepção de Riscos Ocupacionais', 14, 42);

  // Operational Context Summary Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, 46, pageWidth - 28, 26, 2, 2, 'FD');

  const colaborador = answers[1] || 'Anônimo / Não informado';
  const unidade = answers[2] || 'Não selecionada';
  const turno = answers[3] || 'Não selecionado';

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('COLABORADOR / MATRÍCULA', 18, 52);
  doc.text('UNIDADE OPERACIONAL', 85, 52);
  doc.text('TURNO DE TRABALHO', 140, 52);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(colaborador, 18, 58);
  doc.text(unidade, 85, 58);
  doc.text(turno, 140, 58);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Data/Hora de Registro: ${submissionDate}`, 18, 67);
  doc.text('Segurança do Trabalho SONDA', 140, 67);

  // Prepare table data for all questions
  const tableRows: Array<[string, string, string]> = [];

  questions.forEach((q) => {
    let ans = answers[q.id] || '(Em branco / Não se aplica)';
    if (q.id === 15 && answers[14] === 'Não') {
      ans = 'Nenhuma condição insegura informada (Não aplicável)';
    }

    tableRows.push([
      `Q${q.id}`,
      q.title + (q.subtitle ? `\n${q.subtitle}` : ''),
      ans,
    ]);
  });

  // Render Table using jspdf-autotable
  autoTable(doc, {
    startY: 77,
    head: [['Item', 'Questão / Tópico Avaliado', 'Resposta Registrada']],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [0, 82, 255],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    columnStyles: {
      0: { cellWidth: 14, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 'auto', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Documento gerado pelo Sistema de Consulta de Riscos SONDA · Segurança do Trabalho',
        14,
        doc.internal.pageSize.getHeight() - 10
      );
      doc.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        pageWidth - 14,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      );
    },
  });

  // Save PDF file
  const filename = `SONDA-Consulta-Riscos-${unidade.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
