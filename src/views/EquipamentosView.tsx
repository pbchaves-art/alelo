import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Cpu,
  Search,
  ExternalLink,
  ShieldCheck,
  CalendarClock,
  Clock,
  Filter,
  AlertTriangle
} from 'lucide-react';

export const EquipamentosView: React.FC = () => {
  const { equipamentos, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = equipamentos.filter((eq) => {
    const matchesSearch =
      eq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.localizacao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'Todos' || eq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Controle Metrológico e Parque de Equipamentos
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Gestão de calibrações, manutenções preventivas e verificações intermediárias do Laboratório de Biologia e DNA Forense.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3 py-1.5 bg-[#2E7D5B]/10 text-[#2E7D5B] rounded-md border border-[#2E7D5B]/20">
            {equipamentos.filter((e) => e.status === 'Regular').length} / {equipamentos.length} Regulares
          </div>
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
            placeholder="Buscar por equipamento, patrimônio, modelo ou localização..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md focus:bg-white text-[#1F2933]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933] focus:bg-white"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Regular">Regular</option>
            <option value="Atenção">Atenção</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>
      </div>

      {/* Equipments Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Código / Patrimônio</th>
                <th className="py-3 px-3">Equipamento</th>
                <th className="py-3 px-3">Fabricante / Modelo</th>
                <th className="py-3 px-3">Localização</th>
                <th className="py-3 px-3">Última Calibração</th>
                <th className="py-3 px-3">Próxima Calibração</th>
                <th className="py-3 px-3">Próxima Manutenção</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Dossiê</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-[#123B5D]">
                      {item.codigo}
                    </div>
                    <div className="font-mono text-[10px] text-[#667085]">
                      {item.patrimonio}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#1F2933]">
                    {item.nome}
                  </td>
                  <td className="py-3 px-3 text-[#667085] text-[11px] whitespace-nowrap">
                    <div>{item.fabricante}</div>
                    <div className="font-mono text-[10px]">{item.modelo}</div>
                  </td>
                  <td className="py-3 px-3 text-[#667085] text-[11px]">
                    {item.localizacao}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#667085] text-[11px] whitespace-nowrap">
                    {item.ultimaCalibracao}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    <span className="font-semibold text-[#1F2933]">{item.proximaCalibracao}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    {item.proximaManutencao}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/equipamentos/${item.id}`)}
                      className="px-2.5 py-1 bg-[#123B5D]/10 hover:bg-[#123B5D]/20 text-[#123B5D] text-[11px] font-semibold rounded-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>Detalhes</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
