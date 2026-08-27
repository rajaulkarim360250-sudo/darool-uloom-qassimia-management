import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Row, Col, DatePicker, Button, Space, Select, message } from 'antd';
import api from '../../api';
import moment from 'moment';
import 'moment/locale/bn';

const { Option } = Select;

function DashboardCharts() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month'); // day, week, month, year

  useEffect(() => {
    fetchChartData();
  }, [dateRange]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Fetch income data
      const incomeRes = await api.get('/income');
      const expenseRes = await api.get('/expense');
      const studentsRes = await api.get('/students');

      // Process data for charts
      const processedIncomeData = processTimeSeriesData(incomeRes.data.data || [], dateRange, 'income');
      const processedExpenseData = processTimeSeriesData(expenseRes.data.data || [], dateRange, 'expense');
      const classDistribution = processClassData(studentsRes.data.data || []);

      setIncomeData(processedIncomeData);
      setExpenseData(processedExpenseData);
      setClassData(classDistribution);
    } catch (error) {
      message.error('চার্ট ডেটা লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const processTimeSeriesData = (data, range, type) => {
    const dataMap = {};

    data.forEach((item) => {
      const date = moment(item.date);
      let key;

      if (range === 'day') {
        key = date.format('HH:00');
      } else if (range === 'week') {
        key = date.format('dddd');
      } else if (range === 'month') {
        key = date.format('DD MMM');
      } else if (range === 'year') {
        key = date.format('MMMM');
      }

      if (!dataMap[key]) {
        dataMap[key] = 0;
      }
      dataMap[key] += item.amount;
    });

    return Object.entries(dataMap).map(([date, amount]) => ({
      name: date,
      [type]: amount,
    }));
  };

  const processClassData = (students) => {
    const classMap = {};

    students.forEach((student) => {
      if (!classMap[student.class]) {
        classMap[student.class] = 0;
      }
      classMap[student.class]++;
    });

    return Object.entries(classMap).map(([className, count]) => ({
      name: className,
      value: count,
    }));
  };

  // Combine income and expense data for comparison chart
  const combinedData = [];
  const allDates = new Set();

  incomeData.forEach((item) => allDates.add(item.name));
  expenseData.forEach((item) => allDates.add(item.name));

  allDates.forEach((date) => {
    const incomeItem = incomeData.find((d) => d.name === date);
    const expenseItem = expenseData.find((d) => d.name === date);

    combinedData.push({
      name: date,
      income: incomeItem?.income || 0,
      expense: expenseItem?.expense || 0,
    });
  });

  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: '150px' }}
          >
            <Option value="day">দৈনিক</Option>
            <Option value="week">সাপ্তাহিক</Option>
            <Option value="month">মাসিক</Option>
            <Option value="year">বার্ষিক</Option>
          </Select>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* Income vs Expense Comparison */}
        <Col xs={24} lg={12}>
          <Card title="আয় ও ব্যয় তুলনা" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#52c41a" name="আয়" />
                <Line type="monotone" dataKey="expense" stroke="#f5222d" name="ব্যয়" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Income Trend */}
        <Col xs={24} lg={12}>
          <Card title="আয়ের প্রবণতা" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#52c41a" name="আয়" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Expense Trend */}
        <Col xs={24} lg={12}>
          <Card title="ব্যয়ের প্রবণতা" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expense" fill="#f5222d" name="ব্যয়" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Class Distribution */}
        <Col xs={24} lg={12}>
          <Card title="শ্রেণীভিত্তিক ছাত্র সংখ্যা" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardCharts;
