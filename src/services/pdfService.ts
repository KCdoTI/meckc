import { jsPDF } from 'jspdf';
import { Idea } from '../types';

export const exportToPDF = (idea: Idea) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Mente em Construção: Proposta de Solução', margin, y);
  y += 15;

  doc.setFontSize(18);
  doc.setTextColor(34, 197, 94); // brand-500
  doc.text(idea.name, margin, y);
  y += 15;

  const addSection = (title: string, content: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(title.toUpperCase(), margin, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // slate-900
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, margin, y);
    y += (lines.length * 7) + 10;
  };

  addSection('Problema que ela resolve', idea.problem);
  addSection('Para quem foi criada', idea.targetAudience);
  addSection('Como funciona', idea.howItWorks);
  addSection('Por que seria útil', idea.whyUseful);
  addSection('Diferencial da proposta', idea.differential);
  addSection('Resultado esperado', idea.expectedResult);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Gerado em: ${new Date(idea.createdAt).toLocaleDateString()}`, margin, 280);

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${idea.name.replace(/\s+/g, '_')}_Proposta.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
