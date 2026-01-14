import React, { useState } from 'react';
import { PoliceReport } from '../types';
import { Search, MapPin, Calendar, Trash2, ChevronRight, FileText, Clock, ShieldCheck, Map } from 'lucide-react';

interface ReportListProps {
  reports: PoliceReport[];
  onDelete: (id: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(r => 
    r.boepm?.includes(searchTerm) || 
    r.boepc?.includes(searchTerm) || 
    r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="relative group max-w-3xl">
        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Filtrar por número de boletim, cidade, bairro ou descrição..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] border border-slate-200 focus:border-indigo-500 focus:bg-white bg-white shadow-xl shadow-slate-200/20 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {filteredReports.length === 0 ? (
          <div className="bg-white py-32 text-center rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vazio Estratégico</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto text-lg">Nenhuma ocorrência registrada nos parâmetros informados.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="group premium-card p-8 relative flex flex-col lg:flex-row lg:items-center gap-10 overflow-hidden"
            >
              {/* Status Indicator Stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-indigo-950 text-indigo-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border border-indigo-500/20">
                    <ShieldCheck className="w-3 h-3" /> BOEPM: {report.boepm || '---'}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border border-slate-200">
                    BOEPC: {report.boepc || '---'}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-black text-slate-900 text-2xl tracking-tighter line-clamp-2 group-hover:text-indigo-600 transition-colors duration-500">
                    {report.summary}
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-2.5"><MapPin className="w-4.5 h-4.5 text-indigo-500" /> {report.city} · <span className="text-slate-500">{report.neighborhood}</span></span>
                    <span className="flex items-center gap-2.5"><Calendar className="w-4.5 h-4.5 text-indigo-500" /> {new Date(report.dateTime).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-2.5"><Clock className="w-4.5 h-4.5 text-indigo-500" /> {new Date(report.dateTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 lg:border-l lg:border-slate-100 lg:pl-10">
                <button 
                  onClick={() => onDelete(report.id)}
                  className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                  title="Arquivar Registro"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                <button className="flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 group/btn">
                  Dossiê Completo
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportList;