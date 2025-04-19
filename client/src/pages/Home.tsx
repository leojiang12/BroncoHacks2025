import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="outer-container">
      <h1>Welcome to vDressr</h1>
      <div className="button-group">
        <button className="home-buttons">
          <Link to="/login">Login</Link>
        </button>
        <button className="home-buttons">
          <Link to="/register">Register</Link>
        </button>
      </div>
    </div>
  );
}
