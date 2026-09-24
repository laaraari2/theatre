import React from 'react';
import type { TrainingSession, ClassSection } from '../../types';
import { formatDateArabic, formatTime } from '../../utils/dateUtils';
import StatusBadge from './StatusBadge';

interface SessionCardProps {
  session: TrainingSession;
  classSection?: ClassSection;
  onClick?: () => void;
}

export default function SessionCard({ session, classSection, onClick }: SessionCardProps) {
  if (session.isHoliday) {
    return (
      <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 opacity-80">
        <div className="flex items-center gap-2 text-amber-700">
          <span>🏖️</span>
          <span className="font-medium text-sm">{session.holidayName}</span>
        </div>
        <div className="text-xs text-amber-600 mt-1">{formatDateArabic(session.date)}</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-bg-card rounded-lg border border-border p-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text text-sm">{classSection?.name || `قسم ${session.classId}`}</div>
          <div className="text-xs text-text-muted mt-0.5">
            {formatDateArabic(session.date)} — {formatTime(session.startTime)}
          </div>
          {session.topic && (
            <div className="text-sm text-text mt-1 truncate">{session.topic}</div>
          )}
        </div>
        <StatusBadge status={session.status} />
      </div>
    </div>
  );
}
