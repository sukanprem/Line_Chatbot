import './LoginFormPage.css';
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const { Title, Text } = Typography;
// import './LoginFormPage.css';

const LoginFormPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('https://d1dd-223-205-61-145.ngrok-free.app/admin/login', {
                username: values.username,
                password: values.password,
            });

            if (response.status === 200) {
                message.success('Login successful!');
                localStorage.setItem('isAuthenticated', 'true'); // บันทึกสถานะล็อกอินใน localStorage
                navigate('/'); // Redirect to the homepage or admin dashboard
            } else {
                message.error('Login failed, please check your credentials.');
            }
        } catch (error) {
            console.error('Login error: ', error);
            message.error('Login failed, please try again.');
        }
        setLoading(false);
    };

    return (
        <div
            /* style={{ display: 'flex',  flexDirection: 'column',justifyContent: 'center', alignItems: 'center', height: '100vh' }} */
            className='display-flex-column-center alignItems-center height-100-vh'
        >
            <Title>Sign in</Title>
            <Text className='padding-top-bottom-8-px'>Welcome back to Back-End UI! Please enter your details below to sign in.</Text>
            <Form
                name="login_form"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ maxWidth: '400px', width: '100%' }}
            >
                {/* <Form.Item>
                    <Title className='text-align-center'>Sign in</Title>
                    <Text className='alignItems-center'>Welcome back to AntBlocks UI! Please enter your details below to sign in.</Text>
                </Form.Item> */}
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} block>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginFormPage;
