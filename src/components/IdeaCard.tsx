import React from 'react';
import { FileText, Trash2, Download, ExternalLink } from 'lucide-react';
import { Idea } from '../types';
import { exportToPDF } from '../services/pdfService';

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
  onView: () => void;
  key?: string;
}

export default function IdeaCard({ idea, onDelete, onView }: IdeaCardProps) {
  return (
    <div className="brutalist-card p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold truncate max-w-[200px]">{idea.name}</h3>
        </div>
        <button 
          onClick={() => onDelete(idea.id)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-slate-600 line-clamp-3 mb-6 flex-grow">
        {idea.problem}
      </p>

      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
        <button 
          onClick={() => exportToPDF(idea)}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 font-bold hover:bg-slate-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>
        <button 
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-100 text-brand-700 font-bold hover:bg-brand-200 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Ver
        </button>
      </div>
    </div>
  );
}
