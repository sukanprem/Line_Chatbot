import React, { useState, useEffect } from 'react';
import axios from 'axios'; // นำเข้า axios
import './BookingForm.css';
import { BASE_URL, HEADERS } from '../Global/config';

const BookingForm = ({ selectedSlot, selectedDate, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',  // lastName ใน frontend
        email: '',
        phone: '',
        citizenId: '',
        hospital: '',
        notes: '',
        time_slot_id: '', // เก็บ id ของ time slot
        status: 'confirmed', // สถานะการจอง
      });
      

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
    try {
      // รวม firstName และ lastName เพื่อสร้าง fullName ก่อนส่ง
 
      console.log("Sending data:", {
        ...formData,
      });
      // ส่งข้อมูลการจองไปยัง backend โดยใช้ axios
      // const url = "http://eewwe.yjyu/dsaddsaads"
      await axios.post(`${BASE_URL}/add-book-doctor-appointment-online`, {
        ...formData,
      }, {
        headers: HEADERS
      });
  
      // อัปเดตจำนวนการจองใน time slot
      await axios.put(`${BASE_URL}/update-time-slots/${formData.time_slot_id}`, {
        booked_appointments: selectedSlot.booked_appointments + 1,
      }, {
        headers: HEADERS
      });
  
      alert('การจองเสร็จสมบูรณ์!');
      onClose(); // ปิดหน้าแบบฟอร์ม
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการจอง:', error.response?.data || error.message);
    }
  };
  

  return (
    <div className="booking-form">
      <h2>ฟอร์มการจอง</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">ยืนยันการจอง</button>
      </form>
    </div>
  );

};

export default BookingForm;
