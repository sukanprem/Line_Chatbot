import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CreateHealthCheck from './component/HealthCheck/CreateHealthCheck';
import UpdateHealthCheck from './component/HealthCheck/UpdateHealthCheck';
import CreateBookDoctorAppointmentOnline from './component/BookDoctorAppointmentOnline/CreateBookDoctorAppointmentOnline';
import UpdateBookDoctorAppointmentOnline from './component/BookDoctorAppointmentOnline/UpdateBookDoctorAppointmentOnline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // ใช้ createRoot แทน render

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/create-health-check" element={<CreateHealthCheck />} />
      <Route path="/update-health-check-result/:id" element={<UpdateHealthCheck />} />
      <Route path="/create-book-doctor-appointment" element={<CreateBookDoctorAppointmentOnline />} />
      <Route path="/update-book-doctor-appointment/:id" element={<UpdateBookDoctorAppointmentOnline />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
