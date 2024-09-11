import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './Subscriptions.css'

const CreateSubscriptions = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/add-subscribe', values);
            message.success('Subscriptions added successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากเพิ่มสำเร็จ
        } catch (error) {
            message.error('Error adding subscriptions');
            setLoading(false);
        }
    };

    return (
        <create>
            <div 
            // style={{ padding: '20px' }}
            className='padding-20-px'
            >
                <h1>Add Subscriptions</h1>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Line User ID"
                        name="lineUserId"
                        rules={[{ required: true, message: 'Please input line user id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Health Check Result ID"
                        name="healthCheckResultId"
                        rules={[{ required: true, message: 'Please input health check result id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Notification Type"
                        name="notificationType"
                        rules={[{ required: true, message: 'Please input notification type!' }]}
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
        </create>
    )
};

export default CreateSubscriptions;
