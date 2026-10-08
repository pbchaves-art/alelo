import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Shield, PlusCircle, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { usuarios, currentUser, setCurrentUser, addToast } = useApp();

  const handleSimularUsuario = (user: any) => {
    setCurrentUser(user);
    addToast('Perfil alternado', `Você está operando como ${user.nome} (${user.perfil}).`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#123B5D] tracking-tight">
            Gestão de Usuários e Perfis Institucionais
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Controle de acessos, segregação de funções e perfis periciais do Laboratório de Biologia e DNA Forense.
          </p>
        </div>

        <button
          onClick={() => alert('Integração com diretório corporativo da Polícia Civil / SPTC preparada para ambiente de produção.')}
          className="px-3.5 py-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* Profiles Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
        {[
          { perfil: 'Responsável Técnico', desc: 'Gestão global, laudos e prazos' },
          { perfil: 'Qualidade', desc: 'Metrologia, POPs e proficiência' },
          { perfil: 'Estoque', desc: 'Entradas, saídas e lotes FEFO' },
          { perfil: 'Analista', desc: 'Retiradas de uso em bancada' },
          { perfil: 'Administrador', desc: 'Parâmetros e acessos' },
          { perfil: 'Visualização', desc: 'Apenas consulta gerencial' }
        ].map((p, idx) => (
          <div key={idx} className="p-2.5 bg-white border border-[#D9E1E8] rounded-lg">
            <span className="font-bold text-[#123B5D] block text-[11px] truncate">{p.perfil}</span>
            <span className="text-[10px] text-[#667085] leading-tight block mt-0.5">{p.desc}</span>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#D9E1E8] text-[#667085] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nome do Perito / Servidor</th>
                <th className="py-3 px-3">E-mail Institucional</th>
                <th className="py-3 px-3">Função Oficial</th>
                <th className="py-3 px-3">Perfil no ALELO</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Último Acesso</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E1E8]">
              {usuarios.map((u) => {
                const isCurrent = currentUser.id === u.id;

                return (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1F2933] flex items-center gap-2">
                        <span>{u.nome}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-[#2E7D5B] text-white font-bold px-1.5 py-0.2 rounded-xs uppercase">
                            Você
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#667085]">
                      {u.email}
                    </td>
                    <td className="py-3 px-3 text-[#1F2933]">
                      {u.funcao}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-[#123B5D] bg-[#123B5D]/10 px-2 py-0.5 rounded-xs text-[11px]">
                        {u.perfil}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#2E7D5B] text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]" />
                        <span>{u.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#667085] text-[11px] whitespace-nowrap">
                      {u.ultimoAcesso}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {!isCurrent ? (
                        <button
                          onClick={() => handleSimularUsuario(u)}
                          className="px-2.5 py-1 bg-white hover:bg-[#F4F7F9] text-[#2A6F97] border border-[#D9E1E8] text-[11px] font-semibold rounded-xs transition-colors cursor-pointer"
                        >
                          Alternar Sessão
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#2E7D5B] font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ativo</span>
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
