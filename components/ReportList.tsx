import React, { useState } from 'react';
import { PoliceReport } from '../types';
import { Search, MapPin, Calendar, Trash2, ChevronRight, FileText, Clock, ShieldCheck, Tag } from 'lucide-react';

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
    <div className="space-y-12">
      <div className="relative group max-w-3xl">
        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <div className="relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text"
            placeholder="Filtrar base de dados..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-10 py-7 rounded-[2.5rem] border border-slate-200 focus:border-indigo-600 focus:bg-white bg-white shadow-2xl shadow-slate-200/40 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pb-32">
        {filteredReports.length === 0 ? (
          <div className="bg-white py-40 text-center rounded-[4rem] border border-dashed border-slate-200 shadow-xl">
            <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-inner">
              <FileText className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Nenhum Registro Ativo</h3>
            <p className="text-slate-400 font-bold mt-4 max-w-sm mx-auto text-lg leading-relaxed uppercase tracking-widest text-[10px]">Aguardando inserção de dados operacionais.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="group premium-card p-10 relative flex flex-col lg:flex-row lg:items-center gap-12 overflow-hidden hover:-translate-y-2"
            >
              {/* Indicador Lateral Dinâmico */}
              <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-indigo-600 opacity-10 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> BOEPM: {report.boepm || 'Pendente'}
                  </div>
                  <div className="flex items-center gap-3 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-slate-200">
                    <Tag className="w-3.5 h-3.5" /> BOEPC: {report.boepc || '---'}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-black text-slate-900 text-3xl tracking-tighter line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-500">
                    {report.summary}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-3"><MapPin className="w-5 h-5 text-indigo-500" /> {report.city} <span className="text-slate-300">/</span> {report.neighborhood}</span>
                    <span className="flex items-center gap-3"><Calendar className="w-5 h-5 text-indigo-500" /> {new Date(report.dateTime).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-3"><Clock className="w-5 h-5 text-indigo-500" /> {new Date(report.dateTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 lg:border-l lg:border-slate-100 lg:pl-12">
                <button 
                  onClick={() => onDelete(report.id)}
                  className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                  title="Arquivar Permanentemente"
                >
                  <Trash2 className="w-7 h-7" />
                </button>
                <button className="flex items-center gap-4 bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 group/btn">
                  Abrir Dossiê
                  <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
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