import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  ExternalLink,
  Plus,
  ArrowRight
} from 'lucide-react';
import { PoliceReport } from './types';
import ReportForm from './components/ReportForm';
import StatisticsDashboard from './components/StatisticsDashboard';
import ReportList from './components/ReportList';

const App: React.FC = () => {
  const [reports, setReports] = useState<PoliceReport[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'stats'>('list');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const projectId = process.env.VERCEL_PROJECT_ID;

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cipm_reports');
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cipm_reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (report: PoliceReport) => {
    setReports(prev => [report, ...prev]);
    setView('list');
  };

  const deleteReport = (id: string) => {
    if(window.confirm("Deseja realmente excluir este registro?")) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">9ª CIPM</h1>
            <p className="text-xs text-slate-400">SGO Araripina</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Ocorrências</span>
          </button>
          <button 
            onClick={() => setView('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'add' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Novo Registro</span>
          </button>
          <button 
            onClick={() => setView('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'stats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Estatísticas</span>
          </button>
        </nav>

        <div className="p-4 space-y-3">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Status do Sistema</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium">Operacional</span>
            </div>
          </div>
          
          <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/20">
            <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-wider">Vercel Deployment</p>
            <p className="text-[11px] text-slate-300 font-mono truncate mb-2">{projectId}</p>
            <a 
              href={`https://vercel.com/project/${projectId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Ver Painel <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-400" />
          <span className="font-bold">9ª CIPM - SGO</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <div className="w-6 h-0.5 bg-current mb-1.5 rounded"></div>
          <div className="w-6 h-0.5 bg-current mb-1.5 rounded"></div>
          <div className="w-6 h-0.5 bg-current rounded"></div>
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-40 pt-20 px-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <button onClick={() => { setView('list'); setIsMenuOpen(false); }} className="w-full p-4 bg-slate-800 rounded-xl text-white text-left flex items-center gap-3">
            <FileText className="w-5 h-5" /> Ocorrências
          </button>
          <button onClick={() => { setView('add'); setIsMenuOpen(false); }} className="w-full p-4 bg-slate-800 rounded-xl text-white text-left flex items-center gap-3">
            <PlusCircle className="w-5 h-5" /> Novo Registro
          </button>
          <button onClick={() => { setView('stats'); setIsMenuOpen(false); }} className="w-full p-4 bg-slate-800 rounded-xl text-white text-left flex items-center gap-3">
            <BarChart3 className="w-5 h-5" /> Estatísticas
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {view === 'list' && (
          <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Painel de Ocorrências</h2>
                <p className="text-slate-500">Visualize e gerencie todos os registros da 9ª CIPM.</p>
              </div>
              <button 
                onClick={() => setView('add')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/10"
              >
                <PlusCircle className="w-5 h-5" />
                Novo BO
              </button>
            </header>
            <ReportList reports={reports} onDelete={deleteReport} />
          </div>
        )}

        {view === 'add' && (
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <button 
                onClick={() => setView('list')}
                className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-4 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Voltar
              </button>
              <h2 className="text-2xl font-bold text-slate-900">Novo Registro</h2>
              <p className="text-slate-500">Adicione dados manualmente ou faça o upload de fotos/PDFs do boletim.</p>
            </header>
            <ReportForm onSave={addReport} />
          </div>
        )}

        {view === 'stats' && (
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Análise Estatística</h2>
                <p className="text-slate-500">Relatórios comparativos e indicadores criminais.</p>
              </div>
            </header>
            <StatisticsDashboard reports={reports} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;