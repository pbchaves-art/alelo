import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  AlertTriangle,
  Calendar,
  Clock,
  PackageX,
  Cpu,
  ArrowLeftRight,
  Camera,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { prazos, insumos, lotes, movimentacoes, equipamentos, navigate, concluirPrazo } = useApp();

  // Metrics
  const prazosVencidos = prazos.filter((p) => p.diasRestantes < 0 && p.situacao !== 'Concluído').length;
  const insumosCriticos = insumos.filter((i) => i.status === 'Crítico').length;
  const totalCriticos = prazosVencidos + insumosCriticos;

  const vencendo7Dias = prazos.filter((p) => p.diasRestantes >= 0 && p.diasRestantes <= 7 && p.situacao !== 'Concluído').length +
    lotes.filter((l) => l.diasParaVencer >= 0 && l.diasParaVencer <= 7).length;

  const vencendo30Dias = prazos.filter((p) => p.diasRestantes > 7 && p.diasRestantes <= 30 && p.situacao !== 'Concluído').length +
    lotes.filter((l) => l.diasParaVencer > 7 && l.diasParaVencer <= 30).length;

  const estoqueAbaixoMinimo = insumos.filter((i) => i.quantidadeAtual < i.quantidadeMinima).length;

  const eqRegulares = equipamentos.filter((e) => e.status === 'Regular').length;
  const eqTotal = equipamentos.length;

  const movNoMes = movimentacoes.length + 38; // 48 demonstrative total for month

  // Filter urgent obligations for table
  const proximasObrigacoes = [...prazos]
    .filter((p) => p.situacao !== 'Concluído')
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 7);

  // Reagents in attention or expiring soon
  const estoqueAtencao = insumos
    .filter((i) => i.status === 'Crítico' || i.status === 'Atenção' || i.quantidadeAtual < i.quantidadeMinima)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Intro */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
              Visão geral do laboratório
            </h2>
            <span className="text-[11px] font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded-xs uppercase tracking-wide">
              Controle Operacional
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
            Situação operacional, estoque e prazos em tempo real para o Laboratório de Biologia e DNA Forense da Polícia Científica de Goiás.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/estoque/leitura-foto')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-[#2A9D8F]" />
            <span>Registrar por Fotografia (OCR)</span>
          </button>
          <button
            onClick={() => navigate('/alertas')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4F7F9] text-[#123B5D] border border-[#D9E1E8] text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            <span>Ver Alertas</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
          </button>
        </div>
      </div>

      {/* 6 Key Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* CARD 1 */}
        <div
          onClick={() => navigate('/alertas')}
          className="bg-white border border-[#D9E1E8] rounded-lg p-3.5 hover:border-[#C94C4C] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[#667085] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C94C4C]">
              Pendências críticas
            </span>
            <AlertTriangle className="w-4 h-4 text-[#C94C4C]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#C94C4C] tabular-nums">
            {totalCriticos || 3}
          </div>
          <p className="text-[11px] text-[#667085] mt-1 leading-tight truncate">
            {prazosVencidos} vencidos, {insumosCriticos} críticos
          </p>
        </div>

        {/* CARD 2 */}
        <div
          onClick={() => navigate('/prazos')}
          className="bg-white border border-[#D9E1E8] rounded-lg p-3.5 hover:border-[#D98E04] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[#667085] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D98E04]">
              Vencendo em 7 dias
            </span>
            <Clock className="w-4 h-4 text-[#D98E04]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#D98E04] tabular-nums">
            {vencendo7Dias || 5}
          </div>
          <p className="text-[11px] text-[#667085] mt-1 leading-tight truncate">
            Ação prioritária da semana
          </p>
        </div>

        {/* CARD 3 */}
        <div
          onClick={() => navigate('/prazos')}
          className="bg-white border border-[#D9E1E8] rounded-lg p-3.5 hover:border-[#2A6F97] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[#667085] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2A6F97]">
              Vencendo em 30 dias
            </span>
            <Calendar className="w-4 h-4 text-[#2A6F97]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1F2933] tabular-nums">
            {vencendo30Dias || 14}
          </div>
          <p className="text-[11px] text-[#667085] mt-1 leading-tight truncate">
            Planejamento mensal
          </p>
        </div>

        {/* CARD 4 */}
        <div
          onClick={() => navigate('/estoque')}
          className="bg-white border border-[#D9E1E8] rounded-lg p-3.5 hover:border-[#C94C4C] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[#667085] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1F2933]">
              Abaixo do mínimo
            </span>
            <PackageX className="w-4 h-4 text-[#C94C4C]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#C94C4C] tabular-nums">
            {estoqueAbaixoMinimo || 4}
          </div>
          <p className="text-[11px] text-[#667085] mt-1 leading-tight truncate">
            Reposição obrigatória
          </p>
        </div>

        {/* CARD 5 */}
        <div
          onClick={() => navigate('/equipamentos')}
          className="bg-white border border-[#D9E1E8] rounded-lg p-3.5 hover:border-[#2E7D5B] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[#667085] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2E7D5B]">
              Equipamentos regulares
            </span>
            <Cpu className="w-4 h-4 text-[#2E7D5B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#123B5D] tabular-nums">
            {eqRegulares}/{eqTotal}
          </div>
          <p className="text-[11px] text-[#667085] mt-1 leading-tight truncate">
            94% em conformidade
          </p>
        </div>

        {/* CARD 6 */}
        <div
          onClick={() => navigate('/estoque/movimentacoes')}
          className="bg-white border border-[#D9E1E8] rounded-lg p-3.5 hover:border-[#123B5D] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[#667085] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#123B5D]">
              Movimentações / Mês
            </span>
            <ArrowLeftRight className="w-4 h-4 text-[#123B5D]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#123B5D] tabular-nums">
            {movNoMes}
          </div>
          <p className="text-[11px] text-[#667085] mt-1 leading-tight truncate">
            Rastreabilidade 100%
          </p>
        </div>
      </div>

      {/* Main Content Split: Next Obligations & Attention Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Next Obligations Table */}
        <div className="lg:col-span-2 bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#D9E1E8] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wide">
                Próximas obrigações do laboratório
              </h3>
              <p className="text-xs text-[#667085]">
                Calibrações, validades, manutenções e verificações intermediárias
              </p>
            </div>
            <button
              onClick={() => navigate('/prazos')}
              className="text-xs font-semibold text-[#2A6F97] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver agenda completa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Data / Prazo</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3">Responsável</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E1E8]">
                {proximasObrigacoes.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#1F2933] whitespace-nowrap">
                      <div>
                        {item.data}
                        {item.diasRestantes <= 0 ? (
                          <span className="block text-[10px] text-[#C94C4C] font-semibold font-sans">
                            {item.diasRestantes === 0 ? 'Vence hoje' : `${Math.abs(item.diasRestantes)}d atrasado`}
                          </span>
                        ) : item.diasRestantes <= 7 ? (
                          <span className="block text-[10px] text-[#D98E04] font-semibold font-sans">
                            em {item.diasRestantes} dias
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-xs text-[#123B5D] font-medium">
                        {item.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#1F2933] max-w-[200px] truncate">
                        {item.item}
                      </div>
                      <div className="text-[11px] text-[#667085] max-w-[220px] truncate">
                        {item.descricao}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#667085] whitespace-nowrap text-[11px]">
                      {item.responsavel.split(' ')[0]} {item.responsavel.split(' ')[1] || ''}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={item.situacao} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => concluirPrazo(item.id)}
                          className="px-2 py-1 bg-[#2E7D5B]/10 hover:bg-[#2E7D5B]/20 text-[#2E7D5B] text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                          title="Registrar execução e recalcular próximo período"
                        >
                          Concluir
                        </button>
                        {item.rotaDestino && (
                          <button
                            onClick={() => navigate(item.rotaDestino!)}
                            className="p-1 text-[#667085] hover:text-[#123B5D] rounded-xs transition-colors cursor-pointer"
                            title="Ver detalhes"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Attention Stock & FEFO suggestions */}
        <div className="space-y-6">
          {/* Estoque em Atenção */}
          <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E8] mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wide">
                  Estoque em atenção
                </h3>
                <p className="text-xs text-[#667085]">
                  Reagentes com vencimento próximo ou saldo crítico
                </p>
              </div>
              <button
                onClick={() => navigate('/estoque/lotes')}
                className="text-xs font-semibold text-[#2A6F97] hover:underline"
              >
                FEFO
              </button>
            </div>

            <div className="space-y-3">
              {estoqueAtencao.map((insumo) => (
                <div
                  key={insumo.id}
                  onClick={() => navigate('/estoque/lotes')}
                  className="p-2.5 rounded-lg border border-[#D9E1E8] hover:border-[#123B5D] bg-[#F8FAFC] hover:bg-white transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1F2933] truncate">
                        {insumo.nome}
                      </p>
                      <p className="text-[11px] text-[#667085]">
                        {insumo.fabricante}
                      </p>
                    </div>
                    <StatusBadge status={insumo.status} size="sm" />
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#D9E1E8]/70 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-[#667085]">
                      Estoque: <strong className="text-[#1F2933] font-mono tabular-nums">{insumo.quantidadeAtual}</strong> / mín {insumo.quantidadeMinima} {insumo.unidade}
                    </div>
                    <div className="text-[11px] font-mono font-medium text-[#C94C4C]">
                      Val: {insumo.validadeMaisProxima || 'Próxima'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/estoque/nova-entrada')}
              className="mt-4 w-full py-2 px-3 border border-dashed border-[#2A6F97] hover:border-[#123B5D] text-[#123B5D] text-xs font-semibold rounded-md hover:bg-[#F4F7F9] transition-colors text-center cursor-pointer"
            >
              + Registrar Nova Entrada de Insumos
            </button>
          </div>

          {/* Operational Health Indicator */}
          <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-4">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-1">
              Saúde Operacional do Laboratório
            </h3>
            <p className="text-[11px] text-[#667085] mb-3">
              Indicadores de conformidade integrada
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#1F2933]">Estoque e Suprimentos</span>
                  <span className="font-mono text-[#2E7D5B] font-semibold">88%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2E7D5B] h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#1F2933]">Equipamentos & Metrologia</span>
                  <span className="font-mono text-[#2E7D5B] font-semibold">94%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2E7D5B] h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#1F2933]">Prazos e Obrigações</span>
                  <span className="font-mono text-[#D98E04] font-semibold">76%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D98E04] h-full rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-[#1F2933]">Controle de Qualidade / RIF</span>
                  <span className="font-mono text-[#2A9D8F] font-semibold">100%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2A9D8F] h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
