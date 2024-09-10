import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateHealthCheck = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/add-health-check-result', values);
      message.success('Health check result added successfully');
      setLoading(false);
      navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากเพิ่มสำเร็จ
    } catch (error) {
      message.error('Error adding health check result');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Health Check Result</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please input full name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please input last name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Weight (kg)"
          name="weight"
          rules={[{ required: true, message: 'Please input weight!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Height (cm)"
          name="height"
          rules={[{ required: true, message: 'Please input height!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Pulse Rate"
          name="pulseRate"
          rules={[{ required: true, message: 'Please input pulse rate!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Temperature"
          name="temperature"
          rules={[{ required: true, message: 'Please input temperature!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Oxygen Level"
          name="oxygenLevel"
          rules={[{ required: true, message: 'Please input oxygen level!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Respiration Rate"
          name="respirationRate"
          rules={[{ required: true, message: 'Please input respiration rate!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Meal Time"
          name="mealTime"
          rules={[{ required: true, message: 'Please input meal time!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Fasting Time"
          name="fastingTime"
          rules={[{ required: true, message: 'Please input fasting time!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Fasting Blood Sugar"
          name="fastingBloodSugar"
          rules={[{ required: true, message: 'Please input fasting blood sugar!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Blood Pressure"
          name="bloodPressure"
          rules={[{ required: true, message: 'Please input blood pressure!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hospital"
          name="hospital"
          rules={[{ required: true, message: 'Please input hospital!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateHealthCheck;
