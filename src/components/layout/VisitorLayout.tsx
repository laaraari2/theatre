import React from 'react';
import { Outlet } from 'react-router-dom';

export default function VisitorLayout() {
  return (
    <div className="min-h-screen bg-bg" dir="rtl">
      <Outlet />
    </div>
  );
}
