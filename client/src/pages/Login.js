import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '../store/slices/authSlice';
import './Login.css';

function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const onFinish = async (values) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      message.success('লগইন সফল!');
      navigate('/dashboard');
    } catch (err) {
      message.error(err || 'লগইন ব্যর্থ');
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="login-header">
          <h1>দারুল উলূম কাছেমিয়া</h1>
          <p>ক্বওমী মাদ্রাসা</p>
          <h3>ব্যবস্থাপনা সফটওয়্যার</h3>
        </div>
        
        {loading && <Spin />}
        
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'ব্যবহারকারীর নাম লিখুন' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="ব্যবহারকারীর নাম"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'পাসওয়ার্ড লিখুন' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="পাসওয়ার্ড"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            লগইন
          </Button>
        </Form>

        {error && <p className="error-message" style={{ marginTop: '12px', color: 'red' }}>{error}</p>}
      </Card>
    </div>
  );
}

export default Login;
