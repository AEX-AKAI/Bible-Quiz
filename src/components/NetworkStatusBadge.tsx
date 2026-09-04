import React from 'react';
import { NetworkStatus } from '../core/types';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  status: NetworkStatus;
}

export const NetworkStatusBadge: React.FC<Props> = ({ status }) => {
  if (status === 'ONLINE') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-tight shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>ONLINE</span>
      </div>
    );
  }

  if (status === 'OFFLINE') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-400 text-[11px] font-bold tracking-tight shadow-sm">
        <WifiOff size={11} />
        <span>OFFLINE</span>
      </div>
    );
  }

  if (status === 'RECONNECTING' || status === 'CONNECTING') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-400 text-[11px] font-bold tracking-tight shadow-sm">
        <RefreshCw size={11} className="animate-spin" />
        <span>RECONNECTING</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/30 text-rose-400 text-[11px] font-bold tracking-tight shadow-sm">
      <AlertCircle size={11} />
      <span>DISCONNECTED</span>
    </div>
  );
};
