import React, { useRef } from 'react';
import { Button, Row, Col, Card, Table, Space, message, Spin } from 'antd';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import 'moment/locale/bn';

function ReportGenerator() {
  const reportRef = useRef();
  const [loading, setLoading] = React.useState(false);

  // Sample data - replace with actual API calls
  const sampleReportData = {
    institutionName: 'দারুল উলূম কাছেমিয়া কওমী মাদ্রাসা',
    address: 'ঢাকা, বাংলাদেশ',
    reportDate: moment().format('DD MMMM YYYY'),
    totalIncome: 50000,
    totalExpense: 30000,
    netAmount: 20000,
    totalStudents: 150,
    incomeDetails: [
      { category: 'মাসিক ফি', amount: 30000, percentage: '60%' },
      { category: 'ভর্তি ফি', amount: 10000, percentage: '20%' },
      { category: 'দান', amount: 10000, percentage: '20%' },
    ],
    expenseDetails: [
      { category: 'শিক্ষক বেতন', amount: 15000, percentage: '50%' },
      { category: 'খাদ্য খরচ', amount: 10000, percentage: '33%' },
      { category: 'অন্যান্য', amount: 5000, percentage: '17%' },
    ],
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');

      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`রিপোর্ট-${moment().format('DD-MM-YYYY')}.pdf`);
      message.success('PDF সফলভাবে ডাউনলোড হয়েছে');
    } catch (error) {
      message.error('PDF তৈরিতে ত্রুটি');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const incomeColumns = [
    { title: 'ক্যাটাগরি', dataIndex: 'category', key: 'category' },
    { title: 'পরিমাণ (টাকা)', dataIndex: 'amount', key: 'amount' },
    { title: 'শতাংশ', dataIndex: 'percentage', key: 'percentage' },
  ];

  const expenseColumns = [
    { title: 'ক্যাটাগরি', dataIndex: 'category', key: 'category' },
    { title: 'পরিমাণ (টাকা)', dataIndex: 'amount', key: 'amount' },
    { title: 'শতাংশ', dataIndex: 'percentage', key: 'percentage' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            প্রিন্ট করুন
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
            loading={loading}
          >
            PDF ডাউনলোড করুন
          </Button>
        </Space>
      </div>

      <div
        ref={reportRef}
        style={{
          padding: '40px',
          backgroundColor: '#fff',
          pageBreakAfter: 'always',
        }}
        className="print-content"
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold' }}>
            {sampleReportData.institutionName}
          </h1>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>{sampleReportData.address}</p>
          <h2 style={{ margin: '10px 0', fontSize: '18px' }}>মাসিক আর্থিক প্রতিবেদন</h2>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>তারিখ: {sampleReportData.reportDate}</p>
        </div>

        {/* Summary Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
            সংক্ষিপ্ত হিসাব
          </h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: 'center' }}>
                <p style={{ margin: '5px 0', color: '#666' }}>মোট আয়</p>
                <p style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                  ৳ {sampleReportData.totalIncome}
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: 'center' }}>
                <p style={{ margin: '5px 0', color: '#666' }}>মোট ব্যয়</p>
                <p style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold', color: '#f5222d' }}>
                  ৳ {sampleReportData.totalExpense}
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: 'center' }}>
                <p style={{ margin: '5px 0', color: '#666' }}>নিট পরিমাণ</p>
                <p style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                  ৳ {sampleReportData.netAmount}
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ textAlign: 'center' }}>
                <p style={{ margin: '5px 0', color: '#666' }}>মোট ছাত্র</p>
                <p style={{ margin: '10px 0', fontSize: '18px', fontWeight: 'bold' }}>
                  {sampleReportData.totalStudents}
                </p>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Income Details */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
            আয়ের বিবরণ
          </h3>
          <Table
            columns={incomeColumns}
            dataSource={sampleReportData.incomeDetails.map((item, idx) => ({
              key: idx,
              ...item,
            }))}
            pagination={false}
            bordered
          />
        </div>

        {/* Expense Details */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '15px' }}>
            ব্যয়ের বিবরণ
          </h3>
          <Table
            columns={expenseColumns}
            dataSource={sampleReportData.expenseDetails.map((item, idx) => ({
              key: idx,
              ...item,
            }))}
            pagination={false}
            bordered
          />
        </div>

        {/* Signature Section */}
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', width: '30%' }}>
            <div style={{ borderTop: '1px solid #000', marginTop: '30px', paddingTop: '10px' }}
            >
              হিসাবরক্ষক
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '30%' }}>
            <div style={{ borderTop: '1px solid #000', marginTop: '30px', paddingTop: '10px' }}>
              প্রধান/মুহতামিম
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '30%' }}>
            <div style={{ borderTop: '1px solid #000', marginTop: '30px', paddingTop: '10px' }}>
              তারিখ
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print-content {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default ReportGenerator;
