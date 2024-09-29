import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Space, Radio } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { BASE_URL, HEADERS } from '../Global/config';

const UpdateTimeSlots = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // ดึง id จาก URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTimeSlots = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/time-slots/${id}`, {
                    headers: HEADERS
                });
                form.setFieldsValue(response.data); // ตั้งค่าในฟอร์ม
                setLoading(false);
            } catch (error) {
                message.error('Error fetching time slots');
                setLoading(false);
            }
        };

        fetchTimeSlots();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/update-time-slots/${id}`, {
                headers: HEADERS
            });
            message.success('Time slots updated successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากอัปเดตสำเร็จ
        } catch (error) {
            message.error('Error updating time slots');
            setLoading(false);
        }
    };

    return (
        <div
            /* style={{ padding: '20px' }} */
            className='padding-20-px'
        >
            <h1>Update Time Slots</h1>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Date id"
                        name="date_id"
                    // rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Time slot"
                        name="time_slot"
                    // rules={[{ required: true, message: 'Please input full name!' }]}
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
                    // rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input type='number' />
                    </Form.Item>
                    <Form.Item
                        label="Booked appointments"
                        name="booked_appointments"
                    // rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input type='number' />
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

export default UpdateTimeSlots;