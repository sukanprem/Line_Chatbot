import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, Space } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateDates = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:3001/add-dates', values);
            message.success('Dates added successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากเพิ่มสำเร็จ
        } catch (error) {
            message.error('Error adding dates');
            setLoading(false);
        }
    }

    return (
        <div /* style={{ padding: '20px' }} */ className='padding-20-px'>
            <h1>Add Dates</h1>

            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please input date!' }]}
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
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}

export default CreateDates