import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ArrowLeft,
  Cpu,
  ShieldCheck,
  CalendarClock,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  PlusCircle,
  X,
  Check
} from 'lucide-react';

export const EquipamentoDetailView: React.FC = () => {
  const { equipamentos, routeParam, navigate, adicionarVerificacaoEquipamento } = useApp();
  const [modalNovaVerificacao, setModalNovaVerificacao] = useState(false);

  // New check state
  const [tipoVerif, setTipoVerif] = useState('Verificação Gravimétrica Volumétrica');
  const [resultadoVerif, setResultadoVerif] = useState<'Conforme' | 'Não Conforme'>('Conforme');
  const [desvio, setDesvio] = useState('Erro percentual: 0.08% dentro dos limites do POP');

  const equipamento = equipamentos.find((e) => e.id === routeParam) || equipamentos[0];

  if (!equipamento) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#D9E1E8]">
        <p className="text-sm text-[#667085]">Equipamento não localizado.</p>
        <button
          onClick={() => navigate('/equipamentos')}
          className="mt-3 px-3 py-1.5 bg-[#123B5D] text-white text-xs rounded-md"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  const handleSalvarVerificacao = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarVerificacaoEquipamento(equipamento.id, {
      data: '2026-10-08',
      tipo: tipoVerif,
      responsavel: 'Paulo Chaves (Responsável Técnico)',
      resultado: resultadoVerif,
      desvioObservado: desvio,
      proximaData: '2027-01-08'
    });
    setModalNovaVerificacao(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/equipamentos')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#2A6F97] hover:text-[#123B5D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Equipamentos</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={equipamento.status} size="md" />
        </div>
      </div>

      {/* Equipment Header Hero */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-[#123B5D] text-white px-2 py-0.5 rounded-xs">
              {equipamento.codigo}
            </span>
            <span className="font-mono text-xs text-[#667085]">
              Patrimônio: {equipamento.patrimonio}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1F2933] mt-1">
            {equipamento.nome}
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            {equipamento.fabricante} · Modelo {equipamento.modelo} · S/N: {equipamento.numeroSerie}
          </p>
        </div>

        <button
          onClick={() => setModalNovaVerificacao(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Verificação Intermediária</span>
        </button>
      </div>

      {/* Grid: Identification, Metrology, Maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Identificação */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-4 pb-2 border-b border-[#D9E1E8] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#2A6F97]" />
            Identificação Cadastral
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[#667085] text-[11px] block">Código Interno</span>
              <span className="font-mono font-bold text-[#1F2933]">{equipamento.codigo}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Patrimônio Estadual</span>
              <span className="font-mono text-[#1F2933]">{equipamento.patrimonio}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Fabricante / Modelo</span>
              <span className="text-[#1F2933] font-medium">{equipamento.fabricante} ({equipamento.modelo})</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Número de Série</span>
              <span className="font-mono text-[#1F2933]">{equipamento.numeroSerie}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Localização Laboratorial</span>
              <span className="text-[#1F2933] font-medium">{equipamento.localizacao}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Responsável Metrológico</span>
              <span className="text-[#123B5D] font-semibold">{equipamento.responsavel}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Controle Metrológico (Calibração) */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-4 pb-2 border-b border-[#D9E1E8] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2E7D5B]" />
            Controle Metrológico
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[#667085] text-[11px] block">Última Calibração Realizada</span>
              <span className="font-mono font-bold text-[#1F2933]">{equipamento.ultimaCalibracao}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Próxima Calibração Obrigatória</span>
              <span className="font-mono font-bold text-[#123B5D]">{equipamento.proximaCalibracao}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Periodicidade Estabelecida</span>
              <span className="text-[#1F2933]">{equipamento.periodicidadeCalibracaoMeses} meses (Ciclo RBC / POP)</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Certificado de Calibração</span>
              <span className="font-mono text-[#2A6F97] font-semibold">{equipamento.certificadoCalibracao || 'Emitido pelo RBC'}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(`Certificado Metrológico ${equipamento.certificadoCalibracao} arquivado na pasta digital da Qualidade.`)}
                className="w-full py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#F4F7F9] border border-[#D9E1E8] rounded-md text-[11px] font-semibold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#2A6F97]" />
                <span>Visualizar Certificado Digital</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Manutenção Preventiva */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider mb-4 pb-2 border-b border-[#D9E1E8] flex items-center gap-1.5">
            <CalendarClock className="w-4 h-4 text-[#D98E04]" />
            Manutenção Especializada
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-[#667085] text-[11px] block">Última Intervenção Técnica</span>
              <span className="font-mono text-[#1F2933]">{equipamento.ultimaManutencao}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Próxima Manutenção Preventiva</span>
              <span className="font-mono font-bold text-[#1F2933]">{equipamento.proximaManutencao}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Tipo de Manutenção</span>
              <span className="text-[#1F2933] font-medium">{equipamento.tipoManutencao} Programada</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Empresa Credenciada</span>
              <span className="text-[#1F2933]">{equipamento.empresaManutencao}</span>
            </div>
            <div>
              <span className="text-[#667085] text-[11px] block">Status Operacional</span>
              <StatusBadge status={equipamento.status} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Verificações Intermediárias & Histórico Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Verificações Intermediárias */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E8] mb-4">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#2A9D8F]" />
              Verificações Intermediárias ({equipamento.verificacoes.length})
            </h3>
            <button
              onClick={() => setModalNovaVerificacao(true)}
              className="text-xs font-semibold text-[#2A6F97] hover:underline"
            >
              + Nova Verificação
            </button>
          </div>

          {equipamento.verificacoes.length === 0 ? (
            <p className="text-xs text-[#667085] py-4 text-center">
              Nenhuma verificação intermediária registrada no período corrente.
            </p>
          ) : (
            <div className="space-y-3">
              {equipamento.verificacoes.map((verif) => (
                <div
                  key={verif.id}
                  className="p-3 rounded-lg border border-[#D9E1E8] bg-[#F8FAFC] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F2933]">{verif.tipo}</span>
                    <span className={`font-mono text-[11px] font-bold ${verif.resultado === 'Conforme' ? 'text-[#2E7D5B]' : 'text-[#C94C4C]'}`}>
                      {verif.resultado}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#667085]">
                    Executado em <strong className="font-mono text-[#1F2933]">{verif.data}</strong> por {verif.responsavel}
                  </div>
                  {verif.desvioObservado && (
                    <div className="text-[11px] text-[#2A6F97] font-mono">
                      Laudo: {verif.desvioObservado}
                    </div>
                  )}
                  <div className="text-[10px] text-[#667085] pt-1 border-t border-[#D9E1E8]/60">
                    Próxima verificação programada para: <strong className="font-mono">{verif.proximaData}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Histórico do Equipamento */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs">
          <div className="pb-3 border-b border-[#D9E1E8] mb-4">
            <h3 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#123B5D]" />
              Histórico de Eventos Metrológicos
            </h3>
          </div>

          <div className="space-y-3">
            {equipamento.historicoEventos.length === 0 ? (
              <p className="text-xs text-[#667085] py-4 text-center">
                Histórico limpo. Equipamento em conformidade nominal.
              </p>
            ) : (
              equipamento.historicoEventos.map((ev, idx) => (
                <div key={idx} className="relative pl-5 pb-3 border-l-2 border-[#123B5D]/30 last:border-transparent text-xs">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#123B5D]" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F2933]">{ev.tipo}</span>
                    <span className="font-mono text-[11px] text-[#667085]">{ev.data}</span>
                  </div>
                  <p className="text-[#667085] text-[11px] mt-0.5">{ev.descricao}</p>
                  <span className="text-[10px] text-[#2A6F97] block mt-0.5 font-medium">
                    Responsável: {ev.responsavel}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Nova Verificação Intermediária */}
      {modalNovaVerificacao && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E8] mb-4">
              <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wider">
                Registrar Verificação Intermediária
              </h3>
              <button
                onClick={() => setModalNovaVerificacao(false)}
                className="text-[#667085] hover:text-[#1F2933] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarVerificacao} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Tipo de Verificação
                </label>
                <input
                  type="text"
                  required
                  value={tipoVerif}
                  onChange={(e) => setTipoVerif(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md font-medium text-[#1F2933]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Resultado Metrológico
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#2E7D5B]">
                    <input
                      type="radio"
                      name="resultado"
                      checked={resultadoVerif === 'Conforme'}
                      onChange={() => setResultadoVerif('Conforme')}
                    />
                    <span>Conforme</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#C94C4C]">
                    <input
                      type="radio"
                      name="resultado"
                      checked={resultadoVerif === 'Não Conforme'}
                      onChange={() => setResultadoVerif('Não Conforme')}
                    />
                    <span>Não Conforme</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Desvios / Valores Medidos / Laudo
                </label>
                <textarea
                  rows={3}
                  value={desvio}
                  onChange={(e) => setDesvio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovaVerificacao(false)}
                  className="px-3 py-2 bg-white border border-[#D9E1E8] text-[#667085] rounded-md font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#123B5D] text-white rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Laudo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
