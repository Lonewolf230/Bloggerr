import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PaywallGradientOverlay = ({ username }) => {
  useEffect(() => {
    // Prevent scrolling when component mounts
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const overlayStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50vh', // Takes up bottom half of viewport
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 1) 100%)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  const containerStyles = {
    textAlign: 'center',
    maxWidth: '500px',
    padding: '20px'
  };

  const headingStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px'
  };

  const paragraphStyles = {
    fontSize: '16px',
    marginBottom: '24px'
  };

  const buttonStyles = {
    backgroundColor: 'blue',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '99px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '16px',
  };

  const linkTextStyles = {
    fontSize: '14px',
    color: '#666'
  };

  const linkStyles = {
    color: '#1a8917',
    textDecoration: 'none'
  };

  return (
    <div style={overlayStyles}>
      <div style={containerStyles}>
        <h2 style={headingStyles}>Please follow <span style={{ color: "blue" }}>{username}</span> to read the blog</h2>
        {/* <p style={paragraphStyles}>Get unlimited access to all content for just $5/month</p> */}

        <Link to={`../../otherProfile/${username}`}>
          <button style={buttonStyles}>
            Follow User
          </button>
        </Link>

      </div>
    </div>
  );
};

export default PaywallGradientOverlay;