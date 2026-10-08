export type StatusItem = 'Normal' | 'Atenção' | 'Crítico' | 'Vencido' | 'Bloqueado';
export type StatusEquipamento = 'Regular' | 'Atenção' | 'Crítico' | 'Em Manutenção' | 'Inativo';
export type StatusPrazo = 'Crítico' | 'Atenção' | 'Normal' | 'Planejado' | 'Concluído';
export type TipoPrazo = 
  | 'Validade' 
  | 'Calibração' 
  | 'Manutenção' 
  | 'Verificação intermediária' 
  | 'Ensaio de proficiência' 
  | 'Revisão documental' 
  | 'Treinamento';

export type CategoriaInsumo = 
  | 'Kits de Amplificação (STR)' 
  | 'Kits de Quantificação' 
  | 'Kits de Extração' 
  | 'Polímeros e Eletroforese' 
  | 'Consumíveis Plásticos' 
  | 'Reagentes e Soluções' 
  | 'Controles e Padrões';

export interface Lote {
  id: string;
  insumoId: string;
  insumoNome: string;
  numeroLote: string;
  dataRecebimento: string;
  validade: string; // YYYY-MM-DD
  diasParaVencer: number;
  quantidadeInicial: number;
  quantidadeAtual: number;
  unidade: string;
  localizacao: string;
  status: StatusItem;
  fefoOrdem: number; // 1 = consumir primeiro
  revisado: boolean;
  fornecedor: string;
}

export interface Insumo {
  id: string;
  codigo: string;
  nome: string;
  categoria: CategoriaInsumo;
  fabricante: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  unidade: string;
  localizacaoPadrao: string;
  temperaturaArmazenamento: string;
  status: StatusItem;
  loteMaisProximoValidade?: string;
  validadeMaisProxima?: string;
  diasParaVencer?: number;
  lotes: Lote[];
  descricao?: string;
}

export interface Movimentacao {
  id: string;
  dataHora: string;
  usuario: string;
  insumoId: string;
  insumoNome: string;
  loteNumero: string;
  operacao: 'Entrada' | 'Saída';
  quantidade: number;
  estoqueAnterior: number;
  estoquePosterior: number;
  origem: 'Fotografia (OCR)' | 'Manual' | 'Ajuste de Inventário';
  finalidade?: string;
  evidenciaFotoUrl?: string;
  observacoes?: string;
}

export interface VerificacaoIntermediaria {
  id: string;
  data: string;
  tipo: string;
  responsavel: string;
  resultado: 'Conforme' | 'Não Conforme';
  desvioObservado?: string;
  proximaData: string;
}

export interface Equipamento {
  id: string;
  codigo: string;
  patrimonio: string;
  nome: string;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  localizacao: string;
  responsavel: string;
  ultimaCalibracao: string;
  proximaCalibracao: string;
  periodicidadeCalibracaoMeses: number;
  certificadoCalibracao?: string;
  ultimaManutencao: string;
  proximaManutencao: string;
  periodicidadeManutencaoMeses: number;
  tipoManutencao: 'Preventiva' | 'Corretiva';
  empresaManutencao: string;
  status: StatusEquipamento;
  verificacoes: VerificacaoIntermediaria[];
  historicoEventos: {
    data: string;
    tipo: string;
    descricao: string;
    responsavel: string;
  }[];
}

export interface PrazoObrigacao {
  id: string;
  data: string; // YYYY-MM-DD
  tipo: TipoPrazo;
  item: string;
  descricao: string;
  responsavel: string;
  situacao: StatusPrazo;
  diasRestantes: number;
  periodicidadeMeses?: number;
  concluidoEm?: string;
  relacionadoId?: string;
  rotaDestino?: string;
}

export interface Alerta {
  id: string;
  data: string;
  gravidade: 'Crítico' | 'Atenção' | 'Informativo';
  categoria: 'Validade' | 'Estoque' | 'Calibração' | 'Manutenção' | 'Qualidade';
  item: string;
  motivo: string;
  responsavel: string;
  acaoRecomendada: string;
  rotaAcao: string;
  resolvido: boolean;
}

export interface EnsaioProficiencia {
  id: string;
  codigo?: string;
  ensaio: string;
  organizacao: string; // ex: RIF / SENASP / CTS / GEDNAP
  identificacao: string;
  dataRecebimento: string;
  prazo: string;
  responsavel: string;
  status: 'Recebido' | 'Em análise' | 'Resultado enviado' | 'Finalizado';
  matriz: string;
  metodologia: string;
}

export interface RegistroAuditoria {
  id: string;
  dataHora: string;
  usuario: string;
  acao: string;
  objeto: string;
  valorAnterior: string;
  novoValor: string;
  origem: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  funcao: string;
  perfil: 'Administrador' | 'Responsável Técnico' | 'Qualidade' | 'Estoque' | 'Analista' | 'Visualização';
  status: 'Ativo' | 'Inativo';
  ultimoAcesso: string;
}
