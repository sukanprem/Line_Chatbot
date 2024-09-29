import React from 'react';
import './Confirmation.css';

const BookingConfirmation = ({ bookingDetails }) => {
  return (
    <div className="confirmation-container">
      <h1 className="confirmation-header">myHealthFirst</h1>
      <p className="confirmation-subtitle">จองพบแพทย์ออนไลน์:</p>

      <p><strong>{bookingDetails.firstName} {bookingDetails.lastName}</strong> จอง</p>
      {/* <p>Program Tele Clinic จาก telereserve</p> */}
      <p>โรงพยาบาล {bookingDetails.hospital}</p>
      {/* <p>แผนก อายุรกรรม</p> */}
      <p>วันที่: <strong>{bookingDetails.date}</strong></p>
      <p>เวลา: <strong>{bookingDetails.time}</strong></p>

      {/* เพิ่มข้อมูลที่ควรใส่ */}
      <p>อีเมล: <strong>{bookingDetails.email}</strong></p>
      <p>เบอร์โทร: <strong>{bookingDetails.phone}</strong></p>
      <p>เลขบัตรประชาชน: <strong>{bookingDetails.citizenId}</strong></p>
      <p>หมายเหตุ: <strong>{bookingDetails.notes || 'ไม่มี'}</strong></p> {/* ถ้าไม่มีหมายเหตุจะแสดงว่า "ไม่มี" */}
    </div>
  );
};

export default BookingConfirmation;
