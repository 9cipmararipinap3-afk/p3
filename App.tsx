import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  ExternalLink,
  Plus,
  ArrowRight,
  Settings,
  Activity
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
  const projectName = process.env.VERCEL_PROJECT_NAME;

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
      <aside className="hidden md:flex w-72 bg-slate-900 text-white flex-col sticky top-0 h-screen border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">9ª CIPM</h1>
            <p className="text-xs text-slate-400 font-medium">SGO Araripina-PE</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-2">
          <button 
            onClick={() => setView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-semibold">Ocorrências</span>
          </button>
          <button 
            onClick={() => setView('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === 'add' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-semibold">Novo Registro</span>
          </button>
          <button 
            onClick={() => setView('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === 'stats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">Estatísticas</span>
          </button>
        </nav>

        <div className="p-4 space-y-4">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema</span>
              <Activity className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-200">Online</span>
            </div>
          </div>
          
          <div className="bg-indigo-600/5 p-4 rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <Settings className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Vercel API</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Projeto</p>
                <p className="text-xs text-slate-300 font-mono font-bold truncate">{projectName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium">ID de Implantação</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{projectId}</p>
              </div>
              <a 
                href={`https://vercel.com/project/${projectId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
              >
                Dashboard Vercel <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-500" />
          <span className="font-bold tracking-tight">9ª CIPM - SGO</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isMenuOpen ? (
            <div className="text-xl font-bold">✕</div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-current rounded"></div>
              <div className="w-6 h-0.5 bg-current rounded"></div>
              <div className="w-6 h-0.5 bg-current rounded"></div>
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-40 pt-20 px-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          <button onClick={() => { setView('list'); setIsMenuOpen(false); }} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white text-left flex items-center gap-4 shadow-xl">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><FileText className="w-5 h-5" /></div>
            <span className="font-bold">Ocorrências</span>
          </button>
          <button onClick={() => { setView('add'); setIsMenuOpen(false); }} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white text-left flex items-center gap-4 shadow-xl">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><PlusCircle className="w-5 h-5" /></div>
            <span className="font-bold">Novo Registro</span>
          </button>
          <button onClick={() => { setView('stats'); setIsMenuOpen(false); }} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl text-white text-left flex items-center gap-4 shadow-xl">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><BarChart3 className="w-5 h-5" /></div>
            <span className="font-bold">Estatísticas</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {view === 'list' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Painel de Ocorrências</h2>
                <p className="text-slate-500 mt-1 font-medium">Gestão inteligente de boletins da 9ª CIPM Araripina.</p>
              </div>
              <button 
                onClick={() => setView('add')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Novo BO
              </button>
            </header>
            <ReportList reports={reports} onDelete={deleteReport} />
          </div>
        )}

        {view === 'add' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
              <button 
                onClick={() => setView('list')}
                className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 mb-4 font-bold transition-colors group"
              >
                <div className="p-1 bg-slate-200 group-hover:bg-indigo-100 rounded-lg transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </div>
                Voltar
              </button>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inserir Registro</h2>
              <p className="text-slate-500 mt-1 font-medium">Preencha manualmente ou utilize a IA para processar o documento.</p>
            </header>
            <ReportForm onSave={addReport} />
          </div>
        )}

        {view === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Indicadores Criminais</h2>
                <p className="text-slate-500 mt-1 font-medium">Análise de dados e produtividade operacional.</p>
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