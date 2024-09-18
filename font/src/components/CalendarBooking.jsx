import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarBooking.css'; // นำเข้าการปรับแต่ง CSS
import Modal from 'react-modal'; // นำเข้าการใช้งาน Modal

const localizer = momentLocalizer(moment);



const CalendarBooking = () => {
  const [bookedDates, setBookedDates] = useState([
    new Date(2024, 8, 20), // วันที่จองเต็ม
    new Date(2024, 8, 21), // วันที่จองเต็ม
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const slots = {
    '2024-09-22': ['9:00-10:30', '10:30-12:00', '13:00-14:30', '14:30-16:00'],
    '2024-09-23': ['9:00-10:30', '10:30-12:00', '13:00-14:30', '14:30-16:00'],
    // เพิ่มวันที่และช่วงเวลาที่ว่างตามที่ต้องการ
  };
  const [appointments, setAppointments] = useState([]); // สร้าง state เพื่อเก็บข้อมูล

  useEffect(() => {
    // ฟังก์ชันสำหรับดึงข้อมูลจาก backend API
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3001/book-doctor-appointment-online'); // เรียกใช้ API
        const data = await response.json(); // แปลงผลลัพธ์เป็น JSON
        setAppointments(data); // เก็บข้อมูลใน state
      } catch (error) {
        console.error('Error fetching appointments:', error); // แสดงข้อผิดพลาดหากเกิดขึ้น
      }
    };

    fetchAppointments(); // เรียกใช้ฟังก์ชันเมื่อโหลดคอมโพเนนต์ครั้งแรก
  }, []);
   
  const [holidays, setHolidays] = useState([]);
  
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(
          'https://holidayapi.com/v1/holidays?key=3b850f6f-d9ad-42e0-a2f4-d4a8e755b733&country=TH&year=2024'
        );
        const data = await response.json();
        console.log(data); // ตรวจสอบข้อมูลที่ได้จาก API
        setHolidays(data.holidays); // เก็บข้อมูลใน state ถ้าใช้งานได้
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };
  
    fetchHolidays(); // ดึงข้อมูลเมื่อคอมโพเนนต์โหลดครั้งแรก
  }, []);
  useEffect(() => {
    console.log(holidays); // ตรวจสอบว่าข้อมูลถูกเก็บใน state อย่างถูกต้อง
  }, [holidays]);   

  const handleSelectSlot = (slotInfo) => {
    const date = moment(slotInfo.start).format('YYYY-MM-DD');
    const isFull = bookedDates.some(
      (bookedDate) => moment(bookedDate).format('YYYY-MM-DD') === date
    );
    
    if (isFull) {
      alert('วันที่เลือกนี้เต็มแล้ว! โปรดเลือกวันที่อื่น.');
      return;
    }

    setSelectedDate(date);
    setAvailableSlots(slots[date] || []);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // ปรับปรุงฟังก์ชัน dateCellWrapper
  const dateCellWrapper = ({ value }) => {
    const today = moment().startOf('day'); // กำหนดวันปัจจุบัน
    const dateValue = moment(value).startOf('day'); // กำหนดวันในปฏิทิน
    
    // ตรวจสอบว่าวันนั้นเป็นวันหยุดราชการหรือไม่
    const isHolidays = holidays.some(
        (holiday) => moment(holiday.date).format('YYYY-MM-DD') === dateValue.format('YYYY-MM-DD')
      );

    // ตรวจสอบว่าวันนั้นเป็นเสาร์หรืออาทิตย์หรือไม่
    const isWeekend = dateValue.day() === 0 || dateValue.day() === 6;

    // ตรวจสอบว่าวันนั้นเป็นวันที่ก่อนวันปัจจุบันหรือไม่
    const isPastDate = dateValue.isBefore(today);

    // ตรวจสอบว่าวันนั้นจองเต็มหรือไม่
    const isFull = bookedDates.some(
      (date) => moment(date).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')
    );
    
    // กำหนด class สำหรับวันหยุดราชการ, วันที่จองเต็ม, วันที่ว่าง และวันเสาร์-อาทิตย์
    let className = '';
    if (isHolidays) {
      className = 'rbc-date-cell gray'; // สีเทาสำหรับวันหยุดราชการ
    } else if (isFull) {
      className = 'rbc-date-cell red'; // สีแดงสำหรับวันที่จองเต็ม
    } else if (isWeekend || isPastDate) {
      className = 'rbc-date-cell black'; // สีดำสำหรับวันหยุดและวันที่อยู่ก่อนวันล่าสุด
    } else {
      className = 'rbc-date-cell green'; // สีเขียวสำหรับวันที่ยังว่าง
    }
    
    // แสดงเพียงตัวเลขของวันในปฏิทิน
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
        ariaHideApp={false} // ปิดการซ่อนแอพเพื่อทดสอบ
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            color: 'lightsteelblue',
          },
        }}
      >
        <h2>ช่วงเวลาที่ว่างสำหรับวันที่ {selectedDate}</h2>
        <ul>
          {availableSlots.length === 0 ? (
            <li>ไม่มีช่วงเวลาว่าง</li>
          ) : (
            availableSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))
          )}
        </ul>
        <button onClick={closeModal}>ปิด</button>
      </Modal>
      <ul>
            {holidays.map((holidays, index) => (
            <li key={index}>
                {holidays.name} - {moment(holidays.date).format('DD MMM YYYY')}
            </li>
            ))}
        </ul>
    </div>
  );
};

export default CalendarBooking;
