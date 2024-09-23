import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarBooking.css'; 
import Modal from 'react-modal';
import BookingForm from './BookingForm'; // นำเข้าคอมโพเนนต์ BookingForm
import { BASE_URL, HEADERS } from '../Global/config';

const localizer = momentLocalizer(moment);

const CalendarBooking = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bookingFormIsOpen, setBookingFormIsOpen] = useState(false); // ติดตามการแสดงฟอร์มการจอง
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-all-dates-with-time-slots`, {
          method: 'GET',
          headers: HEADERS
        });
        
        const data = await response.json();
        console.log("[FETCH]:", data)

        setTimeSlots(data);
      } catch (error) {
        // console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการนัดหมาย:', error);
        console.log(error)      }
    };

    fetchTimeSlots();
  }, []);

  // useEffect(() => {
  //   const fetchHolidays = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://holidayapi.com/v1/holidays?key=YOUR_API_KEY&country=TH&year=2023'
  //       );
  //       const data = await response.json();
  //       setHolidays(data.holidays);
  //     } catch (error) {
  //       console.error('เกิดข้อผิดพลาดในการดึงวันหยุด:', error);
  //     }
  //   };

  //   fetchHolidays();
  // }, []);

  const handleSelectSlot = (slotInfo) => {
    const date = moment(slotInfo.start).format('YYYY-MM-DD');
    const today = moment().startOf('day');

    if (moment(date).isBefore(today)) {
    //   alert('ไม่สามารถจองวันก่อนหน้านี้ได้');
      return;
    }

    const selectedDaySlots = timeSlots.find(
      (slot) => moment(slot.date).format('YYYY-MM-DD') === date
    );

    console.log("SLOT:", selectedDaySlots)

    if (selectedDaySlots && selectedDaySlots.timeSlots.length > 0) {
      setSelectedDate(date);

      const sortedSlots = selectedDaySlots.timeSlots.sort((a, b) => {
        const timeA = moment(a.time_slot.split(' - ')[0], 'HH:mm');
        const timeB = moment(b.time_slot.split(' - ')[0], 'HH:mm');
        return timeA - timeB;
      });

      setAvailableSlots(sortedSlots);
      setModalIsOpen(true);
    } else {
      alert('วันที่เลือกนี้ไม่สามารถจองได้');
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot); 
  };

  const confirmBooking = () => {
    if (selectedSlot) {
      setModalIsOpen(false); // ปิดโมดัล
      setBookingFormIsOpen(true); // เปิดฟอร์มการจอง
    } else {
      alert('กรุณาเลือกช่วงเวลาที่ต้องการจอง');
    }
  };

  const closeBookingForm = () => {
    setBookingFormIsOpen(false);
  };

  const dateCellWrapper = ({ value }) => {
    const today = moment().startOf('day');
    const dateValue = moment(value).startOf('day');

    const isHolidays = holidays.some(
      (holiday) => moment(holiday.date).format('YYYY-MM-DD') === dateValue.format('YYYY-MM-DD')
    );

    const isWeekend = dateValue.day() === 0 || dateValue.day() === 6;
    const isPastDate = dateValue.isBefore(today);

    const isFull = timeSlots.some((slot) => {
      const sameDate = moment(slot.date).format('YYYY-MM-DD') === dateValue.format('YYYY-MM-DD');
      const allTimeSlotsFull = slot.timeSlots.every(
        (timeSlot) => timeSlot.booked_appointments >= timeSlot.max_appointments
      );
      return sameDate && allTimeSlotsFull;
    });

    let className = '';
    if (isHolidays) {
      className = 'rbc-date-cell gray'; 
    } else if (isWeekend) {
      className = 'rbc-date-cell black'; 
    } else if (isFull) {
      className = 'rbc-date-cell red'; 
    } else if (isPastDate) {
      className = 'rbc-date-cell black'; 
    } else {
      className = 'rbc-date-cell green'; 
    }

    const dayNumber = moment(value).date();

    return <div className={className}>{dayNumber}</div>;
  };

  return (
    <div className="PatientForm-01">
      <h2>ปฏิทินการจองคิวหมอ</h2>
      <Calendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        defaultDate={new Date()}
        style={{ height: '80vh', maxWidth: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        views={['month']}
        components={{
          dateCellWrapper,
        }}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Available Slots"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <h2>เลือกช่วงเวลา</h2>
        <ul>
          {availableSlots.map((slot) => (
            <li
              key={slot.time_slot}
              className={slot.booked_appointments >= slot.max_appointments ? 'slot booked' : 'slot available'}
              onClick={() => handleSlotSelect(slot)}
            >
              {slot.time_slot}
            </li>
          ))}
        </ul>
        <button onClick={confirmBooking}>จะเอาเวลานี้</button>
        <button onClick={closeModal}>ปิด</button>
      </Modal>
      <Modal
        isOpen={bookingFormIsOpen}
        onRequestClose={closeBookingForm}
        contentLabel="Booking Form"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <BookingForm 
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          onClose={closeBookingForm}
        />
      </Modal>
    </div>
  );
};

export default CalendarBooking;
