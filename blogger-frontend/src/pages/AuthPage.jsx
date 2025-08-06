import React, { useState,useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { authAPI } from '../api/axios';
import './Auth.css';
import { Bars } from 'react-loader-spinner';
import { useAuth } from '../misc/AuthContext';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [creds, setCreds] = useState({ email: "", pwd: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login,isAuthenticated } = useAuth();
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate('/home', { replace: true });
    //     }
    // }, [isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreds((prev) => ({
            ...prev,
            [name]: value
        }));

        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await authAPI.signup(creds.email, creds.pwd);
                navigate('/verify', { state: { email: creds.email } });
            } else {
                const res = await login(creds.email, creds.pwd);
                console.log("res", res);
                const firstTime = res.firstTime
                console.log("First Time", firstTime)
                console.log(typeof firstTime)
                if(res.firstTime) navigate('/tags',{replace:true})
                else navigate('/home', { replace: true });

            }
        } catch (err) {
            console.error('Authentication error:', err);
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setCreds({ email: "", pwd: "" });
    };

    return (
        <main id="auth-main" >
            <section className='form-section'>
                <form id='auth-form' onSubmit={handleSubmit} noValidate>
                    <h2 className="form-title">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder='Enter your email address'
                            onChange={handleChange}
                            value={creds.email}
                            required
                            autoComplete="email"
                            aria-label="Email address"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="pwd"
                            id="pwd"
                            placeholder='Enter your password'
                            onChange={handleChange}
                            value={creds.pwd}
                            minLength={6}
                            required
                            autoComplete={isSignUp ? "new-password" : "current-password"}
                            aria-label="Password"
                        />
                    </div>

                    <button
                        className='login pointer'
                        type="submit"
                        disabled={loading || !creds.email || !creds.pwd}
                        aria-label={isSignUp ? "Create account" : "Sign in"}
                    >
                        {loading ? (
                            <div className="loading-spinner">
                                <Bars
                                    height="20"
                                    width="20"
                                    color="white"
                                    ariaLabel="Loading"
                                    visible={true}
                                />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <p>{isSignUp ? "Create Account" : "Sign In"}</p>
                        )}
                    </button>

                    <p
                        className='auth-toggle pointer'
                        onClick={toggleAuthMode}
                        role="button"
                        // tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleAuthMode();
                            }
                        }}
                        aria-label={!isSignUp ? "Switch to sign up" : "Switch to sign in"}
                    >
                        {!isSignUp ? "New here? Create an account" : "Already have an account? Sign in"}
                    </p>

                </form>
            </section>

            <section id='auth-content'>
                <div>
                    <h1 className='heading' role="banner">
                        Blogger
                    </h1>
                    <h4>
                        Your one-stop destination to collaborate and share knowledge with the world
                    </h4>

                    <div className="features" style={{ marginTop: '40px', color: '#64748b' }}>
                        <div className="feature-item">
                            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>✍️</span>
                            <span>Write and publish your stories</span>
                        </div>
                        <div className="feature-item" style={{ margin: '15px 0' }}>
                            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🤝</span>
                            <span>Connect with fellow writers</span>
                        </div>
                        {/* <div className="feature-item">
                            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🚀</span>
                            <span>Grow your audience</span>
                        </div> */}
                    </div>
                </div>
            </section>
        </main>
    );
}