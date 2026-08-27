import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import api from '../../api';

function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // TODO: Implement settings update
      message.success('সেটিংস সফলভাবে আপডেট হয়েছে');
    } catch (error) {
      message.error('সেটিংস আপডেটে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>সেটিংস</h1>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="institutionName"
            label="প্রতিষ্ঠানের নাম"
            rules={[{ required: true, message: 'প্রতিষ্ঠানের নাম প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="institutionAddress"
            label="প্রতিষ্ঠানের ঠিকানা"
            rules={[{ required: true, message: 'ঠিকানা প্রয়োজন' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="mobileNumber"
            label="মোবাইল নম্বর"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="principalName"
            label="প্রধান/মুহতামিমের নাম"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="accountantName"
            label="হিসাবরক্ষকের নাম"
          >
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            সংরক্ষণ করুন
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Settings;
