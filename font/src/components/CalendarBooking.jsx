import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarBooking.css';
import Modal from 'react-modal';
import BookingForm from './BookingForm'; // นำเข้าคอมโพเนนต์ BookingForm
import { BASE_URL, HEADERS } from '../Global/config';
import { useParams } from 'react-router-dom';
const localizer = momentLocalizer(moment);

const CalendarBooking = () => {
  const queryParameters = new URLSearchParams(window.location.search)
  const code = queryParameters.get("code")
  const localLineID = localStorage.getItem("lineUserID") || null
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bookingFormIsOpen, setBookingFormIsOpen] = useState(false); // ติดตามการแสดงฟอร์มการจอง
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [lineUserID, setLineUserID] = useState(localLineID)
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-all-dates-with-time-slots`, {
          method: 'GET',
          headers: HEADERS
        });

        const data = await response.json();
        // console.log("[FETCH]:", data)

        setTimeSlots(data);
      } catch (error) {
        // console.error('เกิดข้อผิดพลาดในการดึงข้อมูลการนัดหมาย:', error);
        console.log(error)
      }
    };

    fetchTimeSlots();
  }, []);

  const getLineUserID = async () => {
    try {
      console.log("Code:", code)
      if (!code) {
        // alert("Code not define")
        return;
        // throw "error"
      }
      const url = `${BASE_URL}/get-line-profile-for-booked?code=${encodeURIComponent(code)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: HEADERS
      })


      console.log("FETCH:", response);

      if (!response.ok) {
        throw new Error('Failed to fetch user ID');
      }

      const data = await response.json(); // Assuming the response is in JSON format
      setLineUserID(data?.userId)
      localStorage?.setItem("lineUserID", data?.userId)
      // console.log("User Data:", data);

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchDatesStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dates`, { // เรียก API /dates
          method: 'GET',
          headers: HEADERS
        });
  
        const data = await response.json();
        setHolidays(data); // เก็บข้อมูลวันที่และสถานะ
      } catch (error) {
        console.error('Error fetching dates status:', error);
      }
    };
  
    fetchDatesStatus();
  }, []);

  useEffect(() => {
    if (!lineUserID) {
      getLineUserID()
    }
  }, [])

  // useEffect(() => {
  //   const calendar = document.querySelector('.calendar-date');
  //   calendar && calendar.offsetHeight; // บังคับให้ปฏิทินรีเฟรช
  // }, [selectedDate]); // Effect นี้จะทำงานเมื่อวันที่หรือเดือนเปลี่ยนไป
  
  useEffect(() => { console.log("ID:", lineUserID) }, [lineUserID])

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
  
    // ถ้าเลือกวันที่ผ่านไปแล้ว จะไม่อนุญาตให้จอง
    if (moment(date).isBefore(today)) {
      return;
    }
  
    // ค้นหา slot ในวันที่เลือก
    const selectedDaySlots = timeSlots.find(
      (slot) => moment(slot.date).format('YYYY-MM-DD') === date
    );
  
    // ตรวจสอบว่ามี slot ในวันนั้นไหม
    if (selectedDaySlots) {
      const allTimeSlotsFull = selectedDaySlots.timeSlots.every(
        (timeSlot) => timeSlot.booked_appointments >= timeSlot.max_appointments
      );
  
      // ถ้าคิวเต็มทั้งหมด ไม่ให้เปิดโมดอล
      if (allTimeSlotsFull) {
        alert('วันที่เลือกนี้ไม่สามารถจองได้');
        return;
      }
  
      setSelectedDate(date);
  
      const sortedSlots = selectedDaySlots.timeSlots.sort((a, b) => {
        const timeA = moment(a.time_slot.split(' - ')[0], 'HH:mm');
        const timeB = moment(b.time_slot.split(' - ')[0], 'HH:mm');
        return timeA - timeB;
      });
  
      setAvailableSlots(sortedSlots);
      setModalIsOpen(true);
    } else {
      alert('วันที่เลือกนี้ไม่มีการจองคิว');
    }
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    const slotElements = document.querySelectorAll('.slot');
    slotElements.forEach((el) => {
      el.classList.remove('selected'); // ลบคลาสที่เลือกจากทุกๆ slot
    });

    const selectedElement = document.querySelector(`li[data-slot="${slot.time_slot}"]`);
    if (selectedElement) {
      selectedElement.classList.add('selected'); // เพิ่มคลาสให้กับ slot ที่เลือก
    }
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

    // const isHolidays = holidays.some(
    //   (holiday) => moment(holiday.date).format('YYYY-MM-DD') === dateValue.format('YYYY-MM-DD')
    // );

    const isWeekend = dateValue.day() === 0 || dateValue.day() === 6;
    const isPastDate = dateValue.isBefore(today);

    const isFull = timeSlots.some((slot) => {
      const sameDate = moment(slot.date).format('YYYY-MM-DD') === dateValue.format('YYYY-MM-DD');
      const allTimeSlotsFull = slot.timeSlots.every(
        (timeSlot) => timeSlot.booked_appointments >= timeSlot.max_appointments
      );
      return sameDate && allTimeSlotsFull;
    });
    // ค้นหาสถานะของวันจากข้อมูลที่ได้จาก API
    const selectedDay = holidays.find(
    (day) => moment(day.date).format('YYYY-MM-DD') === dateValue.format('YYYY-MM-DD')
  );

    let className = '';
    if (isWeekend || isPastDate) {
      className = 'rbc-date-cell black'; // วันเสาร์-อาทิตย์เป็นสีดำ
    } else if (selectedDay?.status === 'Public holiday') {
      className = 'rbc-date-cell gray'; // วันหยุดราชการเป็นสีเทา
    } else if (isFull) {
      className = 'rbc-date-cell red'; // วันทำการเป็นสีเเดง
    } else if (selectedDay?.status === 'Opening day') {
      className = 'rbc-date-cell green'; // วันทำการเป็นสีเขียว
    } else {
      className = 'rbc-date-cell green'; // ถ้าวันอื่น ๆ ก็เป็นสีเขียว
    }
    const dayNumber = moment(value).date();
    
    return <div className={className}>{dayNumber}</div>;
  };

  return (
    <div className="PatientForm-01" /* onClick={console.log("ID:", lineUserID)}*/ >

      <h2>ปฏิทินการจองคิวหมอ</h2>
      <Calendar
        className="calendar-date calendar-grid"
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        defaultDate={new Date()}
        style={{ height: '50vh', maxWidth: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        views={['month']}
        components={{
          dateCellWrapper,
        }}
      />
      <div className="legend">
        <h3>รายละเอียดของวันในการใช้บริการ</h3> {/* เพิ่มหัวข้อด้านบน */}
        <p><span className="red-dot"></span> สีแดง: จำนวนคิวเต็มในการใช้บริการ</p>
        <p><span className="green-dot"></span> สีเขียว: จำนวนคิวว่างในการใช้บริการ</p>
        <p><span className="gray-dot"></span> สีเทา: วันหยุดราชการ</p>
        <p><span className="black-dot"></span> สีดำ: วันไม่มีบริการจองคิวในการใช้บริการ</p>
      </div>
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
              data-slot={slot.time_slot} // เพิ่ม data-slot
              onClick={() => handleSlotSelect(slot)}
            >
              {slot.time_slot}
            </li>
          ))}
        </ul>
        <button className="button-confirm" onClick={confirmBooking}>จองเวลานี้</button>
        <button className="modal-button" onClick={closeModal}>ปิด</button>
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
          lineUserId={lineUserID}
        />
      </Modal>
    </div>
  );
};

export default CalendarBooking;
