import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, /* Space, */DatePicker, TimePicker } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { BASE_URL, HEADERS } from '../Global/config'
import { useNavigate } from 'react-router-dom';
// import './BookDoctorAppointmentOnline.css'

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
            await axios.post(`${BASE_URL}/add-book-doctor-appointment-online`, values, {
                headers: HEADERS
            });
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
                        label="First Name"
                        name="firstName"
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
                        label="Citizen ID"
                        name="citizenId"
                        rules={[{ required: true, message: 'Please input citizen id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input phone!' }]}
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
                        label="Doctor ID"
                        name="doctor_id"
                        rules={[{ required: true, message: 'Please input doctor id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please input status!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Created at"
                        name="created_at"
                        rules={[{ required: true, message: 'Please input created at!' }]}
                    >
                        {/* <Space direction="vertical"> */}
                        <TimePicker onChange={onChangeTime} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                        {/* </Space> */}
                    </Form.Item>

                    <Form.Item
                        label="Updated at"
                        name="updated_at"
                        rules={[{ required: true, message: 'Please input created at!' }]}
                    >
                        {/* <Space direction="vertical"> */}
                        <TimePicker onChange={onChangeTime} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                        {/* </Space> */}
                    </Form.Item>

                    <Form.Item
                        label="Time slot id"
                        name="time_slot_id"
                        rules={[{ required: true, message: 'Please input time_slot_id!' }]}
                    >
                        <Radio.Group>
                            <Radio value="8DLgwUhm2CTjrcP0zDh1">09:00 - 10:30</Radio>
                            <Radio value="JCeaR5CnuzDzFMylrg4G">10:30 - 12:00</Radio>
                            <Radio value="gPWvqM7cgPIPbUzDweuE">13:00 - 14:30</Radio>
                            <Radio value="blbzfMhBDEE8zPaQYhoS">14:30 - 16:00</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        name="notes"
                    // rules={[{ required: true, message: 'Please input notes!' }]}
                    >
                        {/* <TimePicker onChange={onChangeTime} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} /> */}
                        <Input />
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
