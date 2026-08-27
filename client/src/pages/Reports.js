import React from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import { FileTextOutlined, PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import api from '../../api';

function Reports() {
  const handleGenerateReport = async (type) => {
    try {
      message.loading({ content: 'রিপোর্ট তৈরি হচ্ছে...', duration: 0 });
      // TODO: Implement report generation
      message.success(`${type} রিপোর্ট তৈরি হয়েছে`);
    } catch (error) {
      message.error('রিপোর্ট তৈরিতে ব্যর্থ');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>রিপোর্ট</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            onClick={() => handleGenerateReport('দৈনিক')}
            style={{ cursor: 'pointer' }}
          >
            <FileTextOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            <p style={{ marginTop: '12px' }}>দৈনিক রিপোর্ট</p>
            <small>আজকের আয় এবং ব্যয়ের বিবরণ</small>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            onClick={() => handleGenerateReport('মাসিক')}
            style={{ cursor: 'pointer' }}
          >
            <FileTextOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
            <p style={{ marginTop: '12px' }}>মাসিক রিপোর্ট</p>
            <small>মাসের সম্পূর্ণ হিসাব</small>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            onClick={() => handleGenerateReport('চার মাস')}
            style={{ cursor: 'pointer' }}
          >
            <FileTextOutlined style={{ fontSize: '32px', color: '#faad14' }} />
            <p style={{ marginTop: '12px' }}>চার মাসের অডিট রিপোর্ট</p>
            <small>ত্রৈমাসিক পরিসংখ্যান</small>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            onClick={() => handleGenerateReport('বার্ষিক')}
            style={{ cursor: 'pointer' }}
          >
            <FileTextOutlined style={{ fontSize: '32px', color: '#f5222d' }} />
            <p style={{ marginTop: '12px' }}>বার্ষিক রিপোর্ট</p>
            <small>সারা বছরের হিসাব</small>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Reports;
