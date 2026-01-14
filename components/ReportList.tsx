
import React, { useState } from 'react';
import { PoliceReport } from '../types';
import { Search, MapPin, Calendar, Trash2, ChevronRight, FileText } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text"
          placeholder="Pesquisar por BO, cidade ou resumo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Nenhum registro encontrado.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md group relative flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-indigo-50 transition-colors hidden md:block">
                <FileText className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">BOEPM: {report.boepm || 'N/A'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">BOEPC: {report.boepc || 'N/A'}</span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{report.summary.slice(0, 100)}...</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {report.city} - {report.neighborhood}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(report.dateTime).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onDelete(report.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  Ver Detalhes
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
