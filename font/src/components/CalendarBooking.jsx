import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarBooking.css'; // นำเข้าการปรับแต่ง CSS

const localizer = momentLocalizer(moment);

const CalendarBooking = () => {
  const [bookedDates, setBookedDates] = useState([
    new Date(2024, 8, 20), // วันที่จองเต็ม
    new Date(2024, 8, 21), // วันที่จองเต็ม
  ]);

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format('YYYY-MM-DD');
    alert(`จองคิววันที่: ${selectedDate}`);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const isFull = bookedDates.some(
      (date) => moment(date).format('YYYY-MM-DD') === moment(start).format('YYYY-MM-DD')
    );

    const style = {
      backgroundColor: isFull ? 'red' : 'green',
      color: 'white',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
    };

    return {
      style,
    };
  };

  const dateCellWrapper = ({ value }) => {
    const isFull = bookedDates.some(
      (date) => moment(date).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')
    );
    const className = isFull ? 'rbc-date-cell red' : 'rbc-date-cell green';
    return <div className={className}>{moment(value).date()}</div>;
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
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        views={['month']}
        components={{
          dateCellWrapper,
        }}
      />
    </div>
  );
};

export default CalendarBooking;
