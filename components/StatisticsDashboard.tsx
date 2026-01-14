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
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Download,
  Activity,
  Zap,
  ShieldCheck,
  MapPin
} from 'lucide-react';

interface StatisticsDashboardProps {
  reports: PoliceReport[];
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ reports }) => {
  const [period, setPeriod] = useState<ReportPeriod>('MENSAL');

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const categoryCounts: Record<string, number> = {};
    reports.forEach(r => {
      const nat = r.nature[0] || 'Outros';
      categoryCounts[nat] = (categoryCounts[nat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const trendData = months.map((m, i) => ({
      name: m,
      current: reports.filter(r => new Date(r.dateTime).getMonth() === i && new Date(r.dateTime).getFullYear() === currentYear).length,
      previous: reports.filter(r => new Date(r.dateTime).getMonth() === i && new Date(r.dateTime).getFullYear() === currentYear - 1).length
    }));

    return { categoryData, trendData };
  }, [reports]);

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Efetivo BOs', value: reports.length, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Apreensões Arma', value: reports.filter(r => JSON.stringify(r.nature).includes('Arma')).length, icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Natureza Tráfico', value: reports.filter(r => JSON.stringify(r.nature).includes('Tráfico')).length, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Focos Urbanos', value: [...new Set(reports.map(r => r.city))].length, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((metric, i) => (
          <div key={i} className="premium-card p-8 flex flex-col justify-between h-48 group">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color} transition-colors`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-200 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
              <h4 className="text-4xl font-black text-slate-900 tracking-tighter mt-1">{metric.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] sophisticated-shadow border border-slate-200/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Escala Temporal:</span>
          </div>
          <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            {(['MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'] as ReportPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${period === p ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/5 group">
          <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" /> PDF Executivo
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="premium-card p-10">
          <h5 className="font-black text-slate-900 text-2xl tracking-tighter mb-10 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Fluxo Operacional
          </h5>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="current" fill="#6366f1" radius={[8, 8, 0, 0]} name="Atual" barSize={24} />
                <Bar dataKey="previous" fill="#e2e8f0" radius={[8, 8, 0, 0]} name="Anterior" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card p-10 flex flex-col">
          <h5 className="font-black text-slate-900 text-2xl tracking-tighter mb-10">Predominância Criminal</h5>
          <div className="flex-1 flex flex-col md:flex-row items-center gap-10">
            <div className="h-72 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {stats.categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;