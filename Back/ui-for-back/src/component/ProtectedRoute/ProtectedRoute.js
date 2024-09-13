import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // หากยังไม่ล็อกอิน ให้ redirect ไปที่หน้า login
  }

  return children; // หากล็อกอินแล้ว ให้แสดง component ภายใน ProtectedRoute
};

export default ProtectedRoute;