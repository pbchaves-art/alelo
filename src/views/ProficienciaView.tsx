import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Award, ShieldCheck, FileCheck, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export const ProficienciaView: React.FC = () => {
  const { proficiencia, navigate } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
              Ensaios de Proficiência Interlaboratorial
            </h2>
            <span className="text-[11px] font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded-xs uppercase tracking-wide">
              RIF / SENASP & GEDNAP
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
            Acompanhamento das rodadas de avaliação externa da qualidade (EQA) e acreditação analítica conforme as diretrizes do Banco Nacional de Perfis Genéticos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3 py-1.5 bg-[#2E7D5B]/10 text-[#2E7D5B] rounded-md border border-[#2E7D5B]/20">
            100% de Concordância nos Ciclos Finalizados
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Código / Identificação</th>
                <th className="py-3 px-3">Ensaio de Proficiência</th>
                <th className="py-3 px-3">Organização Provedora</th>
                <th className="py-3 px-3">Data Recebimento</th>
                <th className="py-3 px-3">Prazo Final</th>
                <th className="py-3 px-3">Perito Responsável</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Laudo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {proficiencia.map((ep) => (
                <tr key={ep.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-[#123B5D]">
                    {ep.codigo}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#1F2933]">
                    <div>{ep.ensaio}</div>
                    <div className="text-[10px] text-[#667085] font-normal">{ep.identificacao}</div>
                  </td>
                  <td className="py-3 px-3 text-[#667085] text-[11px]">
                    {ep.organizacao}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#667085] text-[11px] whitespace-nowrap">
                    {ep.dataRecebimento}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#1F2933] text-[11px] whitespace-nowrap">
                    {ep.prazo}
                  </td>
                  <td className="py-3 px-3 text-[#1F2933] text-[11px] whitespace-nowrap">
                    {ep.responsavel}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={ep.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => alert(`Amostras do Ensaio ${ep.codigo} em conformidade com o POP-QUAL-08.`)}
                      className="px-2.5 py-1 bg-[#123B5D]/10 hover:bg-[#123B5D]/20 text-[#123B5D] text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      Dossiê
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
