// src/components/Onboarding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

function Onboarding() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
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
            <button className="btn-green" onClick={handleLogin}>Login</button>
            <button className="btn-dark" onClick={handleRegister}>Register</button>
          </div>
        </div>

        <div className="mockup-area">
          <div className="screen-mockup">[📊 Dashboard Preview Here]</div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;