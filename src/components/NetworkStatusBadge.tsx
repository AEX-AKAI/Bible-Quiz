import React from 'react';
import { NetworkStatus } from '../core/types';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  status: NetworkStatus;
}

export const NetworkStatusBadge: React.FC<Props> = ({ status }) => {
  if (status === 'ONLINE') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>ONLINE</span>
      </div>
    );
  }

  if (status === 'OFFLINE') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-semibold">
        <WifiOff size={12} />
        <span>OFFLINE</span>
      </div>
    );
  }

  if (status === 'RECONNECTING' || status === 'CONNECTING') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-semibold">
        <RefreshCw size={12} className="animate-spin" />
        <span>RECONNECTING</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-semibold">
      <AlertCircle size={12} />
      <span>NETWORK ERROR</span>
    </div>
  );
};
