import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Statistic, Spin, message } from 'antd';
import { DollarOutlined, UserOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
import { fetchStudents } from '../store/slices/studentSlice';
import { fetchIncomes } from '../store/slices/incomeSlice';
import { fetchExpenses } from '../store/slices/expenseSlice';
import DashboardCharts from '../components/DashboardCharts';

function Dashboard() {
  const dispatch = useDispatch();
  const { students, loading: studentsLoading } = useSelector(state => state.student);
  const { incomes, loading: incomesLoading } = useSelector(state => state.income);
  const { expenses, loading: expensesLoading } = useSelector(state => state.expense);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchIncomes());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netAmount = totalIncome - totalExpense;

  const loading = studentsLoading || incomesLoading || expensesLoading;

  if (loading) {
    return <Spin tip="লোড হচ্ছে..." />;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>ড্যাশবোর্ড</h1>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="মোট ছাত্র"
              value={students.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="মোট আয়"
              value={totalIncome}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="টাকা"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="মোট ব্যয়"
              value={totalExpense}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix="টাকা"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="নিট হিসাব"
              value={netAmount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: netAmount >= 0 ? '#52c41a' : '#f5222d' }}
              suffix="টাকা"
            />
          </Card>
        </Col>
      </Row>

      <Card title="আর্থিক বিশ্লেষণ" style={{ marginBottom: '24px' }}>
        <DashboardCharts />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="সর্বশেষ ছাত্র" style={{ minHeight: '300px' }}>
            {students.slice(-5).map((student, index) => (
              <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                  {student.firstName} {student.lastName}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  শ্রেণী: {student.class} | ফি: ৳{student.monthlyFee}
                </p>
              </div>
            ))}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="সর্বশেষ লেনদেন" style={{ minHeight: '300px' }}>
            {incomes.slice(-3).map((income, index) => (
              <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#52c41a' }}>
                  +৳{income.amount} - {income.incomeCategory}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  {income.studentName || 'সাধারণ'}
                </p>
              </div>
            ))}
            {expenses.slice(-2).map((expense, index) => (
              <div key={index} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#f5222d' }}>
                  -৳{expense.amount} - {expense.expenseCategory}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  {expense.description}
                </p>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
