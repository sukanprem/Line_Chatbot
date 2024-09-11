import React, { useState } from 'react';
import { Form, Input, Button, message, /*Radio, Space, */DatePicker, TimePicker } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './BookDoctorAppointmentOnline.css'

const CreateBookDoctorAppointmentOnline = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
    };

    const onChangeTime = (time, timeString) => {
        console.log(time, timeString);
    };

    const onFinish = async (values) => {
        try {
            await axios.post('http://localhost:3001/add-book-doctor-appointment-online', values);
            message.success('Book doctor appointment online added successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากเพิ่มสำเร็จ
        } catch (error) {
            message.error('Error adding book doctor appointment online');
            setLoading(false);
        }
    };

    return (
        <create>
            <div
                // style={{ padding: '20px' }}
                className='padding-20-px'
            >
                <h1>Add Book Doctor Appointment Online</h1>
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
                        label="Health Plan"
                        name="healthPlan"
                        rules={[{ required: true, message: 'Please input health plan name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hospital"
                        name="hospital"
                        rules={[{ required: true, message: 'Please input hospital name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Doctor"
                        name="doctor"
                        rules={[{ required: true, message: 'Please input doctor name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="department"
                        rules={[{ required: true, message: 'Please input department name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please input date!' }]}
                    >
                        {/* <Space direction="vertical"> */}
                        <DatePicker onChange={onChangeDate} />
                        {/* </Space> */}
                    </Form.Item>

                    <Form.Item
                        label="Time"
                        name="time"
                        rules={[{ required: true, message: 'Please input time!' }]}
                    >
                        <TimePicker onChange={onChangeTime} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </create>
    );
};

export default CreateBookDoctorAppointmentOnline;
