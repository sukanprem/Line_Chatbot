import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have the CSS

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Our Medical Service</h1>
      <p>Navigate to fill patient form or subscribe for patient updates.</p>
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
