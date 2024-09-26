import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './BookingForm.css';
import { BASE_URL, HEADERS } from '../Global/config';
import BookingConfirmation from './Confirmation'; // Import หน้าจอยืนยันการจอง

const BookingForm = ({ selectedSlot, selectedDate, onClose, lineUserId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    phone: '',
    citizenId: '',
    hospital: '',
    notes: '',
    time_slot_id: '',
    status: 'confirmed',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [successMessage, setSuccessMessage] = useState('');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false); // เพิ่มสถานะเพื่อจัดการหน้าจอ

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-all-dates-with-time-slots`, {
          headers: HEADERS
        });
        const data = response.data;

        const foundDate = data.find((item) => item.date === selectedDate);
        if (foundDate) {
          const foundTimeSlot = foundDate.timeSlots.find(
            (slot) => slot.time_slot === selectedSlot.time_slot
          );
          if (foundTimeSlot) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              time_slot_id: foundTimeSlot.id,
            }));
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, selectedSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 

    try {
      await axios.post(`${BASE_URL}/add-book-doctor-appointment-online`, {
        ...formData,
        lineUserId,
      }, {
        headers: HEADERS
      });

      await axios.put(`${BASE_URL}/update-time-slots/${formData.time_slot_id}`, {
        booked_appointments: selectedSlot.booked_appointments + 1,
      }, {
        headers: HEADERS
      });

      setIsBookingConfirmed(true); // ตั้งสถานะให้แสดงหน้าจอการจองสำเร็จ
      setSuccessMessage('การจองเสร็จสมบูรณ์! คุณจะได้รับข้อความยืนยันใน LINE ของคุณ');
      setIsSubmitting(false); 
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการจอง:', error.response?.data || error.message);
      setIsSubmitting(false); 
    }
  };

  // หากการจองสำเร็จ จะแสดงหน้าจอยืนยันการจอง
  if (isBookingConfirmed) {
    return (
      <BookingConfirmation 
        bookingDetails={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          hospital: formData.hospital,
          date: selectedDate,
          time: selectedSlot.time_slot
        }} 
      />
    );
  }

  return (
    <div className="booking-form">
      <h2>ฟอร์มการจอง</h2>
      <form onSubmit={handleSubmit}>
        <div className="two-columns">
          <div>
            <label>ชื่อ:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>นามสกุล:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label>อีเมล:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>เบอร์โทร:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>เลขบัตรประชาชน:</label>
          <input
            type="text"
            name="citizenId"
            value={formData.citizenId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>โรงพยาบาล:</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>หมายเหตุ:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </div>

        <p>วันที่ที่เลือก: {selectedDate}</p>
        <p>ช่วงเวลาที่เลือก: {selectedSlot.time_slot}</p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังยืนยันการจอง...' : 'ยืนยันการจอง'}
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default BookingForm;
