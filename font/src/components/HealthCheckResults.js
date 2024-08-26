// src/components/HealthCheckResults.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HealthCheckResults = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/health-check-result');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Health Check Results</h2>
      <p>น้ำหนัก: {data.weight || 'N/A'}</p>
      <p>ส่วนสูง: {data.height || 'N/A'}</p>
      <p>ชีพจร: {data.pulseRate || 'N/A'}</p>
      <p>อุณหภูมิ: {data.temperature || 'N/A'}</p>
      <p>ออกซิเจนในเลือด: {data.oxygenLevel || 'N/A'}</p>
      <p>อัตราการหายใจ: {data.respirationRate || 'N/A'}</p>
      <p>น้ำตาลในเลือด: {data.fastingBloodSugar || 'N/A'}</p>
      <p>เวลาที่เจาะ: {data.mealTime || 'N/A'}</p>
      <p>ช่วงเวลาที่เจาะ: {data.fastingTime || 'N/A'}</p>
      <p>ค่าน้ำตาลในเลือด: {data.fastingBloodSugar || 'N/A'}</p>
      <p>ขาบวม: {data.moreDetails || 'N/A'}</p>
      <p>เหนื่อย: {data.moreDetails || 'N/A'}</p>
      <p>นอนราบ: {data.moreDetails || 'N/A'}</p>
      <p>BMI: {data.bmi ? data.bmi.toFixed(2) : 'N/A'}</p>
      <p>ความดันโลหิต: {data.bloodPressure || 'N/A'}</p>
    </div>
  );
};

export default HealthCheckResults;
