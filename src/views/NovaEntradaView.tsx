import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlusCircle, Camera, Check, ArrowLeft, PackageCheck } from 'lucide-react';

export const NovaEntradaView: React.FC = () => {
  const { insumos, confirmarEntradaEstoque, navigate } = useApp();

  const [insumoId, setInsumoId] = useState(insumos[0]?.id || '');
  const [numeroLote, setNumeroLote] = useState('');
  const [validade, setValidade] = useState('2027-10-30');
  const [quantidade, setQuantidade] = useState<number>(5);
  const [fornecedor, setFornecedor] = useState('Promega Corporation');
  const [observacoes, setObservacoes] = useState('');

  const selectedInsumo = insumos.find((i) => i.id === insumoId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroLote.trim()) {
      alert('Informe o número do lote.');
      return;
    }

    confirmarEntradaEstoque({
      insumoId,
      numeroLote: numeroLote.trim().toUpperCase(),
      validade,
      quantidade,
      fornecedor,
      origem: 'Manual',
      observacoes: observacoes || 'Entrada manual registrada no almoxarifado do laboratório.'
    });

    navigate('/estoque/movimentacoes');
  };

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

        <button
          onClick={() => navigate('/estoque/leitura-foto')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#123B5D] border border-[#2A9D8F]/30 text-xs font-semibold rounded-md transition-colors cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-[#2A9D8F]" />
          <span>Prefere agilidade? Usar Fotografia (OCR)</span>
        </button>
      </div>

      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-6 md:p-8">
        <div className="mb-6 pb-4 border-b border-[#D9E1E8]">
          <h2 className="text-lg font-bold text-[#123B5D]">
            Registrar Entrada de Insumo no Estoque
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Preencha os dados do lote físico recebido para inclusão imediata na cadeia de custódia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
              Selecione o Insumo ou Kit *
            </label>
            <select
              value={insumoId}
              onChange={(e) => {
                setInsumoId(e.target.value);
                const item = insumos.find((i) => i.id === e.target.value);
                if (item) setFornecedor(item.fabricante);
              }}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs text-[#1F2933] font-medium focus:bg-white focus:border-[#123B5D]"
            >
              {insumos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.codigo} — {item.nome} (Atual: {item.quantidadeAtual} {item.unidade})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
                Número do Lote *
              </label>
              <input
                type="text"
                required
                value={numeroLote}
                onChange={(e) => setNumeroLote(e.target.value)}
                placeholder="Ex: FUS-2026-099"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs font-mono font-bold text-[#1F2933] focus:bg-white focus:border-[#123B5D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
                Data de Validade (Expiração) *
              </label>
              <input
                type="date"
                required
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs font-mono text-[#1F2933] focus:bg-white focus:border-[#123B5D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
                Quantidade Recebida *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
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
                Fabricante / Fornecedor Contratual
              </label>
              <input
                type="text"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs text-[#1F2933] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase tracking-wide mb-1.5">
              Observações / Nota de Empenho ou Lote
            </label>
            <textarea
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Recebimento referente ao Pregão Eletrônico SPTC 04/2026. Embalagem íntegra, indicador de temperatura preservado."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs text-[#1F2933] focus:bg-white"
            />
          </div>

          {/* Balance Preview */}
          {selectedInsumo && (
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#667085] uppercase font-bold block">
                  Simulação de Saldo
                </span>
                <span className="text-xs text-[#1F2933]">
                  {selectedInsumo.nome}
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-[#667085]">
                  {selectedInsumo.quantidadeAtual} + {quantidade} ={' '}
                </span>
                <strong className="text-sm text-[#2E7D5B]">
                  {selectedInsumo.quantidadeAtual + quantidade} {selectedInsumo.unidade}
                </strong>
              </div>
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
              className="px-5 py-2.5 bg-[#123B5D] hover:bg-[#0e2f4a] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar Entrada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
