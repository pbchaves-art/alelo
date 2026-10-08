import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Insumo,
  Lote,
  Equipamento,
  PrazoObrigacao,
  Alerta,
  Movimentacao,
  EnsaioProficiencia,
  RegistroAuditoria,
  Usuario,
  VerificacaoIntermediaria
} from '../types';
import {
  INITIAL_INSUMOS,
  INITIAL_LOTES,
  INITIAL_EQUIPAMENTOS,
  INITIAL_PRAZOS,
  INITIAL_ALERTAS,
  INITIAL_MOVIMENTACOES,
  INITIAL_AUDITORIA,
  INITIAL_PROFICIENCIA,
  INITIAL_USUARIOS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  tipo: 'sucesso' | 'atencao' | 'erro' | 'info';
  titulo: string;
  mensagem: string;
  timestamp: number;
}

interface AppContextType {
  currentRoute: string;
  routeParam: string | null;
  navigate: (route: string) => void;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  currentUser: Usuario;
  setCurrentUser: (user: Usuario) => void;

  insumos: Insumo[];
  lotes: Lote[];
  equipamentos: Equipamento[];
  prazos: PrazoObrigacao[];
  alertas: Alerta[];
  movimentacoes: Movimentacao[];
  auditoria: RegistroAuditoria[];
  proficiencia: EnsaioProficiencia[];
  usuarios: Usuario[];

  // Mutations
  confirmarEntradaEstoque: (params: {
    insumoId: string;
    numeroLote: string;
    validade: string;
    quantidade: number;
    fornecedor?: string;
    origem: 'Fotografia (OCR)' | 'Manual';
    observacoes?: string;
    evidenciaFotoUrl?: string;
  }) => void;

  confirmarSaidaEstoque: (params: {
    insumoId: string;
    numeroLote: string;
    quantidade: number;
    finalidade: string;
    observacoes?: string;
  }) => boolean;

  resolverAlerta: (alertaId: string) => void;
  concluirPrazo: (prazoId: string) => void;
  adicionarVerificacaoEquipamento: (
    equipamentoId: string,
    verificacao: Omit<VerificacaoIntermediaria, 'id'>
  ) => void;

