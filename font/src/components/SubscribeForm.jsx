import React, { useState, useEffect } from 'react';
import { BASE_URL, HEADERS } from '../Global/config';
import './SubscribeForm.css'; // Create a CSS file for styling

const SubscribeForm = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const localLineID = localStorage.getItem("lineUserID") || null;
  const [lineUserID, setLineUserID] = useState(localLineID);
  const [healthCheckResultId, setHealthCheckResultId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Set notificationType to 'update' automatically
  const notificationType = 'update';

  // Fetch LINE User ID when component mounts
  useEffect(() => {
    const fetchLineUserID = async () => {
      try {
        if (!code) return;
        const response = await fetch(`${BASE_URL}/get-line-profile-for-subscribe?code=${encodeURIComponent(code)}`, {
          method: 'GET',
          headers: HEADERS,
        });

        const data = await response.json();
        setLineUserID(data?.userId);
        localStorage.setItem("lineUserID", data?.userId);
      } catch (error) {
        console.log("Error fetching Line User ID:", error);
      }
    };

    if (!lineUserID) {
      fetchLineUserID();
    }
  }, [code, lineUserID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/add-subscribe`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          lineUserId: lineUserID,
          healthCheckResultId,
          notificationType, // Automatically set as 'update'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add subscription');
      }

      const result = await response.text();
      setStatusMessage(result);
    } catch (error) {
      setStatusMessage('Error adding subscription');
      console.log('Subscription Error:', error);
    }
  };

  return (
    <div className="subscribe-form-container">
      <h2>ติดตามข้อมูลผลสุขภาพ</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="healthCheckResultId">กรุณากรอกข้อมูลเลขบัตรประชาชนคนไข้</label>
          <input
            type="text"
            id="healthCheckResultId"
            value={healthCheckResultId}
            onChange={(e) => setHealthCheckResultId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Subscribe</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default SubscribeForm;
