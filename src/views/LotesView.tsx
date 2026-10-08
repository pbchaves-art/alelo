import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Layers,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export const LotesView: React.FC = () => {
  const { lotes, insumos, navigate } = useApp();
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'urgentes' | 'quarentena'>('todos');

  // Group lots by insumo to show the FEFO comparison clearly
  const groupedByInsumo: Record<string, typeof lotes> = {};
  lotes.forEach((lote) => {
    if (!groupedByInsumo[lote.insumoId]) {
      groupedByInsumo[lote.insumoId] = [];
    }
    groupedByInsumo[lote.insumoId].push(lote);
  });

  // Sort lots inside each insumo by expiry date (FEFO: earliest expiry first)
  Object.keys(groupedByInsumo).forEach((insId) => {
    groupedByInsumo[insId].sort((a, b) => new Date(a.validade).getTime() - new Date(b.validade).getTime());
  });

  const filteredLotes = lotes.filter((l) => {
    if (filtroStatus === 'urgentes') return l.diasParaVencer <= 30 && l.diasParaVencer > 0;
    if (filtroStatus === 'quarentena') return l.diasParaVencer <= 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and FEFO Banner */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
              Controle de Lotes & Regra FEFO
            </h2>
            <span className="text-[11px] font-bold text-white bg-[#123B5D] px-2 py-0.5 rounded-xs tracking-wider uppercase">
              FEFO Ativo
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
            <strong>First Expire, First Out:</strong> O ALELO organiza os lotes por data de expiração e recomenda obrigatoriamente a utilização prioritária do lote de vencimento mais próximo para evitar perdas laboratoriais.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/estoque/nova-saida')}
            className="px-3.5 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Registrar Saída pelo Lote FEFO #1
          </button>
        </div>
      </div>

      {/* FEFO Highlight Demonstration Box */}
      <div className="bg-white border border-[#2A9D8F]/30 rounded-xl p-4 shadow-xs bg-linear-to-r from-emerald-50/40 to-teal-50/20">
        <div className="flex items-center gap-2 text-[#123B5D] font-bold text-xs uppercase tracking-wide mb-2">
          <Sparkles className="w-4 h-4 text-[#2A9D8F]" />
          Sugestão Inteligente de Consumo (FEFO Recomendado)
        </div>
        <p className="text-xs text-[#1F2933] mb-3">
          Ao abrir requisições analíticas no laboratório, consuma os lotes na ordem numerada abaixo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-white border-2 border-[#D98E04] rounded-lg shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#D98E04] text-white font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-xs">
                  PRIORIDADE 1 (FEFO)
                </span>
                <span className="text-xs font-bold text-[#1F2933]">PowerPlex Fusion 6C</span>
              </div>
              <div className="text-xs text-[#667085] mt-1">
                Lote <strong>FUS-2026-008</strong> · Validade: <strong>15/11/2026</strong> ({4} un restantes)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#D98E04] uppercase">Consumir Primeiro</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-[#D9E1E8] rounded-lg shadow-xs flex items-center justify-between opacity-80">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#667085] text-white font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-xs">
                  RESERVA (FEFO 2)
                </span>
                <span className="text-xs font-bold text-[#1F2933]">PowerPlex Fusion 6C</span>
              </div>
              <div className="text-xs text-[#667085] mt-1">
                Lote <strong>FUS-2026-015</strong> · Validade: <strong>22/05/2027</strong> ({8} un restantes)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#2E7D5B]">Lote Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-1 border border-[#D9E1E8] rounded-lg">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filtroStatus === 'todos'
                ? 'bg-white text-[#123B5D] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            Todos os Lotes ({lotes.length})
          </button>
          <button
            onClick={() => setFiltroStatus('urgentes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filtroStatus === 'urgentes'
                ? 'bg-white text-[#D98E04] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            Vencimento Próximo (≤30 dias)
          </button>
          <button
            onClick={() => setFiltroStatus('quarentena')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filtroStatus === 'quarentena'
                ? 'bg-white text-[#C94C4C] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            Quarentena / Vencidos
          </button>
        </div>
      </div>

      {/* Lots Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">FEFO</th>
                <th className="py-3 px-3">Produto</th>
                <th className="py-3 px-3">Lote</th>
                <th className="py-3 px-3">Recebido Em</th>
                <th className="py-3 px-3">Validade</th>
                <th className="py-3 px-3">Saldo / Inicial</th>
                <th className="py-3 px-3">Localização</th>
                <th className="py-3 px-3">Situação</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {filteredLotes.map((lote) => {
                const isUrgent = lote.diasParaVencer <= 30 && lote.diasParaVencer > 0;
                const isExpired = lote.diasParaVencer <= 0;

                return (
                  <tr key={lote.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      {isExpired ? (
                        <span className="bg-[#C94C4C] text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-xs">
                          BLOQUEADO
                        </span>
                      ) : lote.fefoOrdem === 1 ? (
                        <span className="bg-[#D98E04] text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-xs">
                          FEFO #1
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded-xs">
                          FEFO #{lote.fefoOrdem}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1F2933]">
                      {lote.insumoNome}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#123B5D]">
                      {lote.numeroLote}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#667085] text-[11px]">
                      {lote.dataRecebimento}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs whitespace-nowrap">
                      <div>
                        <span className="font-semibold text-[#1F2933]">{lote.validade}</span>
                        {isExpired ? (
                          <span className="block text-[10px] text-[#C94C4C] font-sans font-bold">
                            Vencido há {Math.abs(lote.diasParaVencer)} dias
                          </span>
                        ) : isUrgent ? (
                          <span className="block text-[10px] text-[#D98E04] font-sans font-semibold">
                            Restam {lote.diasParaVencer} dias
                          </span>
                        ) : (
                          <span className="block text-[10px] text-[#2E7D5B] font-sans">
                            {lote.diasParaVencer} dias restantes
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-[#1F2933] text-xs">
                        {lote.quantidadeAtual}
                      </span>
                      <span className="text-[#667085] text-[11px]">
                        {' '}/ {lote.quantidadeInicial} {lote.unidade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#667085] text-[11px]">
                      {lote.localizacao}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={lote.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isExpired ? (
                        <button
                          onClick={() => navigate('/estoque/nova-saida')}
                          className="px-2.5 py-1 bg-white hover:bg-[#F4F7F9] text-[#123B5D] border border-[#D9E1E8] text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          Usar Lote
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Lote ${lote.numeroLote} em quarentena. Proceder com o termo de descarte pericial.`)}
                          className="px-2.5 py-1 bg-rose-50 text-[#C94C4C] border border-[#C94C4C]/30 text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          Termo Descarte
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
