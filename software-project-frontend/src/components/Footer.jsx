// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      backgroundColor: '#f9f9f9',
      padding: '10px 0',
      textAlign: 'center',
      borderTop: '1px solid #ccc',
      fontSize: '12px'
    }}>
      <p style={{ margin: '2px 0' }}>
        © {new Date().getFullYear()} Software Project Team – All rights reserved.
      </p>
      <p style={{ margin: '2px 0' }}>
        Contact: <a href="mailto:support@eventhub.com" style={{ color: '#007bff', textDecoration: 'none' }}>support@eventhub.com</a>
      </p>
      <div style={{ margin: '2px 0' }}>
        <a href="/about" style={{ margin: '0 8px', color: '#007bff', textDecoration: 'none' }}>About</a>
        <a href="/contact" style={{ margin: '0 8px', color: '#007bff', textDecoration: 'none' }}>Contact</a>
        <a href="/terms" style={{ margin: '0 8px', color: '#007bff', textDecoration: 'none' }}>Terms</a>
      </div>
    </footer>
  );
};

export default Footer;
