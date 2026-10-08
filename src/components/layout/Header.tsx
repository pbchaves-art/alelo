import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  Camera,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { currentRoute, navigate, currentUser, logout, alertas } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const activeAlertas = alertas.filter((a) => !a.resolvido);
  const criticosCount = activeAlertas.filter((a) => a.gravidade === 'Crítico').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs title
  const getRouteDetails = () => {
    if (currentRoute === '/dashboard') {
      return { section: 'Visão Geral', title: 'Dashboard Operacional' };
    }
    if (currentRoute === '/estoque') {
      return { section: 'Estoque', title: 'Insumos e Reagentes' };
    }
    if (currentRoute === '/estoque/lotes') {
      return { section: 'Estoque', title: 'Controle de Lotes & FEFO' };
    }
    if (currentRoute === '/estoque/movimentacoes') {
      return { section: 'Estoque', title: 'Histórico de Movimentações' };
    }
    if (currentRoute === '/estoque/nova-entrada') {
      return { section: 'Estoque', title: 'Registrar Entrada de Material' };
    }
    if (currentRoute === '/estoque/nova-saida') {
      return { section: 'Estoque', title: 'Registrar Saída de Material' };
    }
    if (currentRoute === '/estoque/leitura-foto') {
      return { section: 'Estoque', title: 'Reconhecimento Óptico & Fotografia (OCR)' };
    }
    if (currentRoute === '/equipamentos' || currentRoute.startsWith('/equipamentos/')) {
      return { section: 'Metrologia', title: 'Controle de Equipamentos' };
    }
    if (currentRoute === '/prazos') {
      return { section: 'Qualidade', title: 'Controle de Prazos e Obrigações' };
    }
    if (currentRoute === '/alertas') {
      return { section: 'Gestão', title: 'Central de Alertas e Notificações' };
    }
    if (currentRoute === '/proficiencia') {
      return { section: 'Qualidade', title: 'Ensaios de Proficiência (RIF / GEDNAP)' };
    }
    if (currentRoute === '/relatorios') {
      return { section: 'Gestão', title: 'Relatórios Gerenciais' };
    }
    if (currentRoute === '/auditoria') {
      return { section: 'Rastreabilidade', title: 'Trilha de Auditoria (Logs)' };
    }
    if (currentRoute === '/admin') {
      return { section: 'Administração', title: 'Gestão de Usuários e Permissões' };
    }
    if (currentRoute === '/configuracoes') {
      return { section: 'Sistema', title: 'Parâmetros e Configurações' };
    }
    return { section: 'ALELO', title: 'Sistema Institucional' };
  };

  const { section, title } = getRouteDetails();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#D9E1E8] px-4 md:px-6 flex items-center justify-between">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 -ml-2 text-[#667085] hover:text-[#1F2933] rounded-md focus:outline-hidden"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-[#667085]">
            <span className="font-medium text-[#2A6F97]">{section}</span>
            <span className="text-[#D9E1E8]">/</span>
            <span className="truncate hidden sm:inline">{title}</span>
          </div>
          <h1 className="text-sm md:text-base font-semibold text-[#1F2933] truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Fast Quick-Action for Photo OCR */}
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={() => navigate('/estoque/leitura-foto')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#2A9D8F]/10 hover:bg-[#2A9D8F]/20 text-[#123B5D] text-xs font-medium rounded-md border border-[#2A9D8F]/30 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-[#2A9D8F]" />
          <span>Leitura por Fotografia</span>
          <span className="bg-[#2A9D8F] text-white text-[10px] font-bold px-1 rounded-xs">
            OCR
          </span>
        </button>

        <div className="h-4 w-px bg-[#D9E1E8]" />

        <div className="flex items-center gap-1.5 text-[11px] text-[#667085] tabular-nums">
          <span className="w-2 h-2 rounded-full bg-[#2E7D5B] animate-pulse" />
          <span>Base Ativa: Lab DNA / PCGO</span>
        </div>
      </div>

      {/* Zone 3: Notifications & User Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-[#667085] hover:text-[#123B5D] hover:bg-[#F4F7F9] rounded-md transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {activeAlertas.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C94C4C] ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-[#D9E1E8] shadow-xl rounded-md p-0 overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 bg-[#F4F7F9] border-b border-[#D9E1E8] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#123B5D] uppercase tracking-wider">
                    Central de Notificações
                  </h4>
                  <p className="text-[11px] text-[#667085]">
                    {criticosCount} alertas críticos pendentes
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate('/alertas');
                    setNotifOpen(false);
                  }}
                  className="text-xs text-[#2A6F97] hover:underline font-medium"
                >
                  Ver todos
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#D9E1E8]">
                {activeAlertas.slice(0, 4).map((alerta) => (
                  <div
                    key={alerta.id}
                    onClick={() => {
                      navigate(alerta.rotaAcao);
                      setNotifOpen(false);
                    }}
                    className="p-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      {alerta.gravidade === 'Crítico' ? (
                        <AlertTriangle className="w-4 h-4 text-[#C94C4C] shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#D98E04] shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#1F2933] truncate">
                            {alerta.item}
                          </span>
                          <span className="text-[10px] text-[#667085] ml-2">
                            {alerta.data}
                          </span>
                        </div>
                        <p className="text-xs text-[#667085] line-clamp-2 mt-0.5">
                          {alerta.motivo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-white border-t border-[#D9E1E8] text-center">
                <button
                  onClick={() => {
                    navigate('/alertas');
                    setNotifOpen(false);
                  }}
                  className="text-xs font-semibold text-[#123B5D] hover:underline"
                >
                  Abrir Central de Alertas Completa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#F4F7F9] transition-colors text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-[#123B5D] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {currentUser.nome
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-[#1F2933] block leading-tight">
                {currentUser.nome}
              </span>
              <span className="text-[10px] text-[#667085] block leading-tight truncate max-w-[120px]">
                {currentUser.perfil}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085] hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#D9E1E8] shadow-xl rounded-md py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-3 border-b border-[#D9E1E8] bg-[#F8FAFC]">
                <p className="text-xs font-bold text-[#1F2933]">{currentUser.nome}</p>
                <p className="text-[11px] text-[#667085] truncate">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#2A6F97] font-medium">
                  <Shield className="w-3 h-3" />
                  <span>{currentUser.funcao}</span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    navigate('/admin');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[#1F2933] hover:bg-[#F4F7F9] text-left transition-colors"
                >
                  <User className="w-4 h-4 text-[#667085]" />
                  <span>Meu Perfil Institucional</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/configuracoes');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[#1F2933] hover:bg-[#F4F7F9] text-left transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#667085]" />
                  <span>Configurações do Laboratório</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/auditoria');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[#1F2933] hover:bg-[#F4F7F9] text-left transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#667085]" />
                  <span>Log de Rastreabilidade</span>
                </button>
              </div>

              <div className="border-t border-[#D9E1E8] pt-1 pb-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[#C94C4C] hover:bg-rose-50 text-left transition-colors text-xs font-medium"
                >
                  <LogOut className="w-4 h-4 text-[#C94C4C]" />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
