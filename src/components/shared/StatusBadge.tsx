import React from 'react';
import { SESSION_STATUS_LABELS, SESSION_STATUS_COLORS, type SessionStatus } from '../../types';

interface StatusBadgeProps { status: SessionStatus; }

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SESSION_STATUS_COLORS[status]}`}>
      {SESSION_STATUS_LABELS[status]}
    </span>
  );
}
