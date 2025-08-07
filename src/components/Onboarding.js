// src/components/Onboarding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import dashboardPreview from '../assest/React App.png';

function Onboarding() {
  const navigate = useNavigate();

  const handleGetLogin = () => {
    navigate('/login');
  };

  const handleSeeRegister = () => {
    navigate('/register');
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-content">
        <div className="text-area">
          <h1>
            Take Control of <br /> Your Finances with <span>BudgetWise</span>
          </h1>
          <p>
            Simplify your budgeting. Visualize your spending. Build the habits that lead to financial freedom — all in one app.
          </p>
          <div className="cta-buttons">
            <button className="btn-green" onClick={handleGetLogin}>Login</button>
            <button className="btn-dark" onClick={handleSeeRegister}>Register</button>
          </div>
        </div>

        <div className="mockup-area">
          <div className="screen-mockup">
            <img src={dashboardPreview} alt="BudgetWise Dashboard Preview" className="dashboard-preview-img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;