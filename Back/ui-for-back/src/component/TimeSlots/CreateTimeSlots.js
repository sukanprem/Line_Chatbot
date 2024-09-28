import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, HEADERS } from '../Global/config';

const CreateTimeSlots = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/add-time-slots`, values, {
                headers: HEADERS
            });
            message.success('Time slots added successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากเพิ่มสำเร็จ
        } catch (error) {
            message.error('Error adding time slots');
            setLoading(false);
        }
    }

    return (
        <div /* style={{ padding: '20px' }} */ className='padding-20-px'>
            <h1>Add Time Slots</h1>
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Date id"
                    name="date_id"
                    rules={[{ required: true, message: 'Please input date!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Time slot"
                    name="time_slot"
                    rules={[{ required: true, message: 'Please select meal time!' }]}
                >
                    <Radio.Group>
                        <Radio value="09:00 - 10:30">09:00 - 10:30</Radio>
                        <Radio value="10:30 - 12:00">10:30 - 12:00</Radio>
                        <Radio value="13:00 - 14:30">13:00 - 14:30</Radio>
                        <Radio value="14:30 - 16:00">14:30 - 16:00</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Max appointments"
                    name="max_appointments"
                    rules={[{ required: true, message: 'Please select meal time!' }]}
                >
                    <Input type='number' />
                </Form.Item>
                <Form.Item
                    label="Booked appointments"
                    name="booked_appointments"
                    rules={[{ required: true, message: 'Please select meal time!' }]}
                >
                    <Input type='number' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CreateTimeSlots;