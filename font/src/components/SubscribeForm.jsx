import React, { useState } from 'react';
import './SubscribeForm.css'; // อย่าลืมเพิ่ม import นี้เพื่อเชื่อมโยงกับ CSS

const SubscribeForm = () => {
  const [subscribeData, setSubscribeData] = useState({
    patientName: '',
    relativeEmail: '',
    relation: ''
  });

  const handleChange = (e) => {
    setSubscribeData({ ...subscribeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic, such as sending data to a server
    console.log('Subscribe Data:', subscribeData);
  };

  return (
    <div className="SubscribeForm"> {/* ใช้ className แทน div */}
      <h1>Subscribe to Patient Updates</h1>
      <p>กรอกข้อมูลของคุณเพื่อรับการอัปเดตเกี่ยวกับสถานะผู้ป่วยที่คุณต้องการติดตาม</p>
      <form onSubmit={handleSubmit}>
        <input type="text" id="patient-name" name="patientName" placeholder="ชื่อผู้ป่วย" required onChange={handleChange} />
        <input type="email" id="relative-email" name="relativeEmail" placeholder="อีเมลญาติ" required onChange={handleChange} />
        <input type="text" id="relation" name="relation" placeholder="ความสัมพันธ์กับผู้ป่วย (เช่น พ่อ, แม่, พี่)" required onChange={handleChange} />
        <button type="submit" className="subscribe-btn">
          <i className="fas fa-bell"></i> Subscribe
        </button>
      </form>
      <footer>
        <p>Powered by <a href="https://your-hospital-website.com" className="footer-link">Your Hospital Name</a></p>
      </footer>
    </div>
  );
};

export default SubscribeForm;
