import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ExternalLink,
  Check,
  ShieldCheck
} from 'lucide-react';

export const AlertasView: React.FC = () => {
  const { alertas, resolverAlerta, navigate } = useApp();
  const [tab, setTab] = useState<'Todos' | 'Crítico' | 'Atenção' | 'Informativo'>('Todos');

  const filtered = alertas.filter((a) => {
    if (tab === 'Todos') return true;
    return a.gravidade === tab;
  });

  const criticosPendentes = alertas.filter((a) => !a.resolvido && a.gravidade === 'Crítico').length;
  const atencaoPendentes = alertas.filter((a) => !a.resolvido && a.gravidade === 'Atenção').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Central Integrada de Alertas Laboratoriais
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Notificações em tempo real sobre desvios de estoque, prazos críticos, manutenções e calibrações.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {criticosPendentes > 0 && (
            <span className="px-3 py-1 bg-[#C94C4C]/10 text-[#C94C4C] text-xs font-bold rounded-md border border-[#C94C4C]/20">
              {criticosPendentes} Críticos
            </span>
          )}
          {atencaoPendentes > 0 && (
            <span className="px-3 py-1 bg-[#D98E04]/10 text-[#D98E04] text-xs font-bold rounded-md border border-[#D98E04]/20">
              {atencaoPendentes} em Atenção
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-1 border border-[#D9E1E8] rounded-lg w-fit">
        {(['Todos', 'Crítico', 'Atenção', 'Informativo'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === t
                ? 'bg-white text-[#123B5D] font-bold shadow-xs'
                : 'text-[#667085] hover:text-[#1F2933]'
            }`}
          >
            {t} ({alertas.filter((a) => t === 'Todos' || a.gravidade === t).length})
          </button>
        ))}
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filtered.map((alerta) => {
          const isCritico = alerta.gravidade === 'Crítico';
          const isAtencao = alerta.gravidade === 'Atenção';

          return (
            <div
              key={alerta.id}
              className={`p-4 rounded-xl border bg-white shadow-xs transition-all ${
                alerta.resolvido
                  ? 'opacity-60 border-[#D9E1E8] bg-slate-50'
                  : isCritico
                  ? 'border-l-4 border-l-[#C94C4C] border-[#D9E1E8]'
                  : isAtencao
                  ? 'border-l-4 border-l-[#D98E04] border-[#D9E1E8]'
                  : 'border-l-4 border-l-[#3B82A0] border-[#D9E1E8]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {isCritico ? (
                      <AlertTriangle className="w-5 h-5 text-[#C94C4C]" />
                    ) : isAtencao ? (
                      <AlertCircle className="w-5 h-5 text-[#D98E04]" />
                    ) : (
                      <Info className="w-5 h-5 text-[#3B82A0]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1F2933]">
                        {alerta.item}
                      </span>
                      <StatusBadge status={alerta.gravidade} size="sm" />
                      <span className="text-[10px] text-[#667085] font-mono">
                        · {alerta.data}
                      </span>
                    </div>

                    <p className="text-xs text-[#1F2933] font-medium leading-relaxed">
                      {alerta.motivo}
                    </p>

                    <div className="text-xs text-[#2A6F97] bg-[#F8FAFC] p-2.5 rounded-md border border-[#D9E1E8] mt-2">
                      <strong className="block text-[10px] text-[#123B5D] uppercase tracking-wide">
                        Ação Recomendada pela Qualidade:
                      </strong>
                      <span>{alerta.acaoRecomendada}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#667085] pt-1">
                      <span>Responsável: <strong>{alerta.responsavel}</strong></span>
                      <span>·</span>
                      <span>Categoria: {alerta.categoria}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <button
                    onClick={() => navigate(alerta.rotaAcao)}
                    className="px-3 py-1.5 bg-[#123B5D]/10 hover:bg-[#123B5D]/20 text-[#123B5D] text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver no Sistema</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {!alerta.resolvido ? (
                    <button
                      onClick={() => resolverAlerta(alerta.id)}
                      className="px-3 py-1.5 bg-[#2E7D5B] hover:bg-[#25664a] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marcar como Resolvido</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[#2E7D5B] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolvido</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
