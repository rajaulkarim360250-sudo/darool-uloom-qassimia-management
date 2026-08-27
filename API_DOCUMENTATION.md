# API ডকুমেন্টেশন

## বেস URL
```
http://localhost:5000/api
```

## প্রমাণীকরণ
সকল এন্ডপয়েন্ট জন্য JWT টোকেন প্রয়োজন:
```
Authorization: Bearer <token>
```

## এন্ডপয়েন্টসমূহ

### 1. প্রমাণীকরণ

#### লগইন
```
POST /auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "password123"
}
```

#### নিবন্ধন
```
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "fullName": "ব্যবহারকারীর নাম"
}
```

### 2. ছাত্র ব্যবস্থাপনা

#### সকল ছাত্র পান
```
GET /students
```

#### নতুন ছাত্র যোগ করুন
```
POST /students
Content-Type: application/json

{
  "studentId": "STU001",
  "firstName": "মোহাম্মদ",
  "lastName": "আহমদ",
  "fatherName": "আব্দুল করিম",
  "motherName": "ফাতিমা বেগম",
  "mobileNumber": "01700000000",
  "class": "হিফজ",
  "monthlyFee": 5000
}
```

### 3. আয় এন্ট্রি

#### নতুন আয় যোগ করুন
```
POST /income
Content-Type: application/json

{
  "date": "2026-08-27",
  "receiptNumber": "REC001",
  "incomeCategory": "monthly_fee",
  "studentId": "STU001",
  "studentName": "মোহাম্মদ আহমদ",
  "amount": 5000,
  "paymentMethod": "cash",
  "receivedBy": "হিসাবরক্ষক"
}
```

### 4. ব্যয় এন্ট্রি

#### নতুন ব্যয় যোগ করুন
```
POST /expense
Content-Type: application/json

{
  "date": "2026-08-27",
  "voucherNumber": "VOU001",
  "expenseCategory": "teacher_salary",
  "description": "শিক্ষক মাসিক বেতন",
  "amount": 15000,
  "paymentMethod": "bank_transfer",
  "paidBy": "পরিচালক"
}
```

### 5. রিপোর্ট

#### দৈনিক রিপোর্ট
```
GET /reports/daily/2026-08-27
```

#### মাসিক রিপোর্ট
```
GET /reports/monthly/2026-08
```

#### চার মাসের রিপোর্ট
```
GET /reports/quarterly/2026-06
```

#### বার্ষিক রিপোর্ট
```
GET /reports/annual/2026
```

## রেসপন্স ফরম্যাট

### সফল রেসপন্স
```json
{
  "success": true,
  "message": "সফল বার্তা",
  "data": { /* ডাটা */ }
}
```

### এরর রেসপন্স
```json
{
  "success": false,
  "message": "এরর বার্তা"
}
```

## HTTP স্ট্যাটাস কোড
- `200` - সফল
- `201` - তৈরি সফল
- `400` - খারাপ রিকোয়েস্ট
- `401` - অননুমোদিত
- `403` - নিষিদ্ধ
- `404` - পাওয়া যায়নি
- `500` - সার্ভার এরর
