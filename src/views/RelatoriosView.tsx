import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Boxes,
  Cpu,
  Clock,
  History,
  Award,
  X,
  FileText
} from 'lucide-react';

export const RelatoriosView: React.FC = () => {
  const { insumos, lotes, equipamentos, prazos, movimentacoes, proficiencia } = useApp();
  const [periodo, setPeriodo] = useState('Últimos 30 dias');
  const [modalRelatorio, setModalRelatorio] = useState<{ titulo: string; tipo: string } | null>(null);

  const reportCards = [
    {
      titulo: 'Estoque Atual Completo',
      desc: 'Inventário discriminado com saldos, lotes, temperaturas e locais de acondicionamento.',
      registros: `${insumos.length} insumos cadastrados`,
      icon: Boxes,
      tipo: 'estoque'
    },
    {
      titulo: 'Insumos Próximos do Vencimento',
      desc: 'Relação FEFO de kits e soluções com validade crítica nos próximos 30/60 dias.',
      registros: `${lotes.filter((l) => l.diasParaVencer <= 60).length} lotes em atenção`,
      icon: Clock,
      tipo: 'vencimento'
    },
    {
      titulo: 'Movimentações e Cadeia de Custódia',
      desc: 'Extrato completo de entradas por fotografia/OCR, retiradas periciais e usuários.',
      registros: `${movimentacoes.length} movimentações no período`,
      icon: History,
      tipo: 'movimentacoes'
    },
    {
      titulo: 'Parque de Equipamentos & Metrologia',
      desc: 'Dossiê do estado de calibrações, manutenções e verificações intermediárias RBC.',
      registros: `${equipamentos.length} equipamentos ativos`,
      icon: Cpu,
      tipo: 'equipamentos'
    },
    {
      titulo: 'Prazos Vencidos & Obrigações Periódicas',
      desc: 'Relatório de conformidade temporal com semáforo de riscos e responsáveis.',
      registros: `${prazos.filter((p) => p.diasRestantes <= 7).length} itens prioritários`,
      icon: Calendar,
      tipo: 'prazos'
    },
    {
      titulo: 'Ensaios de Proficiência (RIF / EQA)',
      desc: 'Histórico de rodadas interlaboratoriais, remessas de amostras e notas técnicas.',
      registros: `${proficiencia.length} rodadas registradas`,
      icon: Award,
      tipo: 'proficiencia'
    }
  ];

  const handleExport = (formato: string) => {
    alert(`Exportando ${modalRelatorio?.titulo} no formato ${formato}. O arquivo foi gerado conforme os padrões da Polícia Científica de Goiás.`);
    setModalRelatorio(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Central de Relatórios Gerenciais
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Geração de relatórios consolidados para prestação de contas, auditorias de acreditação e gestão de suprimentos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#667085] font-medium">Período de Análise:</span>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-3 py-1.5 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-xs font-semibold text-[#1F2933]"
          >
            <option>Mês Atual (Outubro 2026)</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias (Trimestre)</option>
            <option>Ano Vigente (2026)</option>
          </select>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((rc, idx) => {
          const Icon = rc.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-[#123B5D] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#123B5D]/10 text-[#123B5D] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#2A6F97]" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#2E7D5B] bg-[#2E7D5B]/10 px-2 py-0.5 rounded-xs">
                    {rc.registros}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#1F2933] mb-1">
                  {rc.titulo}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {rc.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D9E1E8] flex items-center justify-between">
                <button
                  onClick={() => setModalRelatorio({ titulo: rc.titulo, tipo: rc.tipo })}
                  className="text-xs font-semibold text-[#2A6F97] hover:text-[#123B5D] hover:underline cursor-pointer"
                >
                  Visualizar Dados
                </button>

                <button
                  onClick={() => setModalRelatorio({ titulo: rc.titulo, tipo: rc.tipo })}
                  className="px-3 py-1.5 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Gerar Relatório</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview / Export */}
      {modalRelatorio && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E8] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wider">
                  {modalRelatorio.titulo}
                </h3>
                <p className="text-xs text-[#667085]">
                  Prévia consolidada para exportação institucional ({periodo})
                </p>
              </div>
              <button
                onClick={() => setModalRelatorio(null)}
                className="text-[#667085] hover:text-[#1F2933] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8] text-xs space-y-2 mb-4">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Unidade Emissora:</span>
                <span className="font-semibold text-[#1F2933]">Laboratório de Biologia e DNA Forense - SPTC/GO</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Responsável Técnico:</span>
                <span className="font-semibold text-[#1F2933]">Paulo Chaves (Perito Criminal Oficial)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#667085]">Chave de Integridade:</span>
                <span className="font-mono text-[10px] text-[#2A6F97]">SHA-256: 7f8a3d...e91b</span>
              </div>
            </div>

            <p className="text-xs text-[#667085] mb-5 leading-relaxed">
              Os dados foram consolidados diretamente das tabelas de auditoria, lotes ativos e calibrações vigentes do sistema ALELO.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#D9E1E8]">
              <button
                onClick={() => setModalRelatorio(null)}
                className="px-4 py-2 bg-white border border-[#D9E1E8] text-[#667085] text-xs font-semibold rounded-md"
              >
                Fechar
              </button>
              <button
                onClick={() => handleExport('CSV / Planilha')}
                className="px-4 py-2 bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Exportar CSV / Excel</span>
              </button>
              <button
                onClick={() => handleExport('PDF Institucional')}
                className="px-4 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Exportar PDF Formal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
