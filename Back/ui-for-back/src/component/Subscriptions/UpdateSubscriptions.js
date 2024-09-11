import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Space } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './Subscriptions.css'

const UpdateSubscriptions = () => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // ดึง id จาก URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/subscribe/${id}`);
                form.setFieldsValue(response.data); // ตั้งค่าในฟอร์ม
                setLoading(false);
            } catch (error) {
                message.error('Error fetching subscriptions');
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:3001/update-subscribe/${id}`, values);
            message.success('Subscriptions updated successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากอัปเดตสำเร็จ
        } catch (error) {
            message.error('Error updating subscriptions');
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Update Subscriptions</h1>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Line User ID"
                        name="lineUserId"
                    // rules={[{ required: true, message: 'Please input line user id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Health Check Result ID"
                        name="healthCheckResultId"
                    // rules={[{ required: true, message: 'Please input health check result id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Notification Type"
                        name="notificationType"
                    // rules={[{ required: true, message: 'Please input notification type!' }]}
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
    )

};

export default UpdateSubscriptions;
