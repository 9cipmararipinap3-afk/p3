
import React, { useState, useRef } from 'react';
import { PoliceReport, CrimeNature, SeizedItem } from '../types';
// Fixed: Added ArrowRight to the imports from lucide-react
import { Upload, Plus, Trash2, Camera, Loader2, Sparkles, FileText, Info, ArrowRight } from 'lucide-react';
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
      alert("Falha no processamento. Tente novamente.");
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
    <div className="space-y-8">
      {/* IA Section */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> IA Integrada
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-2">Processamento Inteligente</h3>
            <p className="text-indigo-100 font-medium opacity-90">Arraste seu PDF ou imagem do BO para extração automática de dados.</p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
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
              className="w-full bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? 'Analisando...' : 'Carregar Documento'}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-xl"><Info className="w-5 h-5 text-slate-500" /></div>
              <h4 className="font-black text-slate-900 text-xl tracking-tight">Dados Gerais</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Número BOEPM</label>
                <input 
                  value={formData.boepm || ''}
                  onChange={e => setFormData({...formData, boepm: e.target.value})}
                  className="input-field" 
                  placeholder="2026..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Número BOEPC</label>
                <input 
                  value={formData.boepc || ''}
                  onChange={e => setFormData({...formData, boepc: e.target.value})}
                  className="input-field" 
                  placeholder="26E..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Data e Hora</label>
                <input 
                  type="datetime-local"
                  value={formData.dateTime || ''}
                  onChange={e => setFormData({...formData, dateTime: e.target.value})}
                  className="input-field font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Localidade / Cidade</label>
                <input 
                  value={formData.city || ''}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="input-field" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Síntese da Ocorrência</label>
              <textarea 
                rows={8}
                value={formData.summary || ''}
                onChange={e => setFormData({...formData, summary: e.target.value})}
                className="input-field resize-none leading-relaxed" 
                placeholder="Descreva detalhadamente a dinâmica dos fatos..."
              />
            </div>
          </div>
        </div>

        {/* Side Actions & Items */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-slate-900 text-xl tracking-tight">Apreensões</h4>
                <button 
                  type="button"
                  onClick={addItem}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-4">
                {formData.seizedItems?.length === 0 && (
                  <p className="text-xs text-slate-400 font-medium italic text-center py-4">Nenhum item adicionado.</p>
                )}
                {formData.seizedItems?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group animate-in zoom-in-95 duration-200">
                    <button 
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input 
                      placeholder="Tipo de material"
                      className="w-full bg-transparent border-b border-slate-200 outline-none text-sm font-bold text-slate-700 focus:border-indigo-500"
                      value={item.type}
                      onChange={e => {
                        const items = [...(formData.seizedItems || [])];
                        items[idx].type = e.target.value;
                        setFormData({...formData, seizedItems: items});
                      }}
                    />
                    <div className="flex gap-2">
                      <input 
                        placeholder="Qtd"
                        className="w-full bg-transparent border-b border-slate-200 outline-none text-xs font-bold text-slate-500"
                        value={item.quantity}
                        onChange={e => {
                          const items = [...(formData.seizedItems || [])];
                          items[idx].quantity = e.target.value;
                          setFormData({...formData, seizedItems: items});
                        }}
                      />
                      <input 
                        placeholder="Unidade"
                        className="w-full bg-transparent border-b border-slate-200 outline-none text-xs font-bold text-slate-500"
                        value={item.unit}
                        onChange={e => {
                          const items = [...(formData.seizedItems || [])];
                          items[idx].unit = e.target.value;
                          setFormData({...formData, seizedItems: items});
                        }}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white p-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter"
          >
            Finalizar Registro
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
