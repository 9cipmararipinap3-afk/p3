
import React, { useState, useMemo } from 'react';
import { PoliceReport, ReportPeriod } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Download
} from 'lucide-react';

interface StatisticsDashboardProps {
  reports: PoliceReport[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ reports }) => {
  const [period, setPeriod] = useState<ReportPeriod>('MENSAL');

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Simple logic for counts by category
    const categoryCounts: Record<string, number> = {};
    reports.forEach(r => {
      const nat = r.nature[0] || 'Outros';
      categoryCounts[nat] = (categoryCounts[nat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    // Mock trend data based on reports (real apps would aggregate dates)
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const trendData = months.map((m, i) => ({
      name: m,
      current: reports.filter(r => new Date(r.dateTime).getMonth() === i && new Date(r.dateTime).getFullYear() === currentYear).length,
      previous: reports.filter(r => new Date(r.dateTime).getMonth() === i && new Date(r.dateTime).getFullYear() === currentYear - 1).length
    }));

    return { categoryData, trendData };
  }, [reports]);

  return (
    <div className="space-y-6 pb-12">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Período de Análise:</span>
          <div className="flex p-1 bg-slate-100 rounded-lg">
            {(['MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'] as ReportPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          <Download className="w-4 h-4" /> Exportar Relatório PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total de Ocorrências</p>
          <div className="flex items-end justify-between mt-2">
            <h4 className="text-3xl font-bold text-slate-900">{reports.length}</h4>
            <div className="flex items-center text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-4 h-4" /> 12%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Apreensões de Armas</p>
          <div className="flex items-end justify-between mt-2">
            <h4 className="text-3xl font-bold text-slate-900">
              {reports.filter(r => r.nature.includes('Posse/Porte de Arma de Fogo' as any)).length}
            </h4>
            <div className="flex items-center text-rose-500 text-sm font-bold bg-rose-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-4 h-4" /> 5%
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tráfico de Drogas</p>
          <div className="flex items-end justify-between mt-2">
            <h4 className="text-3xl font-bold text-slate-900">
              {reports.filter(r => r.nature.includes('Tráfico de Entorpecentes' as any)).length}
            </h4>
            <div className="flex items-center text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowDownRight className="w-4 h-4" /> 8%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h5 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Tendência de Crimes (Comparativo {new Date().getFullYear()} vs {new Date().getFullYear()-1})
          </h5>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="current" fill="#6366f1" radius={[4, 4, 0, 0]} name="Atual" />
                <Bar dataKey="previous" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Anterior" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h5 className="font-bold text-slate-900 mb-6">Distribuição por Natureza</h5>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {stats.categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
