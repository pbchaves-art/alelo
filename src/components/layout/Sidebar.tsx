import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  Layers,
  ArrowLeftRight,
  PlusCircle,
  MinusCircle,
  Camera,
  Cpu,
  CalendarClock,
  Award,
  Bell,
  FileSpreadsheet,
  History,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight,
  FlaskConical,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  label: string;
  route: string;
  icon: any;
  highlight?: boolean;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentRoute, navigate, alertas } = useApp();

  // Count active critical/attention alerts
  const pendenciasCount = alertas.filter(
    (a) => !a.resolvido && (a.gravidade === 'Crítico' || a.gravidade === 'Atenção')
  ).length;

  const navGroups: NavGroup[] = [
    {
      group: 'VISÃO GERAL',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'ESTOQUE',
      items: [
        { label: 'Insumos', route: '/estoque', icon: Boxes },
        { label: 'Lotes (FEFO)', route: '/estoque/lotes', icon: Layers },
        { label: 'Movimentações', route: '/estoque/movimentacoes', icon: ArrowLeftRight },
        { label: 'Registrar Entrada', route: '/estoque/nova-entrada', icon: PlusCircle },
        { label: 'Registrar Saída', route: '/estoque/nova-saida', icon: MinusCircle },
        {
          label: 'Leitura por Foto (OCR)',
          route: '/estoque/leitura-foto',
          icon: Camera,
          highlight: true
        }
      ]
    },
    {
      group: 'EQUIPAMENTOS',
      items: [
        { label: 'Equipamentos', route: '/equipamentos', icon: Cpu },
        { label: 'Calibrações', route: '/equipamentos?filtro=calibracao', icon: ShieldCheck },
        { label: 'Manutenções', route: '/equipamentos?filtro=manutencao', icon: CalendarClock },
        { label: 'Verificações', route: '/equipamentos?filtro=verificacao', icon: FlaskConical }
      ]
    },
    {
      group: 'QUALIDADE',
      items: [
        { label: 'Prazos & Agenda', route: '/prazos', icon: CalendarClock },
        { label: 'Ensaios de Proficiência', route: '/proficiencia', icon: Award }
      ]
    },
    {
      group: 'GESTÃO',
      items: [
        {
          label: 'Central de Alertas',
          route: '/alertas',
          icon: Bell,
          badge: pendenciasCount > 0 ? pendenciasCount : undefined
        },
        { label: 'Relatórios', route: '/relatorios', icon: FileSpreadsheet },
        { label: 'Auditoria & Logs', route: '/auditoria', icon: History }
      ]
    },
    {
      group: 'ADMINISTRAÇÃO',
      items: [
        { label: 'Usuários & Perfis', route: '/admin', icon: Users },
        { label: 'Configurações', route: '/configuracoes', icon: Settings }
      ]
    }
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setMobileOpen(false);
  };

  const isActive = (route: string) => {
    if (route.includes('?')) {
      return false;
    }
    if (currentRoute === route) return true;
    if (route !== '/dashboard' && currentRoute.startsWith(route)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#D9E1E8] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#D9E1E8] flex items-center justify-between shrink-0 bg-white">
          <button
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-md bg-[#123B5D] flex items-center justify-center text-white font-bold text-sm shadow-xs tracking-tight">
              <span className="text-[#2A9D8F] font-black mr-0.5">A</span>L
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#123B5D] tracking-tight text-base leading-none">
                  ALELO
                </span>
                <span className="text-[9px] uppercase font-semibold text-[#2A9D8F] tracking-widest bg-[#2A9D8F]/10 px-1 py-0.2 rounded-xs">
                  DNA Forense
                </span>
              </div>
              <span className="text-[10px] text-[#667085] leading-none block mt-0.5 truncate max-w-[150px]">
                Polícia Científica de Goiás
              </span>
            </div>
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-[#667085] hover:text-[#1F2933] rounded-md"
            aria-label="Fechar menu lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 text-xs">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-[#667085]/80">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const active = isActive(item.route);

                  return (
                    <button
                      key={itemIdx}
                      onClick={() => handleNav(item.route)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors whitespace-nowrap group ${
                        active
                          ? 'bg-[#123B5D] text-white font-medium shadow-xs'
                          : item.highlight
                          ? 'text-[#123B5D] bg-[#2A9D8F]/10 font-semibold hover:bg-[#2A9D8F]/20'
                          : 'text-[#1F2933] hover:bg-[#F4F7F9] hover:text-[#123B5D]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active
                              ? 'text-white'
                              : item.highlight
                              ? 'text-[#2A9D8F]'
                              : 'text-[#667085] group-hover:text-[#123B5D]'
                          }`}
                        />
                        <span className="truncate text-xs">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                              active
                                ? 'bg-white text-[#123B5D]'
                                : 'bg-[#C94C4C] text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.highlight && !active && (
                          <span className="text-[9px] bg-[#2A9D8F] text-white font-bold px-1 rounded-xs uppercase tracking-tighter">
                            IA
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-[#D9E1E8] bg-[#F8FAFC]">
          <div className="rounded-md p-2.5 border border-[#D9E1E8] bg-white flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-[#123B5D] uppercase tracking-wide">
                Lab Biologia & DNA
              </p>
              <p className="text-[10px] text-[#667085] truncate">
                Conformidade RIF / ISO 17025
              </p>
            </div>
            <button
              onClick={() => handleNav('/auditoria')}
              className="text-[#2A6F97] hover:text-[#123B5D] p-1"
              title="Ver rastreabilidade"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
