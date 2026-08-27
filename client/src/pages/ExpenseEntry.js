import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message, Popconfirm, InputNumber, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';
import './ExpenseEntry.css';

const { Option } = Select;

function ExpenseEntry() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/expense');
      setExpenses(response.data.data || []);
    } catch (error) {
      message.error('ব্যয় তথ্য লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date?.toISOString(),
      };

      if (editingExpense) {
        await api.put(`/expense/${editingExpense._id}`, payload);
        message.success('ব্যয় তথ্য সফলভাবে আপডেট হয়েছে');
      } else {
        await api.post('/expense', payload);
        message.success('নতুন ব্যয় রেকর্ড সফলভাবে যোগ হয়েছে');
      }
      fetchExpenses();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expense/${id}`);
      message.success('ব্যয় রেকর্ড সফলভাবে মুছে দেওয়া হয়েছে');
      fetchExpenses();
    } catch (error) {
      message.error('ব্যয় রেকর্ড মুছতে ব্যর্থ');
    }
  };

  const columns = [
    {
      title: 'তারিখ',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'ভাউচার #',
      dataIndex: 'voucherNumber',
      key: 'voucherNumber',
      width: 120,
    },
    {
      title: 'ব্যয়ের ক্যাটাগরি',
      dataIndex: 'expenseCategory',
      key: 'expenseCategory',
      width: 150,
    },
    {
      title: 'বর্ণনা',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'পরিমাণ (টাকা)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => `${amount}`,
    },
    {
      title: 'পেমেন্ট পদ্ধতি',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
    },
    {
      title: 'কর্ম',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />}>
            সম্পাদনা
          </Button>
          <Popconfirm
            title="নিশ্চিত?"
            onConfirm={() => handleDeleteExpense(record._id)}
            okText="হ্যাঁ"
            cancelText="না"
          >
            <Button type="danger" size="small" icon={<DeleteOutlined />}>
              মুছুন
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="expense-entry-container">
      <div className="expense-header">
        <h1>ব্যয় এন্ট্রি</h1>
        <div>
          <Tag color="red" style={{ fontSize: '16px', padding: '4px 12px' }}>
            মোট ব্যয়: {totalExpense} টাকা
          </Tag>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddExpense} style={{ marginLeft: '16px' }}>
            নতুন ব্যয় যোগ করুন
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={expenses.map(expense => ({ ...expense, key: expense._id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="নতুন ব্যয় রেকর্ড"
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="date"
            label="তারিখ"
            rules={[{ required: true, message: 'তারিখ প্রয়োজন' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="voucherNumber"
            label="ভাউচার নম্বর"
            rules={[{ required: true, message: 'ভাউচার নম্বর প্রয়োজন' }]}
          >
            <Input placeholder="VOU001" />
          </Form.Item>

          <Form.Item
            name="expenseCategory"
            label="ব্যয়ের ক্যাটাগরি"
            rules={[{ required: true, message: 'ক্যাটাগরি প্রয়োজন' }]}
          >
            <Select placeholder="ক্যাটাগরি নির্বাচন করুন">
              <Option value="food">খাদ্য/বোর্ডিং</Option>
              <Option value="teacher_salary">শিক্ষক বেতন</Option>
              <Option value="staff_salary">কর্মচারী বেতন</Option>
              <Option value="electricity">বিদ্যুৎ বিল</Option>
              <Option value="gas">গ্যাস</Option>
              <Option value="water">পানি</Option>
              <Option value="medical">চিকিৎসা</Option>
              <Option value="education_materials">শিক্ষা উপকরণ</Option>
              <Option value="office_expense">অফিস খরচ</Option>
              <Option value="repair">মেরামত</Option>
              <Option value="other">অন্যান্য</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="পরিমাণ (টাকা)"
            rules={[{ required: true, message: 'পরিমাণ প্রয়োজন' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="পেমেন্ট পদ্ধতি"
            rules={[{ required: true, message: 'পেমেন্ট পদ্ধতি প্রয়োজন' }]}
          >
            <Select placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন">
              <Option value="cash">নগদ</Option>
              <Option value="cheque">চেক</Option>
              <Option value="bank_transfer">ব্যাংক ট্রান্সফার</Option>
              <Option value="online">অনলাইন</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="বর্ণনা"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="paidBy"
            label="প্রদানকারী"
            rules={[{ required: true, message: 'প্রদানকারী প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="approvedBy"
            label="অনুমোদনকারী"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ExpenseEntry;
