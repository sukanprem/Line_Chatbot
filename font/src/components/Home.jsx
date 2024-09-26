import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have the CSS

const Home = () => {

  const redirectURI = "https://2e25-223-205-61-145.ngrok-free.app/calendar-form"
  const clinetID = "2006377527"
  const lineLoginURI = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clinetID}&redirect_uri=${redirectURI}&state=Booked&scope=profile%20openid&nonce=Booked`

  

  return (
    <div className="home-container">
      <h1>Welcome to Our Medical Service</h1>
      <p>Navigate to fill patient form or subscribe for patient updates.</p>
      <a href={lineLoginURI}>Login with LINE</a>
      <div className="button-container">
        <Link to="/calendar-form">
          <button className="home-button">Fill Patient Form</button>
        </Link>
        <Link to="/subscribe-form">
          <button className="home-button">Subscribe to Updates</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
