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
        <update>
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
                            label="Full Name"
                            name="fullName"
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
                            label="Health Plan"
                            name="healthPlan"
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
                            label="Doctor"
                            name="doctor"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Department"
                            name="department"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Date"
                            name="date"
                        // rules={[{ required: true, message: 'Please input date!' }]}
                        >
                            <DatePicker onChange={onChangeDate} />
                        </Form.Item>

                        <Form.Item
                            label="Time"
                            name="time"
                        >
                            <TimePicker
                                onChange={onChangeTime}
                                format="HH:mm"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update
                            </Button>
                        </Form.Item>

                    </Form>
                )}
            </div>
        </update>
    );
};

export default UpdateBookDoctorAppointmentOnline;
