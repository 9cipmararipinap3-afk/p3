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
  Activity,
  Menu,
  X,
  Bell,
  Search as SearchIcon
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

  const NavLink = ({ target, icon: Icon, label }: { target: any, icon: any, label: string }) => (
    <button 
      onClick={() => { setView(target); setIsMenuOpen(false); }}
      className={`sidebar-link w-full ${view === target ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 translate-x-1' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
      <Icon className={`w-5 h-5 ${view === target ? 'animate-pulse' : ''}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-[#0f172a] text-white flex-col sticky top-0 h-screen border-r border-slate-800 shadow-2xl z-20">
        <div className="p-8 border-b border-slate-800/50">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">SGO-PM</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">9ª CIPM Araripina</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3 mt-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">Principal</div>
          <NavLink target="list" icon={FileText} label="Ocorrências" />
          <NavLink target="add" icon={PlusCircle} label="Novo Registro" />
          <NavLink target="stats" icon={BarChart3} label="Estatísticas" />
        </nav>

        <div className="p-6 space-y-4 border-t border-slate-800/50 bg-slate-900/50">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deploy Info</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-300 font-mono truncate">{projectName}</p>
              <a 
                href={`https://vercel.com/project/${projectId}`} 
                target="_blank" 
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors font-bold uppercase"
              >
                Painel Vercel <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#0f172a] text-white p-5 flex items-center justify-between sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight">9ª CIPM SGO</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-slate-800 rounded-xl text-slate-300 active:scale-95 transition-transform"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-40 pt-24 px-6 flex flex-col gap-4 animate-in fade-in duration-300">
           <NavLink target="list" icon={FileText} label="Ocorrências" />
           <NavLink target="add" icon={PlusCircle} label="Novo Registro" />
           <NavLink target="stats" icon={BarChart3} label="Estatísticas" />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar search/actions */}
        <div className="hidden md:flex h-20 border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-10 px-10 items-center justify-between">
          <div className="relative w-96 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisa rápida..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 rounded-2xl outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">Oficial de Dia</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">9ª CIPM</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
                PM
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {view === 'list' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h2>
                  <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Monitoramento em tempo real de ocorrências
                  </p>
                </div>
                <button onClick={() => setView('add')} className="btn-primary flex items-center gap-3">
                  <Plus className="w-5 h-5" /> Inserir Novo BO
                </button>
              </header>
              <ReportList reports={reports} onDelete={deleteReport} />
            </div>
          )}

          {view === 'add' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
              <header className="mb-10 flex items-center justify-between">
                <div>
                  <button 
                    onClick={() => setView('list')}
                    className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 mb-4 font-bold transition-all group"
                  >
                    <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 rounded-xl transition-colors">
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </div>
                    Voltar ao Painel
                  </button>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Novo Registro</h2>
                  <p className="text-slate-500 mt-2 font-medium">Capture e organize dados operacionais com auxílio de IA.</p>
                </div>
              </header>
              <ReportForm onSave={addReport} />
            </div>
          )}

          {view === 'stats' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <header>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Análise Estratégica</h2>
                <p className="text-slate-500 mt-2 font-medium">Indicadores criminais e produtividade da unidade.</p>
              </header>
              <StatisticsDashboard reports={reports} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;