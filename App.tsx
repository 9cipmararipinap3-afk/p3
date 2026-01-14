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
  Search as SearchIcon,
  User,
  LogOut
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
      className={`sidebar-link w-full group ${view === target ? 'nav-item-active' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
    >
      <div className={`p-2 rounded-lg transition-colors ${view === target ? 'bg-white/10' : 'group-hover:bg-indigo-500/10'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-80 glass-sidebar flex-col sticky top-0 h-screen z-30">
        <div className="p-10">
          <div className="flex items-center gap-4 group">
            <div className="bg-indigo-600 p-3.5 rounded-[1.25rem] shadow-2xl shadow-indigo-600/40 ring-4 ring-indigo-500/10 group-hover:scale-110 transition-all duration-500">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white">SGO<span className="text-indigo-500">.</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">9ª CIPM Araripina</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6 ml-4">Monitoramento Operacional</div>
          <NavLink target="list" icon={FileText} label="Painel de Ocorrências" />
          <NavLink target="add" icon={PlusCircle} label="Novo Boletim" />
          <NavLink target="stats" icon={BarChart3} label="Estatísticas e KPIs" />
        </nav>

        <div className="p-8">
          <div className="bg-slate-800/30 p-5 rounded-[2rem] border border-slate-700/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servidor Local</span>
              </div>
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-300 font-mono font-bold truncate">{projectName}</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">{projectId}</p>
            </div>
            <a 
              href={`https://vercel.com/project/${projectId}`} 
              target="_blank" 
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-bold text-slate-300 transition-colors uppercase tracking-widest"
            >
              Logs de Sistema <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#0f172a] text-white p-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter">SGO 9ª CIPM</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-slate-800 rounded-2xl text-slate-400 active:scale-90 transition-transform shadow-xl"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0f172a]/98 backdrop-blur-2xl z-40 pt-28 px-8 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300">
           <NavLink target="list" icon={FileText} label="Ocorrências" />
           <NavLink target="add" icon={PlusCircle} label="Novo Registro" />
           <NavLink target="stats" icon={BarChart3} label="Estatísticas" />
           <div className="h-px bg-slate-800 my-4"></div>
           <button className="flex items-center gap-4 text-slate-400 p-4 font-bold">
             <LogOut className="w-5 h-5" /> Sair do Sistema
           </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        {/* Top bar search/actions - Sophisticated Desktop Version */}
        <div className="hidden md:flex h-24 border-b border-slate-200/60 bg-white/70 backdrop-blur-2xl sticky top-0 z-20 px-12 items-center justify-between">
          <div className="relative w-[450px] group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar boletins, naturezas ou cidades..."
              className="w-full pl-14 pr-6 py-3.5 bg-slate-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-2xl outline-none transition-all text-sm font-semibold text-slate-600 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[1.25rem] transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
            </button>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4 group cursor-pointer pl-2">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none">Oficial de Operações</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">9ª CIPM · Pernambuco</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/20 ring-4 ring-indigo-500/5 transition-transform group-hover:scale-105 group-active:scale-95">
                PM
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 max-w-7xl mx-auto w-full space-y-12">
          {view === 'list' && (
            <div className="space-y-10 animate-slide-up">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Ocorrências<span className="text-indigo-600">.</span></h2>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">Atualizado Agora</div>
                    <p className="text-slate-400 font-medium text-sm">Monitorando registros da circunscrição.</p>
                  </div>
                </div>
                <button onClick={() => setView('add')} className="btn-executive">
                  <Plus className="w-5 h-5 stroke-[3px]" /> Novo Registro BO
                </button>
              </header>
              <ReportList reports={reports} onDelete={deleteReport} />
            </div>
          )}

          {view === 'add' && (
            <div className="max-w-4xl mx-auto animate-slide-up">
              <header className="mb-12">
                <button 
                  onClick={() => setView('list')}
                  className="text-slate-400 hover:text-indigo-600 flex items-center gap-3 mb-6 font-black text-xs uppercase tracking-widest transition-all group"
                >
                  <div className="p-2.5 bg-white shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 rounded-xl transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </div>
                  Painel Central
                </button>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Inserir BO<span className="text-indigo-600">.</span></h2>
                <p className="text-slate-500 mt-4 font-medium text-lg leading-relaxed">Capture dados operacionais com precisão militar e inteligência artificial.</p>
              </header>
              <ReportForm onSave={addReport} />
            </div>
          )}

          {view === 'stats' && (
            <div className="space-y-10 animate-slide-up">
              <header>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Inteligência<span className="text-indigo-600">.</span></h2>
                <p className="text-slate-500 mt-4 font-medium text-lg">Análise estatística e produtividade para decisões estratégicas.</p>
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