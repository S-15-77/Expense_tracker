import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ChartComponent from './ChartComponent';
import './Dashboard.css';
import { saveAs } from 'file-saver';

function Dashboard({user}) {
  // const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateAmount = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      return 'Amount must be a positive number';
    }
    if (num > 1000000) {
      return 'Amount cannot exceed $1,000,000';
    }
    return null;
  };

  const validateTitle = (title) => {
    if (!title || title.trim().length === 0) {
      return 'Title is required';
    }
    if (title.length > 255) {
      return 'Title cannot exceed 255 characters';
    }
    return null;
  };

  const validateDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const minDate = new Date('1900-01-01');
    
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    if (date > today) {
      return 'Date cannot be in the future';
    }
    if (date < minDate) {
      return 'Date cannot be before 1900';
    }
    return null;
  };

  useEffect(() => {
    if (!user) window.location.href = '/login';
  }, [user]);

  // Fetch user's name from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      try {
        console.log('Fetching user data for UID:', user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log('User document exists:', userDoc.exists());
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data from Firestore:', userData);
          setUserName(userData.name || user.email?.split('@')[0] || 'User');
        } else {
          console.log('No user document found, using email fallback');
          // Fallback to email username if no document exists
          setUserName(user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        // Fallback to email username on error
        setUserName(user.email?.split('@')[0] || 'User');
      }
    };

    fetchUserName();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .sort((a, b) => new Date(b.date || b.createdAt?.toDate?.() || b.createdAt) - new Date(a.date || a.createdAt?.toDate?.() || a.createdAt));
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate all inputs
    const validationErrors = {};
    
    const amountError = validateAmount(amount);
    if (amountError) validationErrors.amount = amountError;
    
    const titleError = validateTitle(title);
    if (titleError) validationErrors.title = titleError;
    
    const dateError = validateDate(date);
    if (dateError) validationErrors.date = dateError;
    
    if (!category) {
      validationErrors.category = 'Please select a category';
    }
    
    // If there are validation errors, show them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Prevent duplicate submissions
    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton.disabled) return;
    submitButton.disabled = true;
    
    try {
      if (editId) {
        await updateDoc(doc(db, 'transactions', editId), {
          type,
          amount: parseFloat(amount),
          category,
          title: title.trim(),
          date,
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, 'transactions'), {
          type,
          amount: parseFloat(amount),
          category,
          title: title.trim(),
          date,
          userId: user.uid,
          createdAt: new Date(),
        });
      }
      
      // Clear form
      setAmount('');
      setCategory('');
      setCustomCategory('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setErrors({});
      
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      // Re-enable submit button after a short delay
      setTimeout(() => {
        if (submitButton) submitButton.disabled = false;
      }, 1000);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setAmount('');
    setCategory('');
    setType('expense');
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Test function to manually save user name
  const handleSaveUserName = async () => {
    const name = prompt('Enter your name:');
    if (name && user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: user.email,
          createdAt: new Date()
        });
        alert('Name saved successfully!');
        setUserName(name);
      } catch (error) {
        console.error('Error saving name:', error);
        alert('Failed to save name: ' + error.message);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setCustomCategory(predefinedCategories.includes(transaction.category) ? '' : transaction.category);
    setType(transaction.type);
    setTitle(transaction.title || '');
    setDate(transaction.date || (transaction.createdAt && (transaction.createdAt.toDate ? transaction.createdAt.toDate().toISOString().split('T')[0] : new Date(transaction.createdAt).toISOString().split('T')[0])) || new Date().toISOString().split('T')[0]);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (err) {
      alert(err.message);
    }
  };

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // CSV export helper
  const exportToCSV = () => {
    if (!transactions.length) {
      alert('No transactions to export.');
      return;
    }
    const headers = ['Title', 'Type', 'Amount', 'Category', 'Date'];
    const rows = transactions.map(t => [
      t.title,
      t.type,
      t.amount,
      t.category,
      t.date || '',
      // t.createdAt instanceof Date
      //   ? t.createdAt.toISOString().split('T')[0]
      //   : (t.createdAt?.toDate
      //       ? t.createdAt.toDate().toISOString().split('T')[0]
      //       : new Date(t.createdAt).toISOString().split('T')[0])
    ]);
    const csvContent = [headers, ...rows]
      .map(e => e.map(String).map(s => '"' + s.replace(/"/g, '""') + '"').join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  };

  const predefinedCategories = [
    'Bills',
    'Food',
    'Shopping',
    'Transport',
    'Salary',
    'Entertainment',
    'Other'
  ];

  // Get unique custom categories from transactions (not in predefined)
  const customCategories = Array.from(new Set(transactions.map(t => t.category)))
    .filter(cat => cat && !predefinedCategories.includes(cat));
  // For filter dropdown: All + predefined + custom
  const filterCategories = ['All', ...predefinedCategories, ...customCategories];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Welcome back, {userName || 'Loading...'}</h1>
              <p>Track your expenses and manage your budget</p>
              {/* Debug info - remove this later */}
              {/* <small style={{ color: '#888', fontSize: '12px' }}>
                Debug: User ID: {user?.uid}, Name: {userName}
              </small> */}
              <br />
              {/* <button 
                onClick={handleSaveUserName} 
                style={{ 
                  marginTop: '10px', 
                  padding: '5px 10px', 
                  fontSize: '12px',
                  background: '#40ffbf',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Set My Name
              </button> */}
            </div>
            <div className="header-buttons">
              <button onClick={exportToCSV} className="export-button">
                Export CSV
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card income">
            <h3>Total Income</h3>
            <div className="amount">${income.toFixed(2)}</div>
          </div>
          <div className="stat-card expense">
            <h3>Total Expenses</h3>
            <div className="amount">${expense.toFixed(2)}</div>
          </div>
          <div className="stat-card balance">
            <h3>Balance</h3>
            <div className="amount">${balance.toFixed(2)}</div>
          </div>
        </div>

        <div className="transaction-section">
          <h3>Add Transaction</h3>
          {errors.submit && (
            <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleAddTransaction} className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000000"
                  placeholder="Enter amount (max $1,000,000)"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) {
                      const newErrors = {...errors};
                      delete newErrors.amount;
                      setErrors(newErrors);
                    }
                  }}
                  required
                  style={{
                    borderColor: errors.amount ? 'red' : undefined
                  }}
                />
                {errors.amount && (
                  <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                    {errors.amount}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                maxLength="255"
                placeholder="Enter transaction title (max 255 characters)"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    const newErrors = {...errors};
                    delete newErrors.title;
                    setErrors(newErrors);
                  }
                }}
                required
                style={{
                  borderColor: errors.title ? 'red' : undefined
                }}
              />
              <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
                {title.length}/255 characters
              </div>
              {errors.title && (
                <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                  {errors.title}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                min="1900-01-01"
                max={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => {
                  setDate(e.target.value);
                  if (errors.date) {
                    const newErrors = {...errors};
                    delete newErrors.date;
                    setErrors(newErrors);
                  }
                }}
                required
                style={{
                  borderColor: errors.date ? 'red' : undefined
                }}
              />
              {errors.date && (
                <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                  {errors.date}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={predefinedCategories.includes(category) ? category : (category ? 'custom' : '')}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setCategory('');
                  } else {
                    setCategory(e.target.value);
                    setCustomCategory('');
                  }
                  if (errors.category) {
                    const newErrors = {...errors};
                    delete newErrors.category;
                    setErrors(newErrors);
                  }
                }}
                required
                style={{
                  borderColor: errors.category ? 'red' : undefined
                }}
              >
                <option value="" disabled>Select category</option>
                {predefinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">Custom...</option>
              </select>
              {errors.category && (
                <div className="error-text" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>
                  {errors.category}
                </div>
              )}
              {(!predefinedCategories.includes(category)) && (
                <input
                  type="text"
                  maxLength="100"
                  placeholder="Enter custom category (max 100 characters)"
                  value={customCategory}
                  onChange={e => {
                    setCustomCategory(e.target.value);
                    setCategory(e.target.value);
                  }}
                  style={{ marginTop: 8 }}
                  required
                />
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editId ? 'Update Transaction' : 'Add Transaction'}
              </button>
              {editId && (
                <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="chart-section">
          {/* <h3>Income vs Expenses</h3> */}
          <div className="chart-container">
            <ChartComponent income={income} expense={expense} />
          </div>
        </div>

        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="categoryFilter" className="category-filter-label">Filter by Category:</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="category-filter-select"
            >
              {filterCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="transactions-list">
            {(categoryFilter === 'All'
              ? transactions
              : transactions.filter(t => t.category === categoryFilter)
            ).length === 0 ? (
              <div style={{ textAlign: 'center', color: '#b5b5b5', padding: '40px' }}>
                {categoryFilter === 'All'
                  ? 'No transactions yet. Add your first transaction above!'
                  : `No "${categoryFilter}" transactions found.`}
              </div>
            ) : (
              (categoryFilter === 'All'
                ? transactions
                : transactions.filter(t => t.category === categoryFilter)
              ).map((t) => (
                <div key={t.id} className={`transaction-item ${t.type}`}>
                  <div className="transaction-info">
                    <div className="transaction-title" style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{t.title}</div>
                    <div className="transaction-type">{t.type}</div>
                    <div className="transaction-category">{t.category}</div>
                    <div className="transaction-date" style={{ color: '#b5b5b5', fontSize: 13, marginBottom: 2 }}>Date: {t.date || (t.createdAt && (t.createdAt.toDate ? t.createdAt.toDate().toISOString().split('T')[0] : new Date(t.createdAt).toISOString().split('T')[0]))}</div>
                    <div className="transaction-amount">${t.amount.toFixed(2)}</div>
                  </div>
                  <div className="transaction-actions">
                    <button className="btn-edit" onClick={() => handleEdit(t)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(t.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;