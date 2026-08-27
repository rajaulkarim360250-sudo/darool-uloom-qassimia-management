import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message, Popconfirm, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ExportOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';
import 'moment/locale/bn';
import './StudentList.css';

const { Option } = Select;

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Load students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      message.error('ছাত্র তথ্য লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      enrollmentDate: moment(student.enrollmentDate),
      dateOfBirth: student.dateOfBirth ? moment(student.dateOfBirth) : null,
    });
    setModalVisible(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      message.success('ছাত্র সফলভাবে মুছে দেওয়া হয়েছে');
      fetchStudents();
    } catch (error) {
      message.error('ছাত্র মুছতে ব্যর্থ');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        enrollmentDate: values.enrollmentDate?.toISOString(),
        dateOfBirth: values.dateOfBirth?.toISOString(),
      };

      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, payload);
        message.success('ছাত্র তথ্য সফলভাবে আপডেট হয়েছে');
      } else {
        await api.post('/students', payload);
        message.success('নতুন ছাত্র সফলভাবে যোগ হয়েছে');
      }
      fetchStudents();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'ব্যর্থ হয়েছে');
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentId?.includes(searchText);
    const matchesClass = !filterClass || student.class === filterClass;
    const matchesStatus = !filterStatus || student.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const columns = [
    {
      title: 'ছাত্র আইডি',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: 'নাম',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'পিতার নাম',
      dataIndex: 'fatherName',
      key: 'fatherName',
      width: 150,
    },
    {
      title: 'শ্রেণী',
      dataIndex: 'class',
      key: 'class',
      width: 100,
      sorter: (a, b) => a.class.localeCompare(b.class),
    },
    {
      title: 'মোবাইল',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber',
      width: 120,
    },
    {
      title: 'অবস্থা',
      dataIndex: 'residentialStatus',
      key: 'residentialStatus',
      width: 120,
      render: (text) => (
        <Tag color={text === 'residential' ? 'blue' : 'green'}>
          {text === 'residential' ? 'আবাসিক' : 'অনাবাসিক'}
        </Tag>
      ),
    },
    {
      title: 'স্ট্যাটাস',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => (
        <Tag color={text === 'active' ? 'green' : 'red'}>
          {text === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
        </Tag>
      ),
    },
    {
      title: 'কর্ম',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStudent(record)}
          >
            সম্পাদনা
          </Button>
          <Popconfirm
            title="নিশ্চিত?"
            description="কি আপনি এই ছাত্রকে মুছে ফেলতে চান?"
            onConfirm={() => handleDeleteStudent(record._id)}
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

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h1>ছাত্র ব্যবস্থাপনা</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStudent}>
            নতুন ছাত্র যোগ করুন
          </Button>
          <Button icon={<ExportOutlined />}>এক্সপোর্ট</Button>
        </Space>
      </div>

      <div className="student-list-filters">
        <Input
          placeholder="ছাত্র আইডি বা নাম দ্বারা অনুসন্ধান করুন..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '200px' }}
        />
        <Select
          placeholder="শ্রেণী নির্বাচন করুন"
          value={filterClass}
          onChange={setFilterClass}
          style={{ width: '150px' }}
          allowClear
        >
          <Option value="নূরানী">নূরানী</Option>
          <Option value="নাজেরা">নাজেরা</Option>
          <Option value="হিফজ">হিফজ</Option>
          <Option value="মিযান">মিযান</Option>
          <Option value="নাহবেমীর">নাহবেমীর</Option>
        </Select>
        <Select
          placeholder="স্ট্যাটাস নির্বাচন করুন"
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: '150px' }}
          allowClear
        >
          <Option value="active">সক্রিয়</Option>
          <Option value="inactive">নিষ্ক্রিয়</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStudents.map(student => ({ ...student, key: student._id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingStudent ? 'ছাত্র তথ্য সম্পাদনা করুন' : 'নতুন ছাত্র যোগ করুন'}
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
            name="studentId"
            label="ছাত্র আইডি"
            rules={[{ required: true, message: 'ছাত্র আইডি প্রয়োজন' }]}
          >
            <Input placeholder="STU001" />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="প্রথম নাম"
            rules={[{ required: true, message: 'প্রথম নাম প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="শেষ নাম"
            rules={[{ required: true, message: 'শেষ নাম প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="fatherName"
            label="পিতার নাম"
            rules={[{ required: true, message: 'পিতার নাম প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="motherName"
            label="মাতার নাম"
            rules={[{ required: true, message: 'মাতার নাম প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mobileNumber"
            label="মোবাইল নম্বর"
            rules={[{ required: true, message: 'মোবাইল নম্বর প্রয়োজন' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="class"
            label="শ্রেণী"
            rules={[{ required: true, message: 'শ্রেণী প্রয়োজন' }]}
          >
            <Select placeholder="শ্রেণী নির্বাচন করুন">
              <Option value="নূরানী">নূরানী</Option>
              <Option value="নাজেরা">নাজেরা</Option>
              <Option value="হিফজ">হিফজ</Option>
              <Option value="মিযান">মিযান</Option>
              <Option value="নাহবেমীর">নাহবেমীর</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="monthlyFee"
            label="মাসিক ফি (টাকা)"
            rules={[{ required: true, message: 'মাসিক ফি প্রয়োজন' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="residentialStatus"
            label="আবাসিক অবস্থা"
            rules={[{ required: true, message: 'আবাসিক অবস্থা প্রয়োজন' }]}
          >
            <Select placeholder="নির্বাচন করুন">
              <Option value="residential">আবাসিক</Option>
              <Option value="day-scholar">অনাবাসিক</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="enrollmentDate"
            label="ভর্তি তারিখ"
            rules={[{ required: true, message: 'ভর্তি তারিখ প্রয়োজন' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="status"
            label="স্ট্যাটাস"
            rules={[{ required: true, message: 'স্ট্যাটাস প্রয়োজন' }]}
          >
            <Select placeholder="স্ট্যাটাস নির্বাচন করুন">
              <Option value="active">সক্রিয়</Option>
              <Option value="inactive">নিষ্ক্রিয়</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default StudentList;
