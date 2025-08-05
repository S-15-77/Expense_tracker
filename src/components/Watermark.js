import React from 'react';
import './Watermark.css';

function Watermark() {
  const handleLogoClick = () => {
    // Replace with your actual website URL
    window.open('https://santhoshdayakar.vercel.app/', '_blank');
  };

  return (
    <div className="watermark">
      <div className="watermark-content">
        <img 
          src="/logo192.png" 
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
