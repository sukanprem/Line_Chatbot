import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PatientForm from './components/PatientForm';
import SubscribeForm from './components/SubscribeForm';
import CalendarBooking from './components/CalendarBooking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar-form" element={<CalendarBooking />} />
        <Route path="/subscribe-form" element={<SubscribeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