  toasts: ToastMessage[];
  addToast: (titulo: string, mensagem: string, tipo?: 'sucesso' | 'atencao' | 'erro' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync URL hash or path
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path && path !== '/' && path !== '') return path;
    }
    return '/dashboard';
  });
  const [routeParam, setRouteParam] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [usuarios] = useState<Usuario[]>(INITIAL_USUARIOS);
  const [currentUser, setCurrentUser] = useState<Usuario>(INITIAL_USUARIOS[0]);

  // Main collections with relations populated
  const [lotes, setLotes] = useState<Lote[]>(INITIAL_LOTES);
  const [insumos, setInsumos] = useState<Insumo[]>(() => {
    return INITIAL_INSUMOS.map((ins) => ({
      ...ins,
      lotes: INITIAL_LOTES.filter((l) => l.insumoId === ins.id)
    }));
  });

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(INITIAL_EQUIPAMENTOS);
  const [prazos, setPrazos] = useState<PrazoObrigacao[]>(INITIAL_PRAZOS);
  const [alertas, setAlertas] = useState<Alerta[]>(INITIAL_ALERTAS);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(INITIAL_MOVIMENTACOES);
  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>(INITIAL_AUDITORIA);
  const [proficiencia, setProficiencia] = useState<EnsaioProficiencia[]>(INITIAL_PROFICIENCIA);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation handler
  const navigate = (route: string) => {
    // Check if route has param like /equipamentos/eq-01
    const eqMatch = route.match(/^\/equipamentos\/(eq-[a-zA-Z0-9_-]+)$/);
    if (eqMatch) {
      setRouteParam(eqMatch[1]);
      setCurrentRoute('/equipamentos/[id]');
    } else {
      setRouteParam(null);
      setCurrentRoute(route);
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const eqMatch = path.match(/^\/equipamentos\/(eq-[a-zA-Z0-9_-]+)$/);
      if (eqMatch) {
        setRouteParam(eqMatch[1]);
        setCurrentRoute('/equipamentos/[id]');
      } else {
        setRouteParam(null);
        setCurrentRoute(path || '/dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addToast = (
    titulo: string,
    mensagem: string,
    tipo: 'sucesso' | 'atencao' | 'erro' | 'info' = 'sucesso'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, titulo, mensagem, tipo, timestamp: Date.now() };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (_email: string) => {
    setIsAuthenticated(true);
    navigate('/dashboard');
    addToast('Sessão iniciada', 'Bem-vindo ao sistema ALELO, Perito Paulo Chaves.', 'sucesso');
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/auth/login');
    addToast('Sessão encerrada', 'Você saiu com segurança do ambiente institucional.', 'info');
  };

  // Helper date formatter
  const getNowFormatted = () => {
    const now = new Date(2026, 9, 8, 8, 45); // simulated local time
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Confirm stock entry (from Photo/OCR or manual form)
  const confirmarEntradaEstoque = ({
    insumoId,
    numeroLote,
    validade,
    quantidade,
    fornecedor = 'Promega / Fornecedor Contratual',
    origem,
    observacoes = '',
    evidenciaFotoUrl
  }: {
    insumoId: string;
    numeroLote: string;
    validade: string;
    quantidade: number;
    fornecedor?: string;
    origem: 'Fotografia (OCR)' | 'Manual';
    observacoes?: string;
    evidenciaFotoUrl?: string;
  }) => {
    const targetInsumo = insumos.find((i) => i.id === insumoId);
    if (!targetInsumo) {
      addToast('Erro', 'Insumo não encontrado no cadastro.', 'erro');
      return;
    }

    const estoqueAnterior = targetInsumo.quantidadeAtual;
    const estoquePosterior = estoqueAnterior + quantidade;

    // Check if lot already exists or create new
    let existingLote = lotes.find(
      (l) => l.insumoId === insumoId && l.numeroLote.toUpperCase() === numeroLote.toUpperCase()
    );

    let updatedLotes = [...lotes];
    if (existingLote) {
      updatedLotes = updatedLotes.map((l) =>
        l.id === existingLote!.id
          ? { ...l, quantidadeAtual: l.quantidadeAtual + quantidade, validade }
          : l
      );
    } else {
      const newLote: Lote = {
        id: `lot-${Date.now().toString().slice(-4)}`,
        insumoId,
        insumoNome: targetInsumo.nome,
        numeroLote,
        dataRecebimento: '2026-10-08',
        validade,
        diasParaVencer: 365,
        quantidadeInicial: quantidade,
        quantidadeAtual: quantidade,
        unidade: targetInsumo.unidade,
        localizacao: targetInsumo.localizacaoPadrao,
        status: 'Normal',
        fefoOrdem: 2,
        revisado: true,
        fornecedor
      };
      updatedLotes.push(newLote);
    }

    setLotes(updatedLotes);

    // Update insumo state
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === insumoId) {
          const lotesDoInsumo = updatedLotes.filter((l) => l.insumoId === ins.id);
          return {
            ...ins,
            quantidadeAtual: estoquePosterior,
            status: estoquePosterior >= ins.quantidadeMinima ? 'Normal' : 'Atenção',
            lotes: lotesDoInsumo
          };
        }
        return ins;
      })
    );

    // Register movement
    const novaMov: Movimentacao = {
      id: `mov-${Date.now().toString().slice(-4)}`,
      dataHora: getNowFormatted(),
      usuario: currentUser.nome,
      insumoId,
      insumoNome: targetInsumo.nome,
      loteNumero: numeroLote,
      operacao: 'Entrada',
      quantidade,
      estoqueAnterior,
      estoquePosterior,
      origem,
      evidenciaFotoUrl,
      observacoes: observacoes || `Entrada registrada via ${origem}.`
    };
    setMovimentacoes((prev) => [novaMov, ...prev]);

    // Register audit trail
    const novoRegistroAuditoria: RegistroAuditoria = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      dataHora: `${getNowFormatted()}:12`,
      usuario: `${currentUser.nome} (${currentUser.perfil})`,
      acao: `Entrada de estoque (+${quantidade})`,
      objeto: `${targetInsumo.nome} / Lote ${numeroLote}`,
      valorAnterior: `Estoque: ${estoqueAnterior}`,
      novoValor: `Estoque: ${estoquePosterior} (+${quantidade})`,
      origem: origem === 'Fotografia (OCR)' ? 'Módulo de Reconhecimento Óptico (OCR)' : 'Entrada Manual de Almoxarifado'
    };
    setAuditoria((prev) => [novoRegistroAuditoria, ...prev]);

    addToast(
      'Entrada confirmada',
      `+${quantidade} ${targetInsumo.unidade} de ${targetInsumo.nome} incorporados ao estoque.`,
      'sucesso'
    );
  };

  // Confirm stock exit (manual disbursement for analysis, training, etc.)
  const confirmarSaidaEstoque = ({
    insumoId,
    numeroLote,
    quantidade,
    finalidade,
    observacoes = ''
  }: {
    insumoId: string;
    numeroLote: string;
    quantidade: number;
    finalidade: string;
    observacoes?: string;
  }): boolean => {
    const targetInsumo = insumos.find((i) => i.id === insumoId);
    if (!targetInsumo) {
      addToast('Erro', 'Insumo não localizado.', 'erro');
      return false;
    }

    const targetLote = lotes.find(
      (l) => l.insumoId === insumoId && l.numeroLote === numeroLote
    );

    if (!targetLote || targetLote.quantidadeAtual < quantidade) {
      addToast(
        'Saldo insuficiente no lote',
        `O lote selecionado possui apenas ${targetLote?.quantidadeAtual || 0} unidades disponíveis.`,
        'erro'
      );
      return false;
    }

    const estoqueAnterior = targetInsumo.quantidadeAtual;
    const estoquePosterior = estoqueAnterior - quantidade;

    // Update lots
    const updatedLotes = lotes.map((l) =>
      l.id === targetLote.id
        ? { ...l, quantidadeAtual: l.quantidadeAtual - quantidade }
        : l
    );
    setLotes(updatedLotes);

    // Update insumo
    setInsumos((prev) =>
      prev.map((ins) => {
        if (ins.id === insumoId) {
          const isAbaixoDoMinimo = estoquePosterior < ins.quantidadeMinima;
          return {
            ...ins,
            quantidadeAtual: estoquePosterior,
            status: isAbaixoDoMinimo ? 'Crítico' : ins.status,
            lotes: updatedLotes.filter((l) => l.insumoId === ins.id)
          };
        }
        return ins;
      })
    );

    // Register movement
    const novaMov: Movimentacao = {
      id: `mov-${Date.now().toString().slice(-4)}`,
      dataHora: getNowFormatted(),
      usuario: currentUser.nome,
      insumoId,
      insumoNome: targetInsumo.nome,
      loteNumero: numeroLote,
      operacao: 'Saída',
      quantidade,
      estoqueAnterior,
      estoquePosterior,
      origem: 'Manual',
      finalidade,
      observacoes: observacoes || `Retirada para: ${finalidade}.`
    };
    setMovimentacoes((prev) => [novaMov, ...prev]);

    // Register audit trail
    const novoRegistroAuditoria: RegistroAuditoria = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      dataHora: `${getNowFormatted()}:40`,
      usuario: `${currentUser.nome} (${currentUser.perfil})`,
      acao: `Saída de estoque (-${quantidade})`,
      objeto: `${targetInsumo.nome} / Lote ${numeroLote}`,
      valorAnterior: `Estoque: ${estoqueAnterior}`,
      novoValor: `Estoque: ${estoquePosterior} (-${quantidade})`,
      origem: `Requisição de Laboratório - Finalidade: ${finalidade}`
    };
    setAuditoria((prev) => [novoRegistroAuditoria, ...prev]);

    addToast(
      'Saída registrada',
      `-${quantidade} ${targetInsumo.unidade} de ${targetInsumo.nome} retirados com sucesso.`,
      'sucesso'
    );

    // Alert trigger if below minimum
    if (estoquePosterior < targetInsumo.quantidadeMinima) {
      setTimeout(() => {
        addToast(
          'Alerta de estoque mínimo',
          `${targetInsumo.nome} atingiu ${estoquePosterior} unidades (Mínimo: ${targetInsumo.quantidadeMinima}).`,
          'atencao'
        );
      }, 1000);
    }

    return true;
  };

  // Resolve alert
  const resolverAlerta = (alertaId: string) => {
    const alvo = alertas.find((a) => a.id === alertaId);
    if (!alvo) return;

    setAlertas((prev) =>
      prev.map((a) => (a.id === alertaId ? { ...a, resolvido: true } : a))
    );

    setAuditoria((prev) => [
      {
        id: `aud-${Date.now().toString().slice(-4)}`,
        dataHora: `${getNowFormatted()}:02`,
        usuario: `${currentUser.nome} (${currentUser.perfil})`,
        acao: 'Tratamento de Alerta Operacional',
        objeto: alvo.item,
        valorAnterior: 'Pendente / Não tratado',
        novoValor: 'Resolvido pelo Responsável',
        origem: 'Central de Alertas ALELO'
      },
      ...prev
    ]);

    addToast('Alerta resolvido', `O alerta referente a "${alvo.item}" foi marcado como resolvido.`, 'sucesso');
  };

  // Conclude deadline & automatically generate next period (simulating metrology rules!)
  const concluirPrazo = (prazoId: string) => {
    const prazo = prazos.find((p) => p.id === prazoId);
    if (!prazo) return;

    const periodicidade = prazo.periodicidadeMeses || 12;
    // Calculate new date +periodicidade months
    const dateParts = prazo.data.split('-');
    const currentYear = parseInt(dateParts[0], 10);
    const currentMonth = parseInt(dateParts[1], 10);
    const currentDay = dateParts[2];
    
    let nextMonth = currentMonth + periodicidade;
    let nextYear = currentYear;
    while (nextMonth > 12) {
      nextMonth -= 12;
      nextYear += 1;
    }
    const nextDateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${currentDay}`;

    // Mark current as concluded
    setPrazos((prev) => [
      {
        ...prazo,
        situacao: 'Concluído',
        concluidoEm: '2026-10-08'
      },
      {
        id: `prz-${Date.now().toString().slice(-4)}`,
        data: nextDateStr,
        tipo: prazo.tipo,
        item: prazo.item,
        descricao: `${prazo.tipo} periódica gerada automaticamente após conclusão do ciclo anterior.`,
        responsavel: prazo.responsavel,
        situacao: 'Planejado',
        diasRestantes: periodicidade * 30,
        periodicidadeMeses: periodicidade,
        relacionadoId: prazo.relacionadoId,
        rotaDestino: prazo.rotaDestino
      },
      ...prev.filter((p) => p.id !== prazoId)
    ]);

    setAuditoria((prev) => [
      {
        id: `aud-${Date.now().toString().slice(-4)}`,
        dataHora: `${getNowFormatted()}:18`,
        usuario: `${currentUser.nome} (${currentUser.perfil})`,
        acao: `Execução de ${prazo.tipo}`,
        objeto: prazo.item,
        valorAnterior: `Vencimento: ${prazo.data}`,
        novoValor: `Concluído em 08/10/2026. Próximo ciclo agendado para: ${nextDateStr}`,
        origem: 'Módulo de Prazos e Qualidade Laboratorial'
      },
      ...prev
    ]);

    addToast(
      'Obrigação concluída',
      `${prazo.tipo} de "${prazo.item}" registrada. Próximo vencimento gerado automaticamente para ${nextDateStr}.`,
      'sucesso'
    );
  };

  // Add intermediate check to equipment
  const adicionarVerificacaoEquipamento = (
    equipamentoId: string,
    verificacao: Omit<VerificacaoIntermediaria, 'id'>
  ) => {
    const newVerif: VerificacaoIntermediaria = {
      id: `v-${Date.now().toString().slice(-4)}`,
      ...verificacao
    };

    setEquipamentos((prev) =>
      prev.map((eq) => {
        if (eq.id === equipamentoId) {
          return {
            ...eq,
            status: 'Regular',
            verificacoes: [newVerif, ...eq.verificacoes],
            historicoEventos: [
              {
                data: verificacao.data,
                tipo: 'Verificação Intermediária',
                descricao: `${verificacao.tipo}: ${verificacao.resultado}. ${verificacao.desvioObservado || ''}`,
                responsavel: verificacao.responsavel
              },
              ...eq.historicoEventos
            ]
          };
        }
        return eq;
      })
    );

    setAuditoria((prev) => [
      {
        id: `aud-${Date.now().toString().slice(-4)}`,
        dataHora: `${getNowFormatted()}:25`,
        usuario: `${currentUser.nome} (${currentUser.perfil})`,
        acao: 'Registro de Verificação Intermediária',
        objeto: `Equipamento ID ${equipamentoId} (${verificacao.tipo})`,
        valorAnterior: 'Pendente de validação',
        novoValor: `Resultado: ${verificacao.resultado}`,
        origem: 'Metrologia / Controle de Equipamentos'
      },
      ...prev
    ]);

    addToast(
      'Verificação registrada',
      `Verificação intermediária registrada com sucesso para o equipamento.`,
      'sucesso'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        routeParam,
        navigate,
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
        insumos,
        lotes,
        equipamentos,
        prazos,
        alertas,
        movimentacoes,
        auditoria,
        proficiencia,
        usuarios,
        confirmarEntradaEstoque,
        confirmarSaidaEstoque,
        resolverAlerta,
        concluirPrazo,
        adicionarVerificacaoEquipamento,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
