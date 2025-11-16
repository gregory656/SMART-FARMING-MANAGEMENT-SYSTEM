import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Smart Farm Management</h1>
      <div className="menu-grid">
        <div className="menu-item" onClick={() => navigate('/crops')}>
          <div className="menu-icon">🌱</div>
          <h3>Crops</h3>
          <p>Manage your crops</p>
        </div>
        <div className="menu-item" onClick={() => navigate('/livestock')}>
          <div className="menu-icon">🐄</div>
          <h3>Livestock</h3>
          <p>Track your livestock</p>
        </div>
        <div className="menu-item" onClick={() => navigate('/order-now')}>
          <div className="menu-icon">🛒</div>
          <h3>Order Now</h3>
          <p>Manage finances and orders</p>
        </div>
        <div className="menu-item" onClick={() => navigate('/more')}>
          <div className="menu-icon">⚙️</div>
          <h3>More</h3>
          <p>Settings and more features</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
