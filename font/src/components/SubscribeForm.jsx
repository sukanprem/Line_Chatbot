import React, { useState, useEffect } from 'react';
import './SubscribeForm.css'; // อย่าลืมเพิ่ม import นี้เพื่อเชื่อมโยงกับ CSS
import { BASE_URL, HEADERS } from '../Global/config';

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

  const queryParameters = new URLSearchParams(window.location.search)
  const code = queryParameters.get("code")
  const localLineID = localStorage.getItem("lineUserID") || null
  const [lineUserID, setLineUserID] = useState(localLineID)

  const getLineUserID = async () => {
    try {
      console.log("Code:", code)
      if(!code) {
        // alert("Code not define")
        return;
        // throw "error"
      } 
      const url = `https://${BASE_URL}/get-line-profile-for-subscribed?code=${encodeURIComponent(code)}`;
      const response = await fetch(url,  {
        method: 'GET',
        headers: HEADERS
      })

      
    console.log("FETCH:", response);

    if (!response.ok) {
      throw new Error('Failed to fetch user ID');
    }

    const data = await response.json(); // Assuming the response is in JSON format
    setLineUserID(data?.userId)
    localStorage?.setItem("lineUserID", data?.userId)
    // console.log("User Data:", data);

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!lineUserID) { 
      getLineUserID()
    }
  },[])

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
