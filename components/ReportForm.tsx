
import React, { useState, useRef } from 'react';
import { PoliceReport, CrimeNature, SeizedItem } from '../types';
import { Upload, Plus, Trash2, Camera, Loader2, Sparkles, FileText } from 'lucide-react';
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
      alert("Erro ao processar arquivo via IA. Verifique sua conexão ou tente preencher manualmente.");
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
    const newReport: PoliceReport = {
      ...(formData as PoliceReport),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      nature: formData.nature as CrimeNature[] || [CrimeNature.OUTROS]
    };
    onSave(newReport);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            IA Assistant
          </h3>
          <p className="text-sm text-slate-500">Envie o BO e deixe que a IA preencha os dados.</p>
        </div>
        <div className="flex gap-2">
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
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-300 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Importar PDF/Imagem
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">BOEPM</label>
            <input 
              value={formData.boepm || ''}
              onChange={e => setFormData({...formData, boepm: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Ex: 2026010321590479"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">BOEPC</label>
            <input 
              value={formData.boepc || ''}
              onChange={e => setFormData({...formData, boepc: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Ex: 26E0290000034"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Data e Hora do Fato</label>
            <input 
              type="datetime-local"
              value={formData.dateTime || ''}
              onChange={e => setFormData({...formData, dateTime: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cidade</label>
            <input 
              value={formData.city || ''}
              onChange={e => setFormData({...formData, city: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Ex: Araripina"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Bairro/Local</label>
            <input 
              value={formData.neighborhood || ''}
              onChange={e => setFormData({...formData, neighborhood: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Ex: Centro"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Desfecho</label>
            <input 
              value={formData.outcome || ''}
              onChange={e => setFormData({...formData, outcome: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
              placeholder="Ex: Flagrante"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Material Apreendido</label>
            <button 
              type="button"
              onClick={addItem}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Adicionar Item
            </button>
          </div>
          <div className="space-y-3">
            {formData.seizedItems?.map((item, idx) => (
              <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2 duration-200">
                <input 
                  placeholder="Tipo (Ex: Maconha)"
                  className="flex-[2] px-4 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                  value={item.type}
                  onChange={e => {
                    const items = [...(formData.seizedItems || [])];
                    items[idx].type = e.target.value;
                    setFormData({...formData, seizedItems: items});
                  }}
                />
                <input 
                  placeholder="Qtd"
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                  value={item.quantity}
                  onChange={e => {
                    const items = [...(formData.seizedItems || [])];
                    items[idx].quantity = e.target.value;
                    setFormData({...formData, seizedItems: items});
                  }}
                />
                <input 
                  placeholder="Un"
                  className="w-16 px-4 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                  value={item.unit}
                  onChange={e => {
                    const items = [...(formData.seizedItems || [])];
                    items[idx].unit = e.target.value;
                    setFormData({...formData, seizedItems: items});
                  }}
                />
                <button 
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Resumo Técnico / Síntese Operacional</label>
          <textarea 
            rows={5}
            value={formData.summary || ''}
            onChange={e => setFormData({...formData, summary: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" 
            placeholder="Descreva a dinâmica da ocorrência..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="submit"
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            Salvar Registro no SGO
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
