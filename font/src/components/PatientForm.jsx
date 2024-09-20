import React, { useState } from 'react';
import './PatientForm.css';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    gender: '',
    age: '',
    symptoms: '',
    allergies: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="PatientForm-01"> {/* ใช้ className แทนแท็กที่กำหนดเอง */}
      <h2>ฟอร์มกรอกข้อมูลผู้ป่วย</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">ชื่อ-นามสกุล:</label>
        <input type="text" id="firstName" name="firstName" placeholder="กรอกชื่อและนามสกุล" required onChange={handleChange} />

        <label htmlFor="gender">เพศ:</label>
        <select id="gender" name="gender" required onChange={handleChange}>
          <option value="">เลือกเพศ</option>
          <option value="male">ชาย</option>
          <option value="female">หญิง</option>
          <option value="other">อื่นๆ</option>
        </select>

        <label htmlFor="age">อายุ:</label>
        <input type="number" id="age" name="age" min="0" max="120" placeholder="กรอกอายุ" required onChange={handleChange} />

        <label htmlFor="symptoms">อาการที่เป็น:</label>
        <textarea id="symptoms" name="symptoms" rows="4" placeholder="อธิบายอาการของท่าน" required onChange={handleChange}></textarea>

        <label htmlFor="allergies">ประวัติการแพ้ยา (ถ้ามี):</label>
        <textarea id="allergies" name="allergies" rows="2" placeholder="ระบุยาที่แพ้ (ถ้ามี)" onChange={handleChange}></textarea>

        <label htmlFor="date">วันที่เข้ารับการตรวจ:</label>
        <input type="date" id="date" name="date" required onChange={handleChange} />

        <button type="submit">ส่งข้อมูล</button>
      </form>
    </div>
  );
};

export default PatientForm;
