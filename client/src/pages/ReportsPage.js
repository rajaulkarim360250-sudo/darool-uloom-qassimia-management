import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Button, Space, message, DatePicker, Select } from 'antd';
import { PrinterOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import api from '../../api';
import moment from 'moment';
import ReportGenerator from '../../components/ReportGenerator';

const { Option } = Select;
const { RangePicker } = DatePicker;

function ReportsPage() {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportType && dateRange) {
      generateReport();
    }
  }, [reportType, dateRange]);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Fetch data based on report type
      const [startDate, endDate] = dateRange;
      const incomeRes = await api.get('/income', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      const expenseRes = await api.get('/expense', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      const studentsRes = await api.get('/students');

      setReportData({
        incomes: incomeRes.data.data || [],
        expenses: expenseRes.data.data || [],
        students: studentsRes.data.data || [],
      });
    } catch (error) {
      message.error('রিপোর্ট তৈরিতে ত্রুটি');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    message.info('Excel এক্সপোর্ট শীঘ্রই আসছে...');
  };

  const incomeColumns = [
    {
      title: 'তারিখ',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'রসিদ #',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
    },
    {
      title: 'ক্যাটাগরি',
      dataIndex: 'incomeCategory',
      key: 'incomeCategory',
    },
    {
      title: 'পরিমাণ (টাকা)',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  const expenseColumns = [
    {
      title: 'তারিখ',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'ভাউচার #',
      dataIndex: 'voucherNumber',
      key: 'voucherNumber',
    },
    {
      title: 'ক্যাটাগরি',
      dataIndex: 'expenseCategory',
      key: 'expenseCategory',
    },
    {
      title: 'পরিমাণ (টাকা)',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  const totalIncome = reportData?.incomes.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalExpense = reportData?.expenses.reduce((sum, item) => sum + item.amount, 0) || 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1>রিপোর্ট তৈরি করুন</h1>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <label style={{ display: 'block', marginBottom: '8px' }}>রিপোর্টের ধরন:</label>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: '100%' }}
            >
              <Option value="daily">দৈনিক রিপোর্ট</Option>
              <Option value="weekly">সাপ্তাহিক রিপোর্ট</Option>
              <Option value="monthly">মাসিক রিপোর্ট</Option>
              <Option value="quarterly">চার মাসের রিপোর্ট</Option>
              <Option value="annual">বার্ষিক রিপোর্ট</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12}>
            <label style={{ display: 'block', marginBottom: '8px' }}>তারিখ পরিসীমা:</label>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Col>
        </Row>
      </Card>

      {reportData && (
        <>
          {/* Summary Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="মোট আয়"
                  value={totalIncome}
                  suffix="টাকা"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="মোট ব্যয়"
                  value={totalExpense}
                  suffix="টাকা"
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="নিট পরিমাণ"
                  value={totalIncome - totalExpense}
                  suffix="টাকা"
                  valueStyle={{ color: totalIncome - totalExpense >= 0 ? '#52c41a' : '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="মোট ছাত্র"
                  value={reportData.students.length}
                />
              </Card>
            </Col>
          </Row>

          {/* PDF Report Preview */}
          <Card title="রিপোর্ট প্রিভিউ" style={{ marginBottom: '24px' }}>
            <ReportGenerator />
          </Card>

          {/* Income Table */}
          <Card title="আয়ের বিবরণ" style={{ marginBottom: '24px' }}>
            <Table
              columns={incomeColumns}
              dataSource={reportData.incomes.map((item) => ({
                ...item,
                key: item._id,
              }))}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>

          {/* Expense Table */}
          <Card title="ব্যয়ের বিবরণ" style={{ marginBottom: '24px' }}>
            <Table
              columns={expenseColumns}
              dataSource={reportData.expenses.map((item) => ({
                ...item,
                key: item._id,
              }))}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      )}
    </div>
  );
}

export default ReportsPage;
