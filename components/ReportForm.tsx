import React, { useState, useRef } from 'react';
import { PoliceReport, CrimeNature, SeizedItem } from '../types';
import { Upload, Plus, Trash2, Camera, Loader2, Sparkles, FileText, Info, ArrowRight, ShieldAlert, Package, MapPin } from 'lucide-react';
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
        const base64 = (reader.result as string).split(',')[1];
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
      alert("Falha no processamento por IA. Verifique sua conexão ou API Key.");
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
    if (!formData.summary) return alert("O resumo da ocorrência é obrigatório.");

    const newReport: PoliceReport = {
      ...(formData as PoliceReport),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      nature: formData.nature as CrimeNature[] || [CrimeNature.OUTROS]
    };
    onSave(newReport);
  };

  return (
    <div className="space-y-12">
      {/* IA Section - Sophisticated Mesh Design */}
      <div className="relative group overflow-hidden rounded-[3rem] p-1 shadow-2xl transition-transform hover:scale-[1.01] duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-900 animate-gradient-xy"></div>
        <div className="relative bg-[#0f172a]/90 backdrop-blur-xl p-10 rounded-[2.9rem] flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2.5 bg-indigo-500/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" /> Gemini AI Engine
            </div>
            <h3 className="text-4xl font-black tracking-tighter text-white">Extração Inteligente</h3>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">Envie a imagem ou PDF do boletim e deixe que nossa IA estruture os dados operacionais automaticamente.</p>
          </div>
          
          <div className="w-full lg:w-auto">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*,application/pdf" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="group/btn relative w-full lg:w-72 overflow-hidden bg-white hover:bg-indigo-50 text-slate-900 px-8 py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-indigo-600" /> : <Upload className="w-6 h-6 text-indigo-600" />}
                {loading ? 'Processando Documento...' : 'Upload de Boletim'}
              </div>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-32">
        <div className="lg:col-span-2 space-y-10">
          <div className="premium-card p-10 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-slate-100 rounded-2xl"><Info className="w-6 h-6 text-indigo-600" /></div>
              <h4 className="font-black text-slate-900 text-2xl tracking-tighter">Detalhes do Registro</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Referência BOEPM</label>
                <input 
                  value={formData.boepm || ''}
                  onChange={e => setFormData({...formData, boepm: e.target.value})}
                  className="input-executive" 
                  placeholder="Ex: 2026.0001.234"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Referência BOEPC</label>
                <input 
                  value={formData.boepc || ''}
                  onChange={e => setFormData({...formData, boepc: e.target.value})}
                  className="input-executive" 
                  placeholder="Ex: 26E0001"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Cronologia dos Fatos</label>
                <input 
                  type="datetime-local"
                  value={formData.dateTime || ''}
                  onChange={e => setFormData({...formData, dateTime: e.target.value})}
                  className="input-executive font-mono" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Localidade / Cidade</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300" />
                  <input 
                    value={formData.city || ''}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="input-executive pl-12" 
                    placeholder="Araripina..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Relato Operacional (Síntese)</label>
              <textarea 
                rows={10}
                value={formData.summary || ''}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                className="input-executive resize-none leading-relaxed text-base" 
                placeholder="Descreva minuciosamente a dinâmica da ocorrência, abordagens e desfechos..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="premium-card p-10">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-indigo-600" />
                  <h4 className="font-black text-slate-900 text-2xl tracking-tighter">Materiais</h4>
                </div>
                <button 
                  type="button"
                  onClick={addItem}
                  className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-indigo-600/5 active:scale-90"
                >
                  <Plus className="w-5 h-5 stroke-[3px]" />
                </button>
             </div>

             <div className="space-y-5">
                {formData.seizedItems?.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sem Apreensões</p>
                  </div>
                )}
                {formData.seizedItems?.map((item, idx) => (
                  <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4 relative group animate-in slide-in-from-right-4 duration-300">
                    <button 
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-3">
                      <input 
                        placeholder="Tipo de Material"
                        className="w-full bg-transparent border-b-2 border-slate-200 outline-none text-sm font-black text-slate-700 focus:border-indigo-500 transition-colors"
                        value={item.type}
                        onChange={e => {
                          const items = [...(formData.seizedItems || [])];
                          items[idx].type = e.target.value;
                          setFormData({...formData, seizedItems: items});
                        }}
                      />
                      <div className="flex gap-4">
                        <input 
                          placeholder="Qtd"
                          className="w-full bg-transparent border-b-2 border-slate-200 outline-none text-xs font-bold text-slate-500 focus:border-indigo-500"
                          value={item.quantity}
                          onChange={e => {
                            const items = [...(formData.seizedItems || [])];
                            items[idx].quantity = e.target.value;
                            setFormData({...formData, seizedItems: items});
                          }}
                        />
                        <input 
                          placeholder="Unid"
                          className="w-full bg-transparent border-b-2 border-slate-200 outline-none text-xs font-bold text-slate-500 focus:border-indigo-500"
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

          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
              <p className="text-[11px] text-rose-700 font-bold leading-relaxed uppercase tracking-wider">Certifique-se de que todos os dados extraídos pela IA estão corretos antes de salvar.</p>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white p-7 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4 uppercase tracking-tighter"
            >
              Arquivar Ocorrência
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;