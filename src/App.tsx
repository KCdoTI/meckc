import React, { useState, useEffect } from 'react';
import { Plus, Lightbulb, Rocket, Target, Users, LayoutDashboard, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import IdeaWizard from './components/IdeaWizard';
import IdeaCard from './components/IdeaCard';
import GeminiAssistant from './components/GeminiAssistant';
import { Idea } from './types';
import { exportToPDF } from './services/pdfService';

export default function App() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create'>('dashboard');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mente_construcao_ideas');
    if (saved) {
      setIdeas(JSON.parse(saved));
    }
  }, []);

  const saveIdea = (newIdea: Omit<Idea, 'id' | 'createdAt'>) => {
    const idea: Idea = {
      ...newIdea,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const updated = [idea, ...ideas];
    setIdeas(updated);
    localStorage.setItem('mente_construcao_ideas', JSON.stringify(updated));
    setIsCreating(false);
    setActiveTab('dashboard');
  };

  const deleteIdea = (id: string) => {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    localStorage.setItem('mente_construcao_ideas', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-400 border-2 border-slate-900 flex items-center justify-center rotate-3">
              <Rocket className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Mente em Construção <span className="text-sm font-bold text-brand-600 block md:inline md:ml-2 opacity-70">- Eletiva do Prof. KC</span></h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`font-bold flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setIsCreating(true)}
              className="brutalist-button flex items-center gap-2 py-2"
            >
              <Plus className="w-5 h-5" />
              Nova Ideia
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <IdeaWizard onComplete={saveIdea} onCancel={() => setIsCreating(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="bg-brand-400 border-2 border-slate-900 p-12 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-5xl font-black mb-6 leading-tight">
                    Transforme seus problemas em <span className="underline decoration-white">soluções reais</span>.
                  </h2>
                  <p className="text-xl font-medium mb-8 text-slate-900/80">
                    Uma plataforma pensada para jovens criativos que querem mudar o mundo, um projeto por vez.
                  </p>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-white border-2 border-slate-900 px-8 py-4 font-bold text-lg shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all"
                  >
                    Começar meu Primeiro Projeto
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                  <Sparkles className="w-full h-full" />
                </div>
              </section>

              {/* Pillars Overview */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { icon: <Target />, title: 'Problema', color: 'bg-blue-100 text-blue-600' },
                  { icon: <Users />, title: 'Público', color: 'bg-purple-100 text-purple-600' },
                  { icon: <Lightbulb />, title: 'Solução', color: 'bg-yellow-100 text-yellow-600' },
                  { icon: <Rocket />, title: 'Impacto', color: 'bg-brand-100 text-brand-600' },
                ].map((p, i) => (
                  <div key={i} className="brutalist-card p-6 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-4 ${p.color}`}>
                      {p.icon}
                    </div>
                    <h3 className="font-bold text-lg">{p.title}</h3>
                  </div>
                ))}
              </section>

              {/* Ideas Grid */}
              <section>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-black mb-2">Seus Projetos</h2>
                    <p className="text-slate-500">Acompanhe sua evolução e propostas criadas.</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                    <BookOpen className="w-4 h-4" />
                    {ideas.length} {ideas.length === 1 ? 'Projeto' : 'Projetos'}
                  </div>
                </div>

                {ideas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ideas.map(idea => (
                      <IdeaCard 
                        key={idea.id} 
                        idea={idea} 
                        onDelete={deleteIdea} 
                        onView={() => setSelectedIdea(idea)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="brutalist-card p-12 text-center border-dashed border-slate-300 bg-transparent shadow-none">
                    <p className="text-slate-400 font-medium mb-4">Você ainda não criou nenhum projeto.</p>
                    <button 
                      onClick={() => setIsCreating(true)}
                      className="text-brand-600 font-bold hover:underline"
                    >
                      Criar minha primeira ideia agora →
                    </button>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <GeminiAssistant />

      {/* Idea Detail Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="brutalist-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black mb-2">{selectedIdea.name}</h2>
                  <p className="text-slate-500">Criado em {new Date(selectedIdea.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setSelectedIdea(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'Problema', content: selectedIdea.problem },
                  { label: 'Público-alvo', content: selectedIdea.targetAudience },
                  { label: 'Solução Digital', content: selectedIdea.solution },
                  { label: 'Como funciona', content: selectedIdea.howItWorks },
                  { label: 'Por que é útil', content: selectedIdea.whyUseful },
                  { label: 'Diferencial', content: selectedIdea.differential },
                  { label: 'Resultado Esperado', content: selectedIdea.expectedResult },
                ].map((section, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">{section.label}</h4>
                    <p className="text-slate-800 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t-2 border-slate-900 flex gap-4">
                <button 
                  onClick={() => exportToPDF(selectedIdea)}
                  className="brutalist-button flex-1"
                >
                  Baixar PDF de Análise
                </button>
                <button 
                  onClick={() => setSelectedIdea(null)}
                  className="px-8 py-4 font-bold border-2 border-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
