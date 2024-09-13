// Back\ui-for-back\src\App.js

import React, { useState, useEffect } from 'react';
import { Table, message, Spin, Button, Popconfirm } from 'antd'; // เพิ่ม Popconfirm เพื่อให้ผู้ใช้ยืนยันการลบ
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'

const App = () => {
  const [healthCheckData, setHealthCheckData] = useState([]); // State สำหรับข้อมูลผลสุขภาพ
  const [appointmentData, setAppointmentData] = useState([]); // State สำหรับข้อมูลการจองพบแพทย์ออนไลน์
  const [subscriptionsData, setSubscriptions] = useState([]); // State สำหรับข้อมูลการติดตามผลสุขภาพ
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชัน logout ที่คุณต้องการเพิ่ม
  const logout = () => {
    localStorage.removeItem('isAuthenticated'); // ลบสถานะการล็อกอินจาก localStorage
    navigate('/login'); // Redirect ไปที่หน้า login
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API ของ healthCheckResults
  const fetchHealthCheckResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/health-check-result');
      setHealthCheckData(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching health check results');
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API ของ BookDoctorAppointmentOnline
  const fetchBookDoctorAppointmentOnline = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/book-doctor-appointment-online');
      setAppointmentData(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching book doctor appointments');
      console.log(error);
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API ของ Subscriptions
  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/subscribe');
      setSubscriptions(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching subscriptions');
      setLoading(false);
    }
  }

  // ฟังก์ชันสำหรับลบข้อมูล health check result
  const deleteHealthCheckResult = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete-health-check-result/${id}`);
      message.success('Health check result deleted successfully');
      setHealthCheckData(healthCheckData.filter(item => item.id !== id));
    } catch (error) {
      message.error('Error deleting health check result');
    }
  };

  // ฟังก์ชันสำหรับลบข้อมูล book doctor appointment
  const deleteBookDoctorAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete-book-doctor-appointment-online/${id}`);
      message.success('Book doctor appointment deleted successfully');
      setAppointmentData(appointmentData.filter(item => item.id !== id));
    } catch (error) {
      message.error('Error deleting book doctor appointment');
    }
  };

  // ฟังก์ชันสำหรับลบข้อมูล subscriptions
  const deleteSubscriptions = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/delete-subscribe/${id}`);
      message.success('Subscriptions deleted successfully');
      setSubscriptions(subscriptionsData.filter(item => item.id !== id));
    } catch (error) {
      message.error('Error deleting subscriptions');
    }
  };

  // ดึงข้อมูลเมื่อคอมโพเนนต์โหลดครั้งแรก
  useEffect(() => {
    fetchHealthCheckResults();
    fetchBookDoctorAppointmentOnline();
    fetchSubscriptions();
  }, []);

  // คอลัมน์ของตารางสำหรับ Health Check Results
  const healthCheckColumns = [
    {
      title: 'Document ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Citizen ID',
      dataIndex: 'citizenId',
      key: 'citizenId'
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Height (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      key: 'bmi',
    },
    {
      title: 'Pulse Rate (bpm)',
      dataIndex: 'pulseRate',
      key: 'pulseRate',
    },
    {
      title: 'Temperature (C)',
      dataIndex: 'temperature',
      key: 'temperature',
    },
    {
      title: 'Oxygen Level (%)',
      dataIndex: 'oxygenLevel',
      key: 'oxygenLevel',
    },
    {
      title: 'Respiration Rate',
      dataIndex: 'respirationRate',
      key: 'respirationRate',
    },
    {
      title: 'Meal Time',
      dataIndex: 'mealTime',
      key: 'mealTime',
    },
    {
      title: 'Fasting Time',
      dataIndex: 'fastingTime',
      key: 'fastingTime',
    },
    {
      title: 'Fasting Blood Sugar (mg/dl)',
      dataIndex: 'fastingBloodSugar',
      key: 'fastingBloodSugar',
    },
    {
      title: 'More Details',
      dataIndex: 'moreDetails',
      key: 'moreDetails',
      render: (moreDetails) => (
        <div>
          {Array.isArray(moreDetails) && moreDetails.map((detail, index) => (
            <div key={index}>{detail}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'Blood Pressure (mmHg.)',
      dataIndex: 'bloodPressure',
      key: 'bloodPressure',
    },
    {
      title: 'Hospital',
      dataIndex: 'hospital',
      key: 'hospital',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div /* style={{ display: 'flex', gap: '8px' }} */ className='display-flex gap-8-px'>
          <Button
            type="primary"
            onClick={() => navigate(`/update-health-check-result/${record.id}`)}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this health check result?"
            onConfirm={() => deleteHealthCheckResult(record.id)} // เรียกฟังก์ชันลบเมื่อผู้ใช้ยืนยัน
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // คอลัมน์ของตารางสำหรับ Book Doctor Appointment
  const appointmentColumns = [
    {
      title: 'Document ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Citizen ID',
      dataIndex: 'citizenId',
      key: 'citizenId'
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Health Plan',
      dataIndex: 'healthPlan',
      key: 'healthPlan',
    },
    {
      title: 'Hospital',
      dataIndex: 'hospital',
      key: 'hospital',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div /* style={{ display: 'flex', gap: '8px' }} */ className='display-flex gap-8-px'>
          <Button
            type="primary"
            onClick={() => navigate(`/update-book-doctor-appointment/${record.id}`)}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this appointment?"
            onConfirm={() => deleteBookDoctorAppointment(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // คอลัมน์ของตารางสำหรับ Subscriptions
  const subscriptionColumns = [
    {
      title: 'Document ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Line User Id',
      dataIndex: 'lineUserId',
      key: 'lineUserId'
    },
    {
      title: 'Health Check Result ID',
      dataIndex: 'healthCheckResultId',
      key: 'healthCheckResultId'
    },
    {
      title: 'Notification Type',
      dataIndex: 'notificationType',
      key: 'notificationType'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div /* style={{ display: 'flex', gap: '8px' }} */ className='display-flex gap-8-px'>
          <Button
            type="primary"
            onClick={() => navigate(`/update-subscriptions/${record.id}`)}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this subscriptions?"
            onConfirm={() => deleteSubscriptions(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div /* style={{ padding: '20px' }} */ className='padding-20-px'>
      <Button type="primary" onClick={logout} style={{ float: 'right' }}>Logout</Button> {/* ปุ่ม Logout */}
      
      <h1>Health Check Results</h1>
      {/* เพิ่มปุ่ม Create */}
      <Button
        type="primary"
        onClick={() => navigate('/create-health-check')}
        // style={{ marginBottom: '20px' }}
        className='margin-bottom-20-px'
      >
        Create
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={healthCheckData}
          columns={healthCheckColumns}
          rowKey="id" // กำหนดคีย์เป็น id สำหรับตาราง
          // style={{ marginBottom: '40px' }}
          className='margin-bottom-40-px'
        />
      )}
      <h1>Book Doctor Appointments</h1>
      <Button
        type="primary"
        onClick={() => navigate('/create-book-doctor-appointment')}
        // style={{ marginBottom: '20px' }}
        className='margin-bottom-20-px'
      >
        Create Appointment
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={appointmentData}
          columns={appointmentColumns}
          rowKey="id"
          className='margin-bottom-40-px'
        />
      )}
      <h1>Subscriptions</h1>
      <Button
        type='primary'
        onClick={() => navigate('/create-subscriptions')}
        // style={{ marginBottom: '20px' }}
        className='margin-bottom-20-px'
      >
        Create Subscriptions
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={subscriptionsData}
          columns={subscriptionColumns}
          rowKey="id"
          className='margin-bottom-40-px'
        />
      )}
    </div>
  );
};

export default App;
