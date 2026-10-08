import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Search, ShieldCheck, ArrowRight, Filter, Download } from 'lucide-react';

export const AuditoriaView: React.FC = () => {
  const { auditoria } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = auditoria.filter((a) => {
    return (
      a.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.origem.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
              Trilha de Auditoria & Rastreabilidade Forense
            </h2>
            <span className="text-[11px] font-semibold text-[#2E7D5B] bg-[#2E7D5B]/10 px-2 py-0.5 rounded-xs uppercase tracking-wide">
              Log Imutável
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
            Registro cronológico detalhado de todas as operações, alterações cadastrais, entradas fotográficas e baixas executadas no sistema.
          </p>
        </div>

        <button
          onClick={() => alert('Log de auditoria exportado com hash SHA-256 para arquivamento pericial.')}
          className="px-3.5 py-2 bg-white hover:bg-[#F4F7F9] text-[#123B5D] border border-[#D9E1E8] text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-[#2A6F97]" />
          <span>Exportar Trilha de Auditoria</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-4 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuário, ação, objeto pericial ou origem..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md focus:bg-white text-[#1F2933]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-3">Usuário Responsável</th>
                <th className="py-3 px-3">Ação Executada</th>
                <th className="py-3 px-3">Objeto Pericial</th>
                <th className="py-3 px-3">Valor Anterior</th>
                <th className="py-3 px-3">Novo Valor</th>
                <th className="py-3 px-4">Origem do Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#1F2933] whitespace-nowrap">
                    {item.dataHora}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#1F2933] whitespace-nowrap">
                    {item.usuario}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#123B5D]">
                    {item.acao}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#1F2933]">
                    {item.objeto}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#667085] whitespace-nowrap">
                    {item.valorAnterior}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-[#2E7D5B] whitespace-nowrap">
                    {item.novoValor}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#2A6F97] whitespace-nowrap">
                    {item.origem}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#F8FAFC] border-t border-[#D9E1E8] text-xs text-[#667085] flex items-center justify-between">
          <span>{filtered.length} eventos registrados na trilha de auditoria</span>
          <span className="font-mono text-[10px] text-[#2A9D8F]">
            Conformidade ISO/IEC 17025 e Diretrizes RIF/SENASP
          </span>
        </div>
      </div>
    </div>
  );
};
