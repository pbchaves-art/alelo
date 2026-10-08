import React from 'react';
import { StatusItem, StatusEquipamento, StatusPrazo } from '../../types';

interface StatusBadgeProps {
  status: StatusItem | StatusEquipamento | StatusPrazo | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toLowerCase();
  const isSm = size === 'sm';

  if (s === 'crítico' || s === 'vencido' || s === 'não conforme') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[#C94C4C] ${
          isSm ? 'text-xs' : 'text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#C94C4C] ring-2 ring-[#C94C4C]/20 shrink-0" />
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          {status}
        </span>
      </span>
    );
  }

  if (s === 'atenção') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[#D98E04] ${
          isSm ? 'text-xs' : 'text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D98E04] ring-2 ring-[#D98E04]/20 shrink-0" />
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          {status}
        </span>
      </span>
    );
  }

  if (s === 'normal' || s === 'regular' || s === 'conforme' || s === 'concluído' || s === 'finalizado') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-[#2E7D5B] ${
          isSm ? 'text-xs' : 'text-xs'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B] ring-2 ring-[#2E7D5B]/20 shrink-0" />
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          {status}
        </span>
      </span>
    );
  }

  // Info, Planejado, Em análise, Em manutenção
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium text-[#3B82A0] ${
        isSm ? 'text-xs' : 'text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82A0] ring-2 ring-[#3B82A0]/20 shrink-0" />
      <span className="font-semibold uppercase tracking-wider text-[11px]">
        {status}
      </span>
    </span>
  );
};
