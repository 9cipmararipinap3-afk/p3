import React, { useState, useRef } from 'react';
import { PoliceReport, CrimeNature } from '../types';
import { Upload, Plus, Trash2, Loader2, Sparkles, Info, ArrowRight, ShieldAlert, Package, MapPin, ClipboardList } from 'lucide-react';
import { extractDataFromContent } from '../geminiService';

interface ReportFormProps {
  onSave: (report: PoliceReport) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PoliceReport>>({
    nature: [],
    seizedItems: [],
    involvedParties: [],
    city: 'Araripina',
    dateTime: new Date().toISOString().slice(0, 16)
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const mimeType = file.type;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        const extracted = await extractDataFromContent(base64, mimeType);
        
        setFormData(prev => ({
          ...prev,
          ...extracted,
          nature: Array.isArray(extracted.nature) ? extracted.nature : [extracted.nature].filter(Boolean)
        }));
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Falha crítica no motor de IA. Verifique as chaves de API.");
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      seizedItems: [...(prev.seizedItems || []), { type: '', quantity: '', unit: '' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seizedItems: prev.seizedItems?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.summary) return alert("Erro: O resumo operacional é um campo obrigatório.");

    const newReport: PoliceReport = {
      ...(formData as PoliceReport),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      nature: formData.nature as CrimeNature[] || [CrimeNature.OUTROS]
    };
    onSave(newReport);
  };

  return (
    <div className="space-y-16">
      {/* Módulo de IA Avançado */}
      <div className="relative group overflow-hidden rounded-[4rem] p-1.5 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.005] duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 animate-pulse"></div>
        <div className="relative bg-[#020617] p-12 md:p-16 rounded-[3.8rem] flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-3 bg-indigo-500/10 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" /> Gemini Cognitive Engine
            </div>
            <h3 className="text-5xl font-black tracking-tighter text-white leading-tight">Digitalize Boletins<br/>em Segundos<span className="text-indigo-500">.</span></h3>
            <p className="text-slate-400 font-medium text-xl leading-relaxed max-w-lg">Processamento neural de documentos para preenchimento automatizado de ocorrências.</p>
          </div>
          
          <div className="w-full lg:w-auto">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="relative w-full lg:w-80 group/btn bg-white hover:bg-indigo-50 text-slate-950 px-10 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-3xl disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                {loading ? <Loader2 className="w-7 h-7 animate-spin text-indigo-600" /> : <Upload className="w-7 h-7 text-indigo-600" />}
                {loading ? 'Analisando...' : 'Carregar Documento'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-40">
        <div className="lg:col-span-2 space-y-12">
          <div className="premium-card p-12 md:p-16 space-y-10">
            <div className="flex items-center gap-5 mb-4">
              <div className="p-4 bg-indigo-50 rounded-[1.5rem]"><ClipboardList className="w-7 h-7 text-indigo-600" /></div>
              <h4 className="font-black text-slate-900 text-3xl tracking-tighter">Dados do Incidente</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Referência PM</label>
                <input 
                  value={formData.boepm || ''}
                  onChange={e => setFormData({...formData, boepm: e.target.value})}
                  className="input-executive h-16" 
                  placeholder="2026.000.000"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Protocolo PC</label>
                <input 
                  value={formData.boepc || ''}
                  onChange={e => setFormData({...formData, boepc: e.target.value})}
                  className="input-executive h-16" 
                  placeholder="Ocorrência PC"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Data/Hora Operacional</label>
                <input 
                  type="datetime-local"
                  value={formData.dateTime || ''}
                  onChange={e => setFormData({...formData, dateTime: e.target.value})}
                  className="input-executive h-16 font-mono" 
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Município Atendido</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    value={formData.city || ''}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="input-executive h-16 pl-14" 
                    placeholder="Araripina..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Relatório Narrativo Completo</label>
              <textarea 
                rows={12}
                value={formData.summary || ''}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                className="input-executive resize-none leading-relaxed text-lg p-8" 
                placeholder="Descreva a dinâmica da ocorrência, abordagens efetuadas e materiais custodiados..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="premium-card p-12">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Package className="w-7 h-7 text-indigo-600" />
                  <h4 className="font-black text-slate-900 text-2xl tracking-tighter">Inventário</h4>
                </div>
                <button 
                  type="button"
                  onClick={addItem}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center shadow-2xl active:scale-90"
                >
                  <Plus className="w-6 h-6 stroke-[3px]" />
                </button>
             </div>

             <div className="space-y-6">
                {formData.seizedItems?.length === 0 && (
                  <div className="text-center py-16 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sem Apreensões Listadas</p>
                  </div>
                )}
                {formData.seizedItems?.map((item, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-5 relative group animate-in slide-in-from-right-4">
                    <button 
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="absolute top-6 right-6 p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="space-y-4">
                      <input 
                        placeholder="Natureza do Material"
                        className="w-full bg-transparent border-b-2 border-slate-200 outline-none text-md font-black text-slate-700 focus:border-indigo-600 transition-colors py-1"
                        value={item.type}
                        onChange={e => {
                          const items = [...(formData.seizedItems || [])];
                          items[idx].type = e.target.value;
                          setFormData({...formData, seizedItems: items});
                        }}
                      />
                      <div className="flex gap-6">
                        <input 
                          placeholder="Quant."
                          className="w-full bg-transparent border-b-2 border-slate-200 outline-none text-xs font-black text-slate-500"
                          value={item.quantity}
                          onChange={e => {
                            const items = [...(formData.seizedItems || [])];
                            items[idx].quantity = e.target.value;
                            setFormData({...formData, seizedItems: items});
                          }}
                        />
                        <input 
                          placeholder="Unid."
                          className="w-full bg-transparent border-b-2 border-slate-200 outline-none text-xs font-black text-slate-500"
                          value={item.unit}
                          onChange={e => {
                            const items = [...(formData.seizedItems || [])];
                            items[idx].unit = e.target.value;
                            setFormData({...formData, seizedItems: items});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] flex items-start gap-5">
              <ShieldAlert className="w-7 h-7 text-rose-500 shrink-0" />
              <p className="text-[11px] text-rose-700 font-black leading-relaxed uppercase tracking-widest">Atenção: Valide rigorosamente os dados processados antes da submissão final ao sistema.</p>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#020617] hover:bg-indigo-600 text-white p-8 rounded-[3rem] font-black text-xl shadow-3xl active:scale-[0.98] transition-all flex items-center justify-center gap-5 uppercase tracking-tighter"
            >
              Arquivar no Sistema
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;