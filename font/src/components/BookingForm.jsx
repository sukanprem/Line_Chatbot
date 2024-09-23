import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';
import { BASE_URL, HEADERS } from '../Global/config';

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

  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading button
  const [successMessage, setSuccessMessage] = useState(''); // State for success feedback

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-all-dates-with-time-slots`, {
          headers: HEADERS,
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
        console.error('Error fetching time slots:', error);
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
    setIsSubmitting(true); // Set submitting state

    try {
      console.log('Sending data:', {
        ...formData,
        selectedSlot, // Make sure selectedSlot is passed
        selectedDate, // Include selectedDate if needed
        lineUserId, // Include the Line User ID in the submission
      });

      // Send booking data to the backend
      await axios.post(
        `${BASE_URL}/add-book-doctor-appointment-online`,
        {
          ...formData,
          selectedSlot, // Make sure selectedSlot is passed
          selectedDate, // Include selectedDate if needed
          lineUserId, // Automatically include lineUserId
        },
        {
          headers: HEADERS,
        }
      );

      // Update the number of bookings in the time slot
      await axios.put(
        `${BASE_URL}/update-time-slots/${formData.time_slot_id}`,
        {
          booked_appointments: selectedSlot.booked_appointments + 1,
        },
        {
          headers: HEADERS,
        }
      );

      // setSuccessMessage('การจองเสร็จสมบูรณ์! คุณจะได้รับข้อความยืนยันใน LINE ของคุณ'); // Show success message
      alert("การจองเสร็จสมบูรณ์! คุณจะได้รับข้อความยืนยันใน LINE ของคุณ")
      setIsSubmitting(false); // Reset submitting state
      onClose(); // Close the form
    } catch (error) {
      console.error('Error during booking:', error.response?.data || error.message);
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="booking-form">
      <h2>ฟอร์มการจอง</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ชื่อ:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          นามสกุล:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          อีเมล:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          เบอร์โทร:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          เลขบัตรประชาชน:
          <input
            type="text"
            name="citizenId"
            value={formData.citizenId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          โรงพยาบาล:
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          หมายเหตุ:
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </label>

        <p>วันที่ที่เลือก: {selectedDate}</p>
        <p>ช่วงเวลาที่เลือก: {selectedSlot.time_slot}</p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังยืนยันการจอง...' : 'ยืนยันการจอง'}
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>} {/* Show success message */}
      </form>
    </div>
  );
};

export default BookingForm;
