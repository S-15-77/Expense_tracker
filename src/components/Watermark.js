import React from 'react';
import './Watermark.css';
import logo from '../assest/Portfolio Logo.png';

function Watermark() {
  const handleLogoClick = () => {
    // Replace with your actual website URL
    window.open('https://santhoshdayakar.vercel.app/', '_blank');
  };

  return (
    <div className="watermark">
      <div className="watermark-content">
        <img 
          src={logo}
          alt="Logo" 
          className="watermark-logo"
          onClick={handleLogoClick}
        />
        <span className="watermark-text">
          Built by <span className="developer-name" onClick={handleLogoClick}>Santhosh</span>
        </span>
      </div>
    </div>
  );
}

export default Watermark;
