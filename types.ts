
export enum CrimeNature {
  TRAFICO = 'Tráfico de Entorpecentes',
  ARMAS = 'Posse/Porte de Arma de Fogo',
  VIOLENCIA_DOMESTICA = 'Violência Doméstica',
  ROUBO_FURTO = 'Roubo/Furto',
  OUTROS = 'Outros'
}

export interface SeizedItem {
  type: string;
  quantity: string;
  unit: string;
}

export interface PoliceReport {
  id: string;
  boepm?: string;
  boepc?: string;
  dateTime: string;
  city: string;
  neighborhood: string;
  nature: CrimeNature[];
  outcome: string;
  summary: string;
  seizedItems: SeizedItem[];
  involvedParties: string[];
  createdAt: string;
}

export type ReportPeriod = 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface ChartDataPoint {
  period: string;
  count: number;
}
