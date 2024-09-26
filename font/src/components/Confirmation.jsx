import React from 'react';
import './Confirmation.css';

const BookingConfirmation = ({ bookingDetails }) => {
  return (
    <div className="confirmation-container">
      <h1 className="confirmation-header">myHealthFirst</h1>
      <p className="confirmation-subtitle">จองพบแพทย์ออนไลน์:</p>

      <p><strong>{bookingDetails.firstName} {bookingDetails.lastName}</strong> จอง</p>
      <p>Program Tele Clinic จาก telereserve</p>
      <p>โรงพยาบาล {bookingDetails.hospital} กับ DoctorCare</p>
      <p>แผนก อายุรกรรม</p>
      <p>วันที่: <strong>{bookingDetails.date}</strong></p>
      <p>เวลา: <strong>{bookingDetails.time}</strong></p>
    </div>
  );
};

export default BookingConfirmation;
