import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import IncomeEntry from './pages/IncomeEntry';
import ExpenseEntry from './pages/ExpenseEntry';
import ReportsPage from './pages/ReportsPage';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/students" element={<Layout><StudentList /></Layout>} />
            <Route path="/income" element={<Layout><IncomeEntry /></Layout>} />
            <Route path="/expense" element={<Layout><ExpenseEntry /></Layout>} />
            <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
