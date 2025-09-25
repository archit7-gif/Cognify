

import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loader loader--${size}`}>
      <div className="loader-spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
