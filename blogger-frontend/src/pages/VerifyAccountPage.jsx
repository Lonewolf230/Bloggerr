import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api/axios';
import './Verify.css';
import { useToast } from '../misc/ToastManager';

export default function VerifyAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const email = location.state?.email || '';
    const {showToast}=useToast()
    
    if (!email) {
        navigate('/');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await authAPI.verify(email, verificationCode);
            showToast('User verified successfully, Please login to Continue!', 'success');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="verify-container">
            <div className="verify-card">
                <h2>Verify Your Account</h2>
                <p>We've sent a verification code to <span style={{color:"green"}}>{email}</span>. Please enter it below.</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Verification Code</label>
                        <input
                            type="number"
                            id="code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter verification code"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="verify-btn"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>
                
                <div className="verify-footer">
                    <p>Didn't receive a code? <span className="resend-link">Resend Code</span></p>
                    <p>Back to <span className="login-link" onClick={() => navigate('/')}>Login</span></p>
                </div>
            </div>
        </div>
    );
}