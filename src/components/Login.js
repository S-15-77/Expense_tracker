import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // ✅ Keep the CSS import
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } 
    catch (error) {
      console.log('[Firebase Login Error]', error);
    
      let message = 'Login failed. Please try again.';
    
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email address.';
            break;
          case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later.';
            break;
          default:
            message = `Error: ${error.message}`;
        }
      } else {
        message = `Unexpected error: ${error.message || error}`;
      }
    
      // alert(message);
      toast.error(message);
    }
    
    finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please enter your email to reset your password.');
      return;
    }
    setResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent!');
      console.log(email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      let message = 'Failed to send reset email.';
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No user found with this email.';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email address.';
            break;
          default:
            message = error.message;
        }
      }
      toast.error(message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your BudgetWise account</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <button
            type="button"
            className="login-btn secondary-btn"
            style={{ marginTop: 10 }}
            onClick={handlePasswordReset}
            disabled={resetting}
          >
            {resetting ? 'Sending reset email...' : 'Forgot Password?'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="link">Create one here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;