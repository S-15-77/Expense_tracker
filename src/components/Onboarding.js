// src/components/Onboarding.js
import React from 'react';
import './Onboarding.css';

function Onboarding() {
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
            <button className="btn-green">Get Started</button>
            <button className="btn-dark">See Plans</button>
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