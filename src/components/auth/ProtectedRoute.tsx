import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

/**
 * يحمي مسارات لوحة التحكم — إذا لم يكن المستخدم مسجل دخوله يُعاد توجيهه لصفحة تسجيل الدخول
 */
export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
