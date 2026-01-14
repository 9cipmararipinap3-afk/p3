import React, { useState } from 'react';
import { PoliceReport } from '../types';
import { Search, MapPin, Calendar, Trash2, ChevronRight, FileText, Clock, ExternalLink } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="relative group max-w-2xl">
        <div className="absolute inset-0 bg-indigo-600/5 blur-xl rounded-3xl group-focus-within:bg-indigo-600/10 transition-colors"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por BO, Cidade, Natureza ou Conteúdo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 focus:bg-white bg-slate-50/50 outline-none transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Base de dados limpa</h3>
            <p className="text-slate-500 font-medium">Nenhum registro encontrado para os critérios informados.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 relative flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 hidden md:flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
                    PM: {report.boepm || 'Pendente'}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                    PC: {report.boepc || 'Pendente'}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-2 pr-10">
                  {report.summary}
                </h3>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-bold text-slate-500">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /> {report.city} · {report.neighborhood}</span>
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> {new Date(report.dateTime).toLocaleDateString('pt-BR')}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> {new Date(report.dateTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:border-l md:border-slate-100 md:pl-6">
                <button 
                  onClick={() => onDelete(report.id)}
                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  title="Arquivar/Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95">
                  Expandir
                  <ChevronRight className="w-4 h-4" />
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