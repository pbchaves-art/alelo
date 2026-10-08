import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Camera,
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  X
} from 'lucide-react';
import { Movimentacao } from '../types';

export const MovimentacoesView: React.FC = () => {
  const { movimentacoes, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [operacaoFilter, setOperacaoFilter] = useState<'Todas' | 'Entrada' | 'Saída'>('Todas');
  const [origemFilter, setOrigemFilter] = useState<'Todas' | 'Fotografia (OCR)' | 'Manual'>('Todas');
  const [selectedMov, setSelectedMov] = useState<Movimentacao | null>(null);

  const filtered = movimentacoes.filter((m) => {
    const matchesSearch =
      m.insumoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.loteNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.usuario.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOp = operacaoFilter === 'Todas' || m.operacao === operacaoFilter;
    const matchesOrigem = origemFilter === 'Todas' || m.origem === origemFilter;

    return matchesSearch && matchesOp && matchesOrigem;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Histórico e Rastreabilidade de Movimentações
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Registro cronológico imutável de entradas, retiradas, evidências fotográficas e saldos de estoque.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/estoque/leitura-foto')}
            className="flex items-center gap-2 px-3 py-2 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#123B5D] border border-[#2A9D8F]/40 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#2A9D8F]" />
            <span>Entrada por Foto (OCR)</span>
          </button>
          <button
            onClick={() => navigate('/estoque/nova-saida')}
            className="px-3 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Registrar Nova Saída
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por produto, lote ou perito responsável..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md focus:bg-white focus:border-[#123B5D] text-[#1F2933]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={operacaoFilter}
            onChange={(e) => setOperacaoFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] focus:bg-white"
          >
            <option value="Todas">Todas as Operações</option>
            <option value="Entrada">Entradas (+)</option>
            <option value="Saída">Saídas (-)</option>
          </select>

          <select
            value={origemFilter}
            onChange={(e) => setOrigemFilter(e.target.value as any)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] focus:bg-white"
          >
            <option value="Todas">Todas as Origens</option>
            <option value="Fotografia (OCR)">Fotografia (OCR)</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-3">Usuário</th>
                <th className="py-3 px-3">Operação</th>
                <th className="py-3 px-3">Produto</th>
                <th className="py-3 px-3">Lote</th>
                <th className="py-3 px-3">Qtd</th>
                <th className="py-3 px-3">Saldo Ant → Novo</th>
                <th className="py-3 px-3">Origem</th>
                <th className="py-3 px-4 text-right">Evidência / Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {filtered.map((item) => {
                const isEntrada = item.operacao === 'Entrada';

                return (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#1F2933] whitespace-nowrap">
                      {item.dataHora}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1F2933] whitespace-nowrap">
                      {item.usuario}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isEntrada ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#2E7D5B] text-xs">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Entrada</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#C94C4C] text-xs">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Saída</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1F2933]">
                      <div>{item.insumoNome}</div>
                      {item.finalidade && (
                        <div className="text-[10px] text-[#667085] font-normal truncate max-w-[200px]">
                          Motivo: {item.finalidade}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-[#123B5D]">
                      {item.loteNumero}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                      <span className={isEntrada ? 'text-[#2E7D5B]' : 'text-[#C94C4C]'}>
                        {isEntrada ? `+${item.quantidade}` : `-${item.quantidade}`}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#667085] whitespace-nowrap">
                      {item.estoqueAnterior} → <strong>{item.estoquePosterior}</strong>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {item.origem === 'Fotografia (OCR)' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded-xs">
                          <Camera className="w-3 h-3" />
                          <span>Fotografia</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#667085] bg-slate-100 px-2 py-0.5 rounded-xs">
                          <FileText className="w-3 h-3" />
                          <span>Manual</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedMov(item)}
                        className="px-2 py-1 text-xs font-semibold text-[#2A6F97] hover:text-[#123B5D] hover:underline cursor-pointer"
                      >
                        Ver Dossiê
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Detail Modal */}
      {selectedMov && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E8] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wider">
                  Comprovante de Movimentação #{selectedMov.id}
                </h3>
                <p className="text-xs text-[#667085]">
                  Rastreabilidade pericial e cadeia de custódia de insumos
                </p>
              </div>
              <button
                onClick={() => setSelectedMov(null)}
                className="text-[#667085] hover:text-[#1F2933] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Data / Horário Oficial:</span>
                  <span className="font-mono font-semibold text-[#1F2933]">{selectedMov.dataHora}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Perito / Operador:</span>
                  <span className="font-semibold text-[#1F2933]">{selectedMov.usuario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Tipo de Operação:</span>
                  <span className={`font-bold ${selectedMov.operacao === 'Entrada' ? 'text-[#2E7D5B]' : 'text-[#C94C4C]'}`}>
                    {selectedMov.operacao.toUpperCase()} ({selectedMov.operacao === 'Entrada' ? '+' : '-'}{selectedMov.quantidade})
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between border-b border-[#D9E1E8] py-1">
                  <span className="text-[#667085]">Insumo:</span>
                  <span className="font-bold text-[#1F2933]">{selectedMov.insumoNome}</span>
                </div>
                <div className="flex justify-between border-b border-[#D9E1E8] py-1">
                  <span className="text-[#667085]">Lote Controlado:</span>
                  <span className="font-mono font-bold text-[#123B5D]">{selectedMov.loteNumero}</span>
                </div>
                <div className="flex justify-between border-b border-[#D9E1E8] py-1">
                  <span className="text-[#667085]">Variação de Saldo:</span>
                  <span className="font-mono text-[#1F2933]">{selectedMov.estoqueAnterior} un → {selectedMov.estoquePosterior} un</span>
                </div>
                <div className="flex justify-between border-b border-[#D9E1E8] py-1">
                  <span className="text-[#667085]">Origem do Registro:</span>
                  <span className="text-[#2A6F97] font-semibold">{selectedMov.origem}</span>
                </div>
                {selectedMov.finalidade && (
                  <div className="flex justify-between border-b border-[#D9E1E8] py-1">
                    <span className="text-[#667085]">Finalidade:</span>
                    <span className="text-[#1F2933]">{selectedMov.finalidade}</span>
                  </div>
                )}
              </div>

              {selectedMov.observacoes && (
                <div className="mt-3 p-3 bg-amber-50/50 rounded-lg border border-amber-200 text-[#1F2933]">
                  <strong className="block text-[11px] text-[#D98E04] uppercase">Observações:</strong>
                  <p className="text-[11px] text-[#667085] mt-0.5">{selectedMov.observacoes}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[#D9E1E8] flex justify-end">
              <button
                onClick={() => setSelectedMov(null)}
                className="px-4 py-2 bg-[#123B5D] text-white text-xs font-semibold rounded-md hover:bg-[#0e2f4a] cursor-pointer"
              >
                Fechar Comprovante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
