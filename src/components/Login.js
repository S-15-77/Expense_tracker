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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate inputs
    const validationErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) validationErrors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) validationErrors.password = passwordError;
    
    // If there are validation errors, show them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
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
          case 'auth/user-disabled':
            message = 'This account has been disabled.';
            break;
          case 'auth/network-request-failed':
            message = 'Network error. Please check your connection.';
            break;
          default:
            message = `Error: ${error.message}`;
        }
      } else {
        message = `Unexpected error: ${error.message || error}`;
      }
    
      setErrors({ submit: message });
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
          {errors.submit && (
            <div className="error-message" style={{color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeaa7', border: '1px solid #fdcb6e', borderRadius: '4px'}}>
              {errors.submit}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              maxLength="254"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  const newErrors = {...errors};
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              required
              style={{
                borderColor: errors.email ? 'red' : undefined
              }}
            />
            {errors.email && (
              <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  const newErrors = {...errors};
                  delete newErrors.password;
                  setErrors(newErrors);
                }
              }}
              required
              style={{
                borderColor: errors.password ? 'red' : undefined
              }}
            />
            {errors.password && (
              <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                {errors.password}
              </div>
            )}
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