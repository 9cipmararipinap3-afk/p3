import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  ExternalLink,
  Plus,
  ArrowRight,
  Activity,
  Menu,
  X,
  Bell,
  Search as SearchIcon,
  LogOut,
  ChevronRight,
  Database
} from 'lucide-react';
import { PoliceReport } from './types';
import ReportForm from './components/ReportForm';
import StatisticsDashboard from './components/StatisticsDashboard';
import ReportList from './components/ReportList';

const App: React.FC = () => {
  const [reports, setReports] = useState<PoliceReport[]>([]);
  const [view, setView] = useState<'list' | 'add' | 'stats'>('list');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const projectName = process.env.VERCEL_PROJECT_NAME || '9-cipm-sgo';

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
    if(window.confirm("Deseja realmente arquivar este registro permanentemente?")) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const NavLink = ({ target, icon: Icon, label }: { target: 'list' | 'add' | 'stats', icon: any, label: string }) => (
    <button 
      onClick={() => { setView(target); setIsMenuOpen(false); }}
      className={`sidebar-link w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 font-bold ${view === target ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 translate-x-1' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <div className={`transition-all duration-300 ${view === target ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm tracking-tight">{label}</span>
      {view === target && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-slate-900 overflow-hidden">
      {/* Sidebar de Elite */}
      <aside className="hidden md:flex w-80 bg-[#020617] text-white flex-col sticky top-0 h-screen z-30 shadow-[10px_0_40px_-15px_rgba(0,0,0,0.3)]">
        <div className="p-10">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-2xl shadow-indigo-600/40 ring-1 ring-white/20 transition-transform duration-700 group-hover:rotate-[360deg]">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter text-white">SGO<span className="text-indigo-500">.</span></h1>
              <p className="text-[9px] text-indigo-400/60 font-black uppercase tracking-[0.3em] -mt-1">Digital Command</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <div className="px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Inteligência Operacional</div>
          <NavLink target="list" icon={FileText} label="Dossiês Ativos" />
          <NavLink target="add" icon={PlusCircle} label="Novo Boletim" />
          <NavLink target="stats" icon={BarChart3} label="Análise de Dados" />
        </nav>

        <div className="p-8 space-y-4">
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizado</span>
              </div>
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-slate-300 font-bold truncate">{projectName.toUpperCase()}</p>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                <Database className="w-3 h-3" />
                Vercel IAD1 Edge
              </div>
            </div>
          </div>
          <button className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all text-xs font-black uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Finalizar Sessão
          </button>
        </div>
      </aside>

      {/* Mobile Header Modernizado */}
      <header className="md:hidden bg-[#020617] text-white p-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter">SGO 9ª CIPM</span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-white/5 rounded-2xl text-slate-400 active:scale-90 transition-all border border-white/10"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#020617]/98 backdrop-blur-3xl z-40 pt-28 px-8 flex flex-col gap-4 animate-in fade-in duration-300">
           <NavLink target="list" icon={FileText} label="Ocorrências" />
           <NavLink target="add" icon={PlusCircle} label="Novo Boletim" />
           <NavLink target="stats" icon={BarChart3} label="Estatísticas" />
        </div>
      )}

      {/* Main Área de Comando */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        {/* Barra Superior Executiva */}
        <div className="hidden md:flex h-24 border-b border-slate-200 bg-white/60 backdrop-blur-2xl sticky top-0 z-20 px-12 items-center justify-between">
          <div className="relative group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar registros..."
              className="w-[400px] pl-14 pr-6 py-3.5 bg-slate-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-2xl outline-none transition-all text-sm font-bold text-slate-600 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none tracking-tight">Oficial Operacional</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">9ª CIPM · Araripina</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white shadow-xl group-hover:bg-indigo-600 transition-colors">
                P3
              </div>
            </div>
          </div>
        </div>

        {/* Content Container com Padding Estratégico */}
        <div className="p-8 md:p-14 max-w-7xl mx-auto w-full space-y-12">
          {view === 'list' && (
            <div className="space-y-12 animate-slide-up">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Painel de<br/>Comando<span className="text-indigo-600">.</span></h2>
                  <p className="text-slate-400 font-bold text-lg mt-4 flex items-center gap-3">
                    <span className="w-12 h-0.5 bg-indigo-500"></span>
                    Central de Inteligência Operacional
                  </p>
                </div>
                <button 
                  onClick={() => setView('add')} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 flex items-center gap-4"
                >
                  <Plus className="w-5 h-5 stroke-[3px]" /> Inserir Novo Registro
                </button>
              </header>
              <ReportList reports={reports} onDelete={deleteReport} />
            </div>
          )}

          {view === 'add' && (
            <div className="max-w-4xl mx-auto animate-slide-up">
              <header className="mb-14">
                <button 
                  onClick={() => setView('list')}
                  className="text-slate-400 hover:text-indigo-600 flex items-center gap-3 mb-8 font-black text-xs uppercase tracking-widest transition-all group"
                >
                  <div className="p-3 bg-white shadow-lg border border-slate-100 group-hover:bg-indigo-50 rounded-2xl transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </div>
                  Voltar ao Centro de Comando
                </button>
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Novo Dossiê<span className="text-indigo-600">.</span></h2>
                <p className="text-slate-500 mt-6 font-medium text-xl leading-relaxed">Estruturação de dados com análise assistida por IA.</p>
              </header>
              <ReportForm onSave={addReport} />
            </div>
          )}

          {view === 'stats' && (
            <div className="space-y-12 animate-slide-up">
              <header>
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter">Indicadores<span className="text-indigo-600">.</span></h2>
                <p className="text-slate-500 mt-6 font-medium text-xl">Métricas de performance e manchas criminais em tempo real.</p>
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