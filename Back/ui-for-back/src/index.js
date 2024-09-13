import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CreateHealthCheck from './component/HealthCheck/CreateHealthCheck';
import UpdateHealthCheck from './component/HealthCheck/UpdateHealthCheck';
import CreateBookDoctorAppointmentOnline from './component/BookDoctorAppointmentOnline/CreateBookDoctorAppointmentOnline';
import UpdateBookDoctorAppointmentOnline from './component/BookDoctorAppointmentOnline/UpdateBookDoctorAppointmentOnline';
import CreateSubscriptions from './component/Subscriptions/CreateSubscriptions';
import UpdateSubscriptions from './component/Subscriptions/UpdateSubscriptions';
import LoginFormPage from './component/LoginFormPage/LoginFormPage'; // Import the LoginFormPage component
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // ใช้ createRoot แทน render

root.render(
  <Router>
    <Routes>
      <Route path="/login" element={<LoginFormPage />} /> {/* หน้า login ไม่ต้องการการป้องกัน */}

      {/* ปกป้องหน้าที่แอดมินต้องล็อกอินก่อนเข้า */}
      <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
      <Route path="/create-health-check" element={<ProtectedRoute><CreateHealthCheck /></ProtectedRoute>} />
      <Route path="/update-health-check-result/:id" element={<ProtectedRoute><UpdateHealthCheck /></ProtectedRoute>} />
      <Route path="/create-book-doctor-appointment" element={<ProtectedRoute><CreateBookDoctorAppointmentOnline /></ProtectedRoute>} />
      <Route path="/update-book-doctor-appointment/:id" element={<ProtectedRoute><UpdateBookDoctorAppointmentOnline /></ProtectedRoute>} />
      <Route path="/create-subscriptions" element={<ProtectedRoute><CreateSubscriptions /></ProtectedRoute>} />
      <Route path="/update-subscriptions/:id" element={<ProtectedRoute><UpdateSubscriptions /></ProtectedRoute>} />
    </Routes>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
