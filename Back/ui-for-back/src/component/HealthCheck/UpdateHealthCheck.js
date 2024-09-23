import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Space } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import '../../App.css';
import { BASE_URL, HEADERS } from '../Global/config';

const UpdateHealthCheck = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // ดึง id จาก URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHealthCheckResult = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/health-check-result/${id}`, {
                    headers: HEADERS
                });
                form.setFieldsValue(response.data); // ตั้งค่าในฟอร์ม
                setLoading(false);
            } catch (error) {
                message.error('Error fetching health check result');
                setLoading(false);
            }
        };

        fetchHealthCheckResult();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/update-health-check-result/${id}`, values, {
                headers: HEADERS
            });
            message.success('Health check result updated successfully');
            setLoading(false);
            navigate('/'); // กลับไปยังหน้าแสดงผลข้อมูลหลังจากอัปเดตสำเร็จ
        } catch (error) {
            message.error('Error updating health check result');
            setLoading(false);
        }
    };

    return (
        <div
            /* style={{ padding: '20px' }} */
            className='padding-20-px'
        >
            <h1>Update Health Check Result</h1>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="Firs Name"
                        name="firstName"
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
                        label="Citizen ID"
                        name="citizenId"
                    // rules={[{ required: true, message: 'Please input citizen id!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Weight (kg)"
                        name="weight"
                    // rules={[{ required: true, message: 'Please input weight!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Height (cm)"
                        name="height"
                    // rules={[{ required: true, message: 'Please input height!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Pulse Rate"
                        name="pulseRate"
                    // rules={[{ required: true, message: 'Please input pulse rate!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Temperature"
                        name="temperature"
                    // rules={[{ required: true, message: 'Please input temperature!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Oxygen Level"
                        name="oxygenLevel"
                    // rules={[{ required: true, message: 'Please input oxygen level!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Respiration Rate"
                        name="respirationRate"
                    // rules={[{ required: true, message: 'Please input respiration rate!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Meal Time"
                        name="mealTime"
                    // rules={[{ required: true, message: 'Please input meal time!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Fasting Time"
                        name="fastingTime"
                    // rules={[{ required: true, message: 'Please input fasting time!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Fasting Blood Sugar"
                        name="fastingBloodSugar"
                    // rules={[{ required: true, message: 'Please input fasting blood sugar!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="More Details">
                        <Form.List name="moreDetails">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <Space
                                            key={key}
                                            // style={{ display: 'flex', marginBottom: 8 }} 
                                            align="baseline"
                                            className='display-flex margin-bottom-8'
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                fieldKey={[fieldKey]}
                                                rules={[{ required: true, message: 'Please input more details!' }]}
                                            >
                                                <Input placeholder="Enter detail" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add More Details
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    <Form.Item
                        label="Blood Pressure"
                        name="bloodPressure"
                    // rules={[{ required: true, message: 'Please input blood pressure!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hospital"
                        name="hospital"
                    // rules={[{ required: true, message: 'Please input hospital!' }]}
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

export default UpdateHealthCheck;
