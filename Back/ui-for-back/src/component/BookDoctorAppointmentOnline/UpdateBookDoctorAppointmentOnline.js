import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, DatePicker, TimePicker, Spin } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
// import './BookDoctorAppointmentOnline.css'

const UpdateBookDoctorAppointmentOnline = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // ดึง id จาก URL
    const navigate = useNavigate();

    // ฟังก์ชันสำหรับแปลงค่าที่เลือกใน DatePicker และ TimePicker
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

                // แยก date และ time ออกมาเพราะต้องแปลงเป็น dayjs object
                const { date, time, ...rest } = response.data;

                // แปลง date และ time เป็น dayjs ก่อนตั้งค่าในฟอร์ม
                form.setFieldsValue({
                    ...rest,
                    date: date ? dayjs(date, 'YYYY-MM-DD') : null,
                    time: time ? dayjs(time, 'HH:mm') : null
                });
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
            <div
                // style={{ padding: '20px' }}
                className='padding-20-px'
            >
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
                            label="First Name"
                            name="firstName"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Last Name"
                            name="lastName"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Citizen ID"
                            name="citizenId"
                        // rules={[{ required: true, message: 'Please input citizen id!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Hospital"
                            name="hospital"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Doctor ID"
                            name="doctor_id"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="status"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Notes"
                            name="notes"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Created at"
                            name="created_at"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Updated at"
                            name="updated_at"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update
                            </Button>
                        </Form.Item>

                    </Form>
                )}
            </div>
    );
};

export default UpdateBookDoctorAppointmentOnline;
