import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, /*Radio, Space, */DatePicker, TimePicker, Spin } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const UpdateBookDoctorAppointmentOnline = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // ดึง id จาก URL
    const navigate = useNavigate();

    const onChangeDate = (date, dateString) => {
        console.log(date, dateString);
    };

    const onChangeTime = (time, timeString) => {
        console.log(time, timeString);
    };

    useEffect(() => {
        const fetchBookDoctorAppointmentOnline = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/book-doctor-appointment-online/${id}`);
                form.setFieldValue(response.data); // ตั้งค่าในฟอร์ม
                setLoading(false);
            } catch (error) {
                message.error('Error fetching book doctor appointment online');
                setLoading(false);
            }
        };

        fetchBookDoctorAppointmentOnline();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:3001/update-book-doctor-appointment-online/${id}`, values);
            message.success('Book doctor appointment online updated successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากอัปเดตสำเร็จ
        } catch (error) {
            message.error('Error updating book doctor appointment online');
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Update Book Doctor Appointment Online</h1>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                    // rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                    // rules={[{ required: true, message: 'Please input last name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Health Plan"
                        name="healthPlan"
                    // rules={[{ required: true, message: 'Please input health plan name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hospital"
                        name="hospital"
                    // rules={[{ required: true, message: 'Please input hospital name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Doctor"
                        name="doctor"
                    // rules={[{ required: true, message: 'Please input doctor name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="department"
                    // rules={[{ required: true, message: 'Please input department name!' }]}
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
                        // rules={[{ required: true, message: 'Please input time!' }]}
                    >
                        <TimePicker onChange={onChangeTime} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update
                        </Button>
                    </Form.Item>

                </Form>
            )}
        </div>
    )
}

export default UpdateBookDoctorAppointmentOnline;