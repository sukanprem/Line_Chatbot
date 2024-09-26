import React from 'react';
import { Link } from 'react-router-dom';
import { CLIENT_ID,REDIRECT_URI_FOR_BOOK, REDIRECT_URI_FOR_SUBSCRIBED } from '../Global/config';
import './Home.css'; // Assuming you have the CSS

const Home = () => {

  // const redirectURI = "https://2e25-223-205-61-145.ngrok-free.app/calendar-form"
  // const clinetID = "2006377527"
  const lineLoginURIForBooked = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_FOR_BOOK}&state=Booked&scope=profile%20openid&nonce=Booked`
  const lineLoginURIForSubscribed = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_FOR_SUBSCRIBED}&state=Subscribed&scope=profile%20openid&nonce=Subscribed`

  return (
    <div className="home-container">
      <h1>Welcome to Our Medical Service</h1>
      <p>Navigate to fill patient form or subscribe for patient updates.</p>
      <a href={lineLoginURIForBooked}>Login with LINE for book</a>
      <a href={lineLoginURIForSubscribed}>Login with LINE for subscribed</a>
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
