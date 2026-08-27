import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message, Popconfirm, Tag, InputNumber, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';
import './IncomeEntry.css';

const { Option } = Select;

function IncomeEntry() {
  const [incomes, setIncomes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [form] = Form.useForm();
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchIncomes();
    fetchStudents();
  }, []);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/income');
      setIncomes(response.data.data || []);
    } catch (error) {
      message.error('আয় তথ্য লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      message.error('ছাত্র তথ্য লোড করতে ব্যর্থ');
    }
  };

  const handleAddIncome = () => {
    setEditingIncome(null);
    form.resetFields();
    setSelectedStudent(null);
    setModalVisible(true);
  };

  const handleStudentSelect = (value) => {
    const student = students.find(s => s._id === value);
    if (student) {
      setSelectedStudent(student);
      form.setFieldsValue({
        studentName: `${student.firstName} ${student.lastName}`,
        class: student.class,
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date?.toISOString(),
      };

      if (editingIncome) {
        await api.put(`/income/${editingIncome._id}`, payload);
        message.success('আয় তথ্য সফলভাবে আপডেট হয়েছে');
      } else {
        await api.post('/income', payload);
        message.success('নতুন আয় রেকর্ড সফলভাবে যোগ হয়েছে');
      }
      fetchIncomes();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await api.delete(`/income/${id}`);
      message.success('আয় রেকর্ড সফলভাবে মুছে দেওয়া হয়েছে');
      fetchIncomes();
    } catch (error) {
      message.error('আয় রেকর্ড মুছতে ব্যর্থ');
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
      title: 'রসিদ #',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 120,
    },
    {
      title: 'ক্যাটাগরি',
      dataIndex: 'incomeCategory',
      key: 'incomeCategory',
      width: 120,
    },
    {
      title: 'ছাত্রের নাম',
      dataIndex: 'studentName',
      key: 'studentName',
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
            onConfirm={() => handleDeleteIncome(record._id)}
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

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="income-entry-container">
      <div className="income-header">
        <h1>আয় এন্ট্রি</h1>
        <div>
          <Tag color="green" style={{ fontSize: '16px', padding: '4px 12px' }}>
            মোট আয়: {totalIncome} টাকা
          </Tag>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIncome} style={{ marginLeft: '16px' }}>
            নতুন আয় যোগ করুন
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={incomes.map(income => ({ ...income, key: income._id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="নতুন আয় রেকর্ড"
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
            name="receiptNumber"
            label="রসিদ নম্বর"
            rules={[{ required: true, message: 'রসিদ নম্বর প্রয়োজন' }]}
          >
            <Input placeholder="REC001" />
          </Form.Item>

          <Form.Item
            name="incomeCategory"
            label="আয়ের ক্যাটাগরি"
            rules={[{ required: true, message: 'ক্যাটাগরি প্রয়োজন' }]}
          >
            <Select placeholder="ক্যাটাগরি নির্বাচন করুন">
              <Option value="monthly_fee">মাসিক ফি</Option>
              <Option value="admission_fee">ভর্তি ফি</Option>
              <Option value="boarding_fee">বোর্ডিং ফি</Option>
              <Option value="donation">দান</Option>
              <Option value="subscription">চাঁদা</Option>
              <Option value="zakat">যাকাত</Option>
              <Option value="fitr">ফিতরা</Option>
              <Option value="qurbani">কুরবানী</Option>
              <Option value="waqf">ওয়াকফ</Option>
              <Option value="other">অন্যান্য</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="studentId"
            label="ছাত্র"
          >
            <Select
              placeholder="ছাত্র ��ির্বাচন করুন (ঐচ্ছিক)"
              onChange={handleStudentSelect}
              allowClear
            >
              {students.map(student => (
                <Option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} - {student.class}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="studentName"
            label="ছাত্রের নাম"
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item
            name="class"
            label="শ্রেণী"
          >
            <Input readOnly />
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
            name="receivedBy"
            label="গ্রহণকারী"
            rules={[{ required: true, message: 'গ্রহণকারী প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default IncomeEntry;
