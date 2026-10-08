import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  Filter,
  PlusCircle,
  MinusCircle,
  Camera,
  Layers,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';

export const EstoqueView: React.FC = () => {
  const { insumos, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredInsumos = insumos.filter((item) => {
    const matchesSearch =
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.loteMaisProximoValidade &&
        item.loteMaisProximoValidade.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategoria =
      categoriaFilter === 'Todas' || item.categoria === categoriaFilter;

    const matchesStatus =
      statusFilter === 'Todos' || item.status === statusFilter;

    return matchesSearch && matchesCategoria && matchesStatus;
  });

  const categorias = [
    'Todas',
    'Kits de Amplificação (STR)',
    'Kits de Quantificação',
    'Kits de Extração',
    'Polímeros e Eletroforese',
    'Consumíveis Plásticos',
    'Reagentes e Soluções',
    'Controles e Padrões'
  ];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Estoque de insumos e reagentes
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Gestão integrada de kits, consumíveis e soluções do Laboratório de Biologia e DNA Forense.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/estoque/leitura-foto')}
            className="flex items-center gap-2 px-3 py-2 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#123B5D] border border-[#2A9D8F]/40 text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#2A9D8F]" />
            <span>Leitura por Foto (OCR)</span>
          </button>

          <button
            onClick={() => navigate('/estoque/nova-entrada')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Entrada</span>
          </button>

          <button
            onClick={() => navigate('/estoque/nova-saida')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4F7F9] text-[#123B5D] border border-[#D9E1E8] text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <MinusCircle className="w-4 h-4 text-[#C94C4C]" />
            <span>Registrar Saída</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por produto, fabricante, lote ou código..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md focus:bg-white focus:border-[#123B5D] text-[#1F2933] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] focus:bg-white focus:border-[#123B5D]"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Todas' ? 'Todas as Categorias' : cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] focus:bg-white focus:border-[#123B5D]"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Normal">Normal</option>
            <option value="Atenção">Atenção</option>
            <option value="Crítico">Crítico</option>
          </select>

          <button
            onClick={() => navigate('/estoque/lotes')}
            className="px-3 py-2 bg-white border border-[#D9E1E8] text-[#2A6F97] hover:text-[#123B5D] text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            title="Visualização FEFO dos lotes"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ver Lotes (FEFO)</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Código / Produto</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Fabricante</th>
                <th className="py-3 px-3">Lote Ativo (FEFO)</th>
                <th className="py-3 px-3">Validade</th>
                <th className="py-3 px-3">Estoque</th>
                <th className="py-3 px-3">Localização</th>
                <th className="py-3 px-3">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {filteredInsumos.map((item) => {
                const isAbaixoMin = item.quantidadeAtual < item.quantidadeMinima;
                return (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[10px] text-[#667085] font-semibold">
                        {item.codigo}
                      </div>
                      <div className="font-semibold text-[#1F2933] text-xs">
                        {item.nome}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#667085] text-[11px] whitespace-nowrap">
                      {item.categoria}
                    </td>
                    <td className="py-3 px-3 text-[#1F2933] text-[11px] whitespace-nowrap">
                      {item.fabricante}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-[#123B5D] text-xs whitespace-nowrap">
                      {item.loteMaisProximoValidade || '—'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                      {item.validadeMaisProxima ? (
                        <div>
                          <span>{item.validadeMaisProxima}</span>
                          {item.diasParaVencer !== undefined && item.diasParaVencer <= 30 && (
                            <span
                              className={`block text-[10px] font-semibold ${
                                item.diasParaVencer <= 7
                                  ? 'text-[#C94C4C]'
                                  : 'text-[#D98E04]'
                              }`}
                            >
                              {item.diasParaVencer <= 0
                                ? 'Vencido'
                                : `em ${item.diasParaVencer}d`}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#667085]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span
                          className={`text-xs font-bold ${
                            isAbaixoMin ? 'text-[#C94C4C]' : 'text-[#1F2933]'
                          }`}
                        >
                          {item.quantidadeAtual}
                        </span>
                        <span className="text-[10px] text-[#667085]">
                          / mín {item.quantidadeMinima} {item.unidade}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#667085] text-[11px]">
                      {item.localizacaoPadrao}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/estoque/nova-saida')}
                          className="px-2 py-1 bg-white hover:bg-rose-50 text-[#C94C4C] border border-[#D9E1E8] text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                          title="Retirar insumo"
                        >
                          Retirar
                        </button>
                        <button
                          onClick={() => navigate('/estoque/lotes')}
                          className="px-2 py-1 bg-[#123B5D]/10 hover:bg-[#123B5D]/20 text-[#123B5D] text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                          title="Ver lotes e FEFO"
                        >
                          Lotes
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#F8FAFC] border-t border-[#D9E1E8] flex items-center justify-between text-xs text-[#667085]">
          <span>
            Exibindo <strong>{filteredInsumos.length}</strong> de {insumos.length} itens cadastrados
          </span>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Ordenação FEFO ativa</span>
            <span className="text-[#D9E1E8]">|</span>
            <span>Controle metrológico de lote em vigor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
