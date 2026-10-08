import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Check,
  Calendar as CalendarIcon,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TipoPrazo } from '../types';

export const PrazosView: React.FC = () => {
  const { prazos, concluirPrazo, navigate } = useApp();
  const [tipoFilter, setTipoFilter] = useState<string>('Todos');
  const [faixaFilter, setFaixaFilter] = useState<'Todas' | 'Critico' | 'Atencao' | 'Normal'>('Todas');

  const filteredPrazos = prazos.filter((p) => {
    const matchesTipo = tipoFilter === 'Todos' || p.tipo === tipoFilter;
    let matchesFaixa = true;

    if (faixaFilter === 'Critico') {
      matchesFaixa = p.diasRestantes <= 7;
    } else if (faixaFilter === 'Atencao') {
      matchesFaixa = p.diasRestantes > 7 && p.diasRestantes <= 30;
    } else if (faixaFilter === 'Normal') {
      matchesFaixa = p.diasRestantes > 30;
    }

    return matchesTipo && matchesFaixa;
  });

  const tipos: ('Todos' | TipoPrazo)[] = [
    'Todos',
    'Validade',
    'Calibração',
    'Manutenção',
    'Verificação intermediária',
    'Ensaio de proficiência',
    'Revisão documental',
    'Treinamento'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
              Controle Integrado de Prazos e Obrigações
            </h2>
            <span className="text-[11px] font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded-xs uppercase tracking-wide">
              Regras Semafóricas Automáticas
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
            Monitoramento centralizado de calibrações, validades de reagentes, manutenções preventivas e ensaios de proficiência com recálculo automático de ciclos metrológicos.
          </p>
        </div>
      </div>

      {/* Traffic Light Classification Rules Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          onClick={() => setFaixaFilter(faixaFilter === 'Critico' ? 'Todas' : 'Critico')}
          className={`p-3.5 bg-white border rounded-xl shadow-xs cursor-pointer transition-all ${
            faixaFilter === 'Critico' ? 'border-[#C94C4C] ring-2 ring-[#C94C4C]/20' : 'border-[#D9E1E8] hover:border-[#C94C4C]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#C94C4C] uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C94C4C]" />
              Vermelho: Crítico / Urgente
            </span>
            <span className="font-mono text-xs font-bold text-[#C94C4C]">
              {prazos.filter((p) => p.diasRestantes <= 7).length} itens
            </span>
          </div>
          <p className="text-[11px] text-[#667085]">
            Vencidos ou com vencimento em até <strong>7 dias</strong>. Exige ação imediata do responsável técnico.
          </p>
        </div>

        <div
          onClick={() => setFaixaFilter(faixaFilter === 'Atencao' ? 'Todas' : 'Atencao')}
          className={`p-3.5 bg-white border rounded-xl shadow-xs cursor-pointer transition-all ${
            faixaFilter === 'Atencao' ? 'border-[#D98E04] ring-2 ring-[#D98E04]/20' : 'border-[#D9E1E8] hover:border-[#D98E04]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#D98E04] uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D98E04]" />
              Amarelo: Atenção
            </span>
            <span className="font-mono text-xs font-bold text-[#D98E04]">
              {prazos.filter((p) => p.diasRestantes > 7 && p.diasRestantes <= 30).length} itens
            </span>
          </div>
          <p className="text-[11px] text-[#667085]">
            Vencimento entre <strong>8 a 30 dias</strong>. Programação de compras, ensaios ou visitas técnicas.
          </p>
        </div>

        <div
          onClick={() => setFaixaFilter(faixaFilter === 'Normal' ? 'Todas' : 'Normal')}
          className={`p-3.5 bg-white border rounded-xl shadow-xs cursor-pointer transition-all ${
            faixaFilter === 'Normal' ? 'border-[#2E7D5B] ring-2 ring-[#2E7D5B]/20' : 'border-[#D9E1E8] hover:border-[#2E7D5B]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#2E7D5B] uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" />
              Verde: Dentro do Prazo
            </span>
            <span className="font-mono text-xs font-bold text-[#2E7D5B]">
              {prazos.filter((p) => p.diasRestantes > 30).length} itens
            </span>
          </div>
          <p className="text-[11px] text-[#667085]">
            Mais de <strong>30 dias</strong> de vigência. Operação laboratorial regular em conformidade.
          </p>
        </div>
      </div>

      {/* Filter Tabs by Tipo */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mr-2">
          Filtrar por Categoria:
        </span>
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setTipoFilter(tipo)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tipoFilter === tipo
                ? 'bg-[#123B5D] text-white font-bold shadow-xs'
                : 'bg-[#F8FAFC] text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Prazos Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Prazo / Vencimento</th>
                <th className="py-3 px-3">Tipo de Obrigação</th>
                <th className="py-3 px-3">Item / Ativo Relacionado</th>
                <th className="py-3 px-3">Descrição Detalhada</th>
                <th className="py-3 px-3">Responsável</th>
                <th className="py-3 px-3">Periodicidade</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {filteredPrazos.map((item) => {
                const isOverdue = item.diasRestantes < 0;
                const isCritical = item.diasRestantes >= 0 && item.diasRestantes <= 7;
                const isWarning = item.diasRestantes > 7 && item.diasRestantes <= 30;

                return (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div className="font-bold text-[#1F2933]">{item.data}</div>
                      {item.situacao === 'Concluído' ? (
                        <span className="text-[10px] text-[#2E7D5B] font-sans font-semibold">
                          Concluído ({item.concluidoEm})
                        </span>
                      ) : isOverdue ? (
                        <span className="text-[10px] text-[#C94C4C] font-sans font-bold">
                          {Math.abs(item.diasRestantes)} dias atrasado
                        </span>
                      ) : isCritical ? (
                        <span className="text-[10px] text-[#C94C4C] font-sans font-semibold">
                          Vence em {item.diasRestantes} dias
                        </span>
                      ) : isWarning ? (
                        <span className="text-[10px] text-[#D98E04] font-sans font-semibold">
                          Vence em {item.diasRestantes} dias
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#2E7D5B] font-sans">
                          {item.diasRestantes} dias restantes
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#123B5D] whitespace-nowrap">
                      {item.tipo}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1F2933]">
                      {item.item}
                    </td>
                    <td className="py-3 px-3 text-[#667085] max-w-[280px]">
                      {item.descricao}
                    </td>
                    <td className="py-3 px-3 text-[#1F2933] whitespace-nowrap text-[11px]">
                      {item.responsavel}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#667085] text-[11px] whitespace-nowrap">
                      {item.periodicidadeMeses ? `${item.periodicidadeMeses} meses` : 'Sob demanda'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={item.situacao} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {item.situacao !== 'Concluído' ? (
                        <button
                          onClick={() => concluirPrazo(item.id)}
                          className="px-3 py-1.5 bg-[#2E7D5B] hover:bg-[#25664a] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors shadow-2xs flex items-center gap-1.5 ml-auto cursor-pointer"
                          title="Registra a execução e gera o próximo ciclo automaticamente"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Concluir</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#2E7D5B] font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registrado</span>
                        </span>
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
