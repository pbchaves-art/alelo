import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSucesso = toast.tipo === 'sucesso';
        const isAtencao = toast.tipo === 'atencao';
        const isErro = toast.tipo === 'erro';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-white border border-[#D9E1E8] shadow-lg rounded-md p-4 flex items-start gap-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="shrink-0 mt-0.5">
              {isSucesso && <CheckCircle2 className="w-5 h-5 text-[#2E7D5B]" />}
              {isAtencao && <AlertTriangle className="w-5 h-5 text-[#D98E04]" />}
              {isErro && <AlertCircle className="w-5 h-5 text-[#C94C4C]" />}
              {!isSucesso && !isAtencao && !isErro && <Info className="w-5 h-5 text-[#3B82A0]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#1F2933] uppercase tracking-wider">
                {toast.titulo}
              </h4>
              <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">
                {toast.mensagem}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-[#667085] hover:text-[#1F2933] p-1 rounded transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
