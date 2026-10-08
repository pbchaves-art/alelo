import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Save, Shield, Clock, Check, Bell } from 'lucide-react';

export const ConfiguracoesView: React.FC = () => {
  const { addToast } = useApp();

  const [alertarValidade, setAlertarValidade] = useState(30);
  const [alertarValidadeUrgente, setAlertarValidadeUrgente] = useState(7);
  const [alertarCalibracao, setAlertarCalibracao] = useState(30);
  const [alertarManutencao, setAlertarManutencao] = useState(30);
  const [alertarVerificacao, setAlertarVerificacao] = useState(15);
  const [fefoObrigatorio, setFefoObrigatorio] = useState(true);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Configurações atualizadas', 'As regras de alerta e parâmetros laboratoriais foram salvas.', 'sucesso');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Parâmetros & Configurações do Sistema
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Definição de regras de alerta prévio, tolerâncias metrológicas e identidade do laboratório.
          </p>
        </div>

        <button
          onClick={handleSalvar}
          className="px-4 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <form onSubmit={handleSalvar} className="space-y-6">
        {/* Seção 1: Dados do Laboratório */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#D9E1E8]">
            <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wide">
              1. Dados do Laboratório e Credenciamento
            </h3>
            <p className="text-xs text-[#667085]">
              Informações institucionais aplicadas aos laudos, relatórios e comprovantes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#667085] uppercase mb-1">
                Órgão Institucional
              </label>
              <input
                type="text"
                disabled
                value="Polícia Científica do Estado de Goiás (SPTC/GO)"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md font-medium text-[#1F2933]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#667085] uppercase mb-1">
                Unidade Especializada
              </label>
              <input
                type="text"
                disabled
                value="Laboratório de Biologia e DNA Forense"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md font-medium text-[#1F2933]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#667085] uppercase mb-1">
                Responsável Técnico Oficial
              </label>
              <input
                type="text"
                disabled
                value="Paulo Chaves (Perito Criminal Oficial)"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md text-[#1F2933]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#667085] uppercase mb-1">
                Código Laboratorial RIF / CODIS
              </label>
              <input
                type="text"
                disabled
                value="GO-DNA-01 (Banco Nacional de Perfis Genéticos)"
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#D9E1E8] rounded-md font-mono text-[#1F2933]"
              />
            </div>
          </div>
        </div>

        {/* Seção 2: Regras de Alerta */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#D9E1E8] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wide flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#D98E04]" />
                2. Regras Automáticas de Alerta e Antecedência
              </h3>
              <p className="text-xs text-[#667085]">
                Configuração dos limiares de antecedência para geração de avisos no dashboard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <label className="block text-xs font-bold text-[#1F2933] mb-1">
                Alertar Validade de Reagente (Amarelo)
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={alertarValidade}
                  onChange={(e) => setAlertarValidade(parseInt(e.target.value, 10) || 30)}
                  className="w-20 px-2.5 py-1.5 bg-white border border-[#D9E1E8] rounded-md font-mono font-bold text-center"
                />
                <span className="text-xs text-[#667085]">dias de antecedência</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <label className="block text-xs font-bold text-[#1F2933] mb-1">
                Alerta de Urgência de Validade (Vermelho)
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={alertarValidadeUrgente}
                  onChange={(e) => setAlertarValidadeUrgente(parseInt(e.target.value, 10) || 7)}
                  className="w-20 px-2.5 py-1.5 bg-white border border-[#D9E1E8] rounded-md font-mono font-bold text-center"
                />
                <span className="text-xs text-[#667085]">dias de antecedência</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <label className="block text-xs font-bold text-[#1F2933] mb-1">
                Alertar Calibração de Equipamento
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={alertarCalibracao}
                  onChange={(e) => setAlertarCalibracao(parseInt(e.target.value, 10) || 30)}
                  className="w-20 px-2.5 py-1.5 bg-white border border-[#D9E1E8] rounded-md font-mono font-bold text-center"
                />
                <span className="text-xs text-[#667085]">dias de antecedência</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <label className="block text-xs font-bold text-[#1F2933] mb-1">
                Alertar Manutenção Preventiva
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={alertarManutencao}
                  onChange={(e) => setAlertarManutencao(parseInt(e.target.value, 10) || 30)}
                  className="w-20 px-2.5 py-1.5 bg-white border border-[#D9E1E8] rounded-md font-mono font-bold text-center"
                />
                <span className="text-xs text-[#667085]">dias de antecedência</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={fefoObrigatorio}
                onChange={(e) => setFefoObrigatorio(e.target.checked)}
                className="rounded border-[#D9E1E8] text-[#123B5D]"
              />
              <span className="font-semibold text-[#1F2933]">
                Forçar recomendação FEFO ("First Expire, First Out") no formulário de saídas
              </span>
            </label>
          </div>
        </div>

        {/* Seção 3: Periodicidades Padrões */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#D9E1E8]">
            <h3 className="text-sm font-bold text-[#123B5D] uppercase tracking-wide">
              3. Periodicidades Padrões de Qualidade
            </h3>
            <p className="text-xs text-[#667085]">
              Ciclos de recorrência adotados após a conclusão de cada etapa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <span className="text-[11px] font-bold text-[#667085] uppercase block">
                Calibração Metrológica RBC
              </span>
              <strong className="text-sm font-mono text-[#123B5D]">12 meses (Anual)</strong>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <span className="text-[11px] font-bold text-[#667085] uppercase block">
                Manutenção Preventiva
              </span>
              <strong className="text-sm font-mono text-[#123B5D]">12 meses (Anual)</strong>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#D9E1E8]">
              <span className="text-[11px] font-bold text-[#667085] uppercase block">
                Verificação Intermediária
              </span>
              <strong className="text-sm font-mono text-[#123B5D]">3 meses (Trimestral)</strong>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
