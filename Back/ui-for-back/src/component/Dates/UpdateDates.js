import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Space } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const UpdateDates = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // ดึง id จาก URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDates = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3001/dates/${id}`);
                form.setFieldsValue(response.data); // ตั้งค่าในฟอร์ม
                setLoading(false);
            } catch (error) {
                message.error('Error fetching dates');
                setLoading(false);
            }
        };

        fetchDates();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:3001/update-dates/${id}`, values);
            message.success('Dates updated successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากอัปเดตสำเร็จ
        } catch (error) {
            message.error('Error updating dates');
            setLoading(false);
        }
    };

    return (
        <div
            /* style={{ padding: '20px' }} */
            className='padding-20-px'
        >
            <h1>Update Dates</h1>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Date"
                        name="date"
                    // rules={[{ required: true, message: 'Please input full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                    // rules={[{ required: true, message: 'Please input full name!' }]}
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

}

export default UpdateDates;