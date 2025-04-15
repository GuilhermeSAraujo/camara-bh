import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PARTY_COLOR } from './consts';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (hours) => {
  if (hours == null) return 'N/A';

  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours * 60) % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) parts.push(`${remainingHours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length ? parts.join(' ') : '0m';
};

export function getPartyColor(party) {
  if (party) {
    return PARTY_COLOR[party];
  }
  return '#808080';
}

export function getStatusColor(status) {
  switch (status) {
    case 'Lei':
      return 'text-green-600';
    case 'Rejeitada':
      return 'text-red-600';
    case 'Em redação final':
      return 'text-blue-600';
    case 'Primeiro turno':
      return 'text-blue-600';
    case 'Segundo turno':
      return 'text-blue-600';
    case 'Proposição de Lei':
      return 'text-blue-600';
    case 'Retirada':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

export function getStatusColorHex(status) {
  switch (status) {
    case 'Lei':
      return '#16a34a';
    case 'Rejeitada':
      return '#dc2626';
    case 'Em redação final':
      return '#2563eb';
    case 'Primeiro turno':
      return '#2563eb';
    case 'Segundo turno':
      return '#2563eb';
    case 'Proposição de Lei':
      return '#2563eb';
    case 'Retirada':
      return '#fcd34d';
    default:
      return '#4b5563';
  }
}
