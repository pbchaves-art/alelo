import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MinusCircle, ArrowLeft, Check, Sparkles, AlertTriangle } from 'lucide-react';

export const NovaSaidaView: React.FC = () => {
  const { insumos, lotes, confirmarSaidaEstoque, navigate } = useApp();

  const [insumoId, setInsumoId] = useState(insumos[0]?.id || '');
  const [numeroLote, setNumeroLote] = useState('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [finalidade, setFinalidade] = useState('Processamento de amostras');
  const [observacoes, setObservacoes] = useState('');

  const selectedInsumo = insumos.find((i) => i.id === insumoId);
  const lotesDoInsumo = lotes.filter((l) => l.insumoId === insumoId && l.quantidadeAtual > 0);

  // Auto-select FEFO lot (earliest expiration)
  useEffect(() => {
    if (lotesDoInsumo.length > 0) {
      const sorted = [...lotesDoInsumo].sort(
        (a, b) => new Date(a.validade).getTime() - new Date(b.validade).getTime()
      );
      setNumeroLote(sorted[0].numeroLote);
    } else {
      setNumeroLote('');
    }
  }, [insumoId]);

  const selectedLote = lotesDoInsumo.find((l) => l.numeroLote === numeroLote);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroLote) {
      alert('Selecione um lote disponível com saldo positivo.');
      return;
    }

    const sucesso = confirmarSaidaEstoque({
      insumoId,
      numeroLote,
      quantidade,
      finalidade,
      observacoes: observacoes || `Retirada registrada para: ${finalidade}.`
    });

    if (sucesso) {
      navigate('/estoque/movimentacoes');
    }
  };

  const finalidadesOpcoes = [
    'Processamento de amostras',
    'Controle interno',
    'Validação',
    'Treinamento',
    'Pesquisa',
    'Outro'
  ];

  const estoqueAntes = selectedInsumo?.quantidadeAtual || 0;
  const estoqueDepois = estoqueAntes - quantidade;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/estoque')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#2A6F97] hover:text-[#123B5D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Estoque</span>
        </button>
      </div>

      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-6 md:p-8">
        <div className="mb-6 pb-4 border-b border-[#D9E1E8]">
          <h2 className="text-lg font-bold text-[#123B5D]">
            Registrar Saída / Retirada de Insumo
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Baixa de materiais com segregação de finalidade pericial e recomendação FEFO.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
              Produto a Ser Retirado *
            </label>
            <select
              value={insumoId}
              onChange={(e) => setInsumoId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs text-[#1F2933] font-medium focus:bg-white focus:border-[#123B5D]"
            >
              {insumos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome} (Saldo Atual: {item.quantidadeAtual} {item.unidade})
                </option>
              ))}
            </select>
          </div>

          {/* FEFO Lot Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide">
                Lote de Origem (Sugestão FEFO) *
              </label>
              <span className="text-[11px] font-semibold text-[#D98E04] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Priorizar vencimento mais próximo</span>
              </span>
            </div>

            {lotesDoInsumo.length === 0 ? (
              <div className="p-3 bg-rose-50 text-[#C94C4C] rounded-md text-xs font-semibold">
                Nenhum lote ativo com saldo em estoque para este insumo.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lotesDoInsumo.map((lot, idx) => {
                  const isSelected = lot.numeroLote === numeroLote;
                  const isFEFO1 = idx === 0;

                  return (
                    <div
                      key={lot.id}
                      onClick={() => setNumeroLote(lot.numeroLote)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#123B5D] bg-[#123B5D]/5 ring-1 ring-[#123B5D]'
                          : 'border-[#D9E1E8] hover:border-[#123B5D]/40 bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#123B5D]">
                          Lote {lot.numeroLote}
                        </span>
                        {isFEFO1 && (
                          <span className="bg-[#D98E04] text-white font-mono font-bold text-[9px] px-1 rounded-xs">
                            FEFO #1
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-[11px] text-[#667085]">
                        Validade: <strong className="text-[#1F2933]">{lot.validade}</strong>
                      </div>
                      <div className="text-[11px] text-[#667085]">
                        Saldo disponível: <strong className="text-[#1F2933]">{lot.quantidadeAtual} {lot.unidade}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
                Quantidade a Retirar *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={selectedLote?.quantidadeAtual || 99}
                  required
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value, 10) || 1)}
                  className="w-32 px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs font-mono font-bold text-[#1F2933] focus:bg-white"
                />
                <span className="text-xs text-[#667085]">
                  {selectedInsumo?.unidade || 'unidades'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
                Finalidade da Retirada *
              </label>
              <select
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs text-[#1F2933] font-medium focus:bg-white"
              >
                {finalidadesOpcoes.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
              Número do Laudo / Procedimento / Justificativa
            </label>
            <textarea
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Amplificação em lote para casos da Delegacia Estadual de Homicídios (Laudos 2026/894 a 2026/902)."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs text-[#1F2933] focus:bg-white"
            />
          </div>

          {/* Stock impact summary */}
          {selectedInsumo && (
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8] space-y-1.5">
              <span className="text-[11px] text-[#667085] uppercase font-bold block">
                Impacto no Estoque
              </span>
              <div className="flex justify-between text-xs">
                <span className="text-[#667085]">Estoque antes:</span>
                <span className="font-mono text-[#1F2933]">{estoqueAntes} {selectedInsumo.unidade}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#C94C4C] font-semibold">Quantidade retirada:</span>
                <span className="font-mono font-bold text-[#C94C4C]">-{quantidade} {selectedInsumo.unidade}</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-t border-[#D9E1E8] pt-1.5">
                <span className="text-[#123B5D]">Estoque resultante:</span>
                <span className="font-mono text-[#123B5D]">{estoqueDepois} {selectedInsumo.unidade}</span>
              </div>

              {estoqueDepois < selectedInsumo.quantidadeMinima && (
                <div className="mt-2 p-2 bg-amber-50 text-[#D98E04] rounded-md text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Atenção: Esta saída deixará o estoque abaixo do mínimo de segurança ({selectedInsumo.quantidadeMinima} un).</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/estoque')}
              className="px-4 py-2.5 bg-white border border-[#D9E1E8] text-[#667085] hover:text-[#1F2933] rounded-md text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={lotesDoInsumo.length === 0}
              className="px-5 py-2.5 bg-[#C94C4C] hover:bg-[#a83b3b] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Saída</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
