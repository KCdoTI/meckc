import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Lightbulb, Users, Rocket, Target, Loader2 } from 'lucide-react';
import { Idea } from '../types';
import { getRealTimeFeedback } from '../services/gemini';

interface IdeaWizardProps {
  onComplete: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const steps = [
  {
    id: 'problem',
    title: '1. Problema Real',
    description: 'O que afeta os jovens no dia a dia?',
    icon: <Target className="w-6 h-6" />,
    fields: [
      { name: 'problem', label: 'Descreva o problema', placeholder: 'Ex: Ansiedade com o futuro profissional...', type: 'textarea' }
    ]
  },
  {
    id: 'audience',
    title: '2. Público-alvo',
    description: 'Quem sofre com esse problema?',
    icon: <Users className="w-6 h-6" />,
    fields: [
      { name: 'targetAudience', label: 'Quem são as pessoas?', placeholder: 'Ex: Estudantes do ensino médio que não sabem qual carreira seguir...', type: 'textarea' }
    ]
  },
  {
    id: 'solution',
    title: '3. Solução Digital',
    description: 'Qual produto ou ferramenta você pensou?',
    icon: <Lightbulb className="w-6 h-6" />,
    fields: [
      { name: 'name', label: 'Nome da Ideia', placeholder: 'Ex: Projeto Inovador', type: 'input' },
      { name: 'solution', label: 'O que é a solução?', placeholder: 'Ex: Um app de mentoria com universitários...', type: 'textarea' },
      { name: 'howItWorks', label: 'Como funciona?', placeholder: 'Ex: O aluno faz um teste e é conectado a um mentor...', type: 'textarea' }
    ]
  },
  {
    id: 'impact',
    title: '4. Impacto Final',
    description: 'Como essa ideia ajudaria de verdade?',
    icon: <Rocket className="w-6 h-6" />,
    fields: [
      { name: 'whyUseful', label: 'Por que seria útil?', placeholder: 'Ex: Reduz o estresse da escolha e dá clareza...', type: 'textarea' },
      { name: 'differential', label: 'Diferencial da proposta', placeholder: 'Ex: Mentoria real em vez de apenas testes automatizados...', type: 'textarea' },
      { name: 'expectedResult', label: 'Resultado esperado', placeholder: 'Ex: Jovens mais seguros e decididos...', type: 'textarea' }
    ]
  }
];

export default function IdeaWizard({ onComplete, onCancel }: IdeaWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Idea>>({});
  const [feedback, setFeedback] = useState<Record<string, { text: string; loading: boolean }>>({});
  const [hasRequestedFeedback, setHasRequestedFeedback] = useState<Record<number, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setHasRequestedFeedback(prev => ({ ...prev, [currentStep]: false }));
  };

  const fetchFeedback = useCallback(async (name: string, value: string) => {
    setFeedback(prev => ({ ...prev, [name]: { text: prev[name]?.text || '', loading: true } }));
    
    const aiFeedback = await getRealTimeFeedback(name, value, formData);
    
    if (aiFeedback) {
      setFeedback(prev => ({ ...prev, [name]: { text: aiFeedback, loading: false } }));
    } else {
      setFeedback(prev => ({ ...prev, [name]: { ...prev[name], loading: false } }));
    }
  }, [formData]);

  const next = () => {
    const step = steps[currentStep];
    
    // Check if we should show feedback first
    if (!hasRequestedFeedback[currentStep]) {
      step.fields.forEach(field => {
        fetchFeedback(field.name, (formData as any)[field.name] || '');
      });
      setHasRequestedFeedback(prev => ({ ...prev, [currentStep]: true }));
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData as Omit<Idea, 'id' | 'createdAt'>);
    }
  };

  const back = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${i <= currentStep ? 'bg-brand-400 border-slate-900' : 'bg-white border-slate-200'}`}>
              {i < currentStep ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 w-12 mx-2 ${i < currentStep ? 'bg-brand-400' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="brutalist-card p-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
              {step.icon}
            </div>
            <h2 className="text-2xl font-bold">{step.title}</h2>
          </div>
          <p className="text-slate-600 mb-8">{step.description}</p>

          <div className="space-y-6">
            {step.fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={(formData as any)[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 border-2 border-slate-900 focus:ring-0 focus:border-brand-500 min-h-[120px] outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={(formData as any)[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full p-4 border-2 border-slate-900 focus:ring-0 focus:border-brand-500 outline-none"
                  />
                )}

                {/* AI Feedback Display */}
                <AnimatePresence>
                  {(feedback[field.name]?.loading || feedback[field.name]?.text) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-brand-50 border-l-4 border-brand-400 text-sm"
                    >
                      <div className="flex items-center gap-2 font-bold text-brand-700 mb-1">
                        <Sparkles className="w-4 h-4" />
                        Dica do Mentor
                      </div>
                      {feedback[field.name]?.loading ? (
                        <div className="flex items-center gap-2 text-slate-500 italic">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Pensando em como te ajudar...
                        </div>
                      ) : (
                        <p className="text-slate-700 leading-relaxed">
                          {feedback[field.name]?.text}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-12">
            <button onClick={back} className="flex items-center gap-2 font-bold px-4 py-2 hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              {currentStep === 0 ? 'Cancelar' : 'Voltar'}
            </button>
            <button onClick={next} className="brutalist-button flex items-center gap-2">
              {currentStep === steps.length - 1 
                ? (hasRequestedFeedback[currentStep] ? 'Finalizar Ideia' : 'Revisar com Mentor') 
                : (hasRequestedFeedback[currentStep] ? 'Próximo Passo' : 'Revisar com Mentor')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
