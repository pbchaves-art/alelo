import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('pbchaves@policiacientifica.go.gov.br');
  const [password, setPassword] = useState('••••••••••••');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#123B5D] text-white shadow-md mb-4 ring-4 ring-[#123B5D]/10">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-[#2A9D8F]">A</span>L
            </span>
          </div>

          <h1 className="text-2xl font-black text-[#123B5D] tracking-tight">
            ALELO
          </h1>
          <p className="text-xs font-semibold text-[#2A6F97] uppercase tracking-wider mt-0.5">
            Administração Logística e Estoque Laboratorial Otimizado
          </p>

          <p className="text-xs text-[#667085] mt-2 max-w-sm mx-auto leading-relaxed">
            Laboratório de Biologia e DNA Forense da Polícia Científica de Goiás
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#D9E1E8] rounded-xl shadow-xs p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-base font-bold text-[#1F2933]">
              Acesso ao Sistema
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Informe suas credenciais institucionais para prosseguir.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2933] uppercase tracking-wide mb-1.5">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#667085] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md focus:outline-hidden focus:border-[#123B5D] focus:bg-white text-[#1F2933] transition-colors"
                  placeholder="usuario@policiacientifica.go.gov.br"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#1F2933] uppercase tracking-wide">
                  Senha
                </label>
                <a
                  href="#esqueci"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Por motivos de segurança institucional, a recuperação de senha é realizada junto à Coordenação de TI da SPTC.');
                  }}
                  className="text-xs text-[#2A6F97] hover:underline"
                >
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667085] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#D9E1E8] rounded-md focus:outline-hidden focus:border-[#123B5D] focus:bg-white text-[#1F2933] transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-[#D9E1E8] text-[#123B5D] focus:ring-0"
                />
                <span className="text-[#667085]">Lembrar acesso neste terminal</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#123B5D] hover:bg-[#0e2f4a] text-white py-2.5 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no ALELO</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-5 p-3 rounded-md bg-[#F4F7F9] border border-[#D9E1E8] text-xs">
            <div className="flex items-center gap-1.5 text-[#123B5D] font-semibold text-[11px] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
              <span>Ambiente de Demonstração Institucional</span>
            </div>
            <p className="text-[11px] text-[#667085] leading-relaxed">
              Usuário ativo: <strong>Paulo Chaves</strong> (Responsável Técnico — Biologia e DNA Forense).
            </p>
          </div>
        </div>

        {/* Institutional Compliance Notice */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-[#667085]">
            Ambiente interno destinado à gestão operacional do Laboratório de Biologia e DNA Forense.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#667085]/80">
            <Shield className="w-3.5 h-3.5 text-[#2A9D8F]" />
            <span>
              Os registros realizados neste sistema devem ser utilizados conforme os procedimentos internos e as políticas institucionais aplicáveis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
