import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { EstoqueView } from './views/EstoqueView';
import { LotesView } from './views/LotesView';
import { MovimentacoesView } from './views/MovimentacoesView';
import { NovaEntradaView } from './views/NovaEntradaView';
import { NovaSaidaView } from './views/NovaSaidaView';
import { LeituraFotoView } from './views/LeituraFotoView';
import { EquipamentosView } from './views/EquipamentosView';
import { EquipamentoDetailView } from './views/EquipamentoDetailView';
import { PrazosView } from './views/PrazosView';
import { AlertasView } from './views/AlertasView';
import { ProficienciaView } from './views/ProficienciaView';
import { RelatoriosView } from './views/RelatoriosView';
import { AuditoriaView } from './views/AuditoriaView';
import { AdminView } from './views/AdminView';
import { ConfiguracoesView } from './views/ConfiguracoesView';

const MainLayout: React.FC = () => {
  const { isAuthenticated, currentRoute } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not logged in or path is login
  if (!isAuthenticated || currentRoute === '/auth/login') {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <DashboardView />;
      case '/estoque':
        return <EstoqueView />;
      case '/estoque/lotes':
        return <LotesView />;
      case '/estoque/movimentacoes':
        return <MovimentacoesView />;
      case '/estoque/nova-entrada':
        return <NovaEntradaView />;
      case '/estoque/nova-saida':
        return <NovaSaidaView />;
      case '/estoque/leitura-foto':
        return <LeituraFotoView />;
      case '/equipamentos':
        return <EquipamentosView />;
      case '/equipamentos/[id]':
        return <EquipamentoDetailView />;
      case '/prazos':
        return <PrazosView />;
      case '/alertas':
        return <AlertasView />;
      case '/proficiencia':
        return <ProficienciaView />;
      case '/relatorios':
        return <RelatoriosView />;
      case '/auditoria':
        return <AuditoriaView />;
      case '/admin':
        return <AdminView />;
      case '/configuracoes':
        return <ConfiguracoesView />;
      default:
        // Handle routes like /equipamentos/eq-01
        if (currentRoute.startsWith('/equipamentos/')) {
          return <EquipamentoDetailView />;
        }
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#1F2933]">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Shell */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>

        <footer className="py-4 px-6 border-t border-[#D9E1E8] bg-white text-center text-xs text-[#667085]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-medium text-[#123B5D]">
              <span className="font-extrabold">ALELO</span>
              <span>— Administração Logística e Estoque Laboratorial Otimizado</span>
            </div>
            <div className="text-[11px]">
              Polícia Científica de Goiás · Laboratório de Biologia e DNA Forense · Versão 1.0 (MVP)
            </div>
          </div>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
