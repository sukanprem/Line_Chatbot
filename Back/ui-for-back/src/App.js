import React, { useState, useEffect } from 'react';
import { Table, message, Spin, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API
  const fetchHealthCheckResults = async () => {
    setLoading(true); // แสดง Spin ขณะดึงข้อมูล
    try {
      const response = await axios.get('http://localhost:3001/health-check-result');
      setData(response.data);
      setLoading(false); // หยุดแสดง Spin
    } catch (error) {
      message.error('Error fetching health check results');
      setLoading(false); // หยุดแสดง Spin แม้ว่าจะเกิดข้อผิดพลาด
    }
  };

  // ดึงข้อมูลเมื่อคอมโพเนนต์โหลดครั้งแรก
  useEffect(() => {
    fetchHealthCheckResults();
  }, []);

  // คอลัมน์ของตาราง
  const columns = [
    {
      title: 'Document ID',
      dataIndex: 'id',
      key: 'id'
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
      title: 'moreDetails',
      dataIndex: 'moreDetails',
      key: 'moreDetails',
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
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Health Check Results</h1>
      <Button
        type="primary"
        onClick={() => navigate('/create-health-check')}
        style={{ marginBottom: '20px' }}
      >
        Create
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id" // กำหนดคีย์เป็น id สำหรับตาราง
        />
      )}
    </div>
  );
};

export default App;
