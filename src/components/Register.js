import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // ✅ Keep CSS import
import { toast } from 'react-toastify';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email.length > 254) {
      return 'Email address is too long';
    }
    return null;
  };

  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Name is required';
    }
    if (name.length > 100) {
      return 'Name cannot exceed 100 characters';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password.length > 128) {
      return 'Password cannot exceed 128 characters';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate all inputs
    const validationErrors = {};
    
    const nameError = validateName(name);
    if (nameError) validationErrors.name = nameError;
    
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
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log('User created:', userCredential.user.uid);
      
      // Save user name in Firestore
      console.log('Attempting to save user data:', { name: name.trim(), email: email.trim() });
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date()
      });
      console.log('User data saved successfully to Firestore');
      
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      let message = '';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Email/password accounts are not enabled.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection.';
          break;
        default:
          message = error.message;
      }
      setErrors({ submit: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join BudgetWise to start tracking your expenses</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          {errors.submit && (
            <div className="error-message" style={{color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffeaa7', border: '1px solid #fdcb6e', borderRadius: '4px'}}>
              {errors.submit}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              maxLength="100"
              placeholder="Enter your name (2-100 characters)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  const newErrors = {...errors};
                  delete newErrors.name;
                  setErrors(newErrors);
                }
              }}
              required
              style={{
                borderColor: errors.name ? 'red' : undefined
              }}
            />
            <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
              {name.length}/100 characters
            </div>
            {errors.name && (
              <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              maxLength="254"
              placeholder="Enter your email address"
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
              maxLength="128"
              placeholder="Enter your password (minimum 6 characters)"
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
            <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
              {password.length}/128 characters (minimum 6)
            </div>
            {errors.password && (
              <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                {errors.password}
              </div>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;