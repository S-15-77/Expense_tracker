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
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ChartComponent from './ChartComponent';
import './Dashboard.css';
import { saveAs } from 'file-saver';

function Dashboard({user}) {
  // const [user, setUser] = useState(null);
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

  useEffect(() => {
    if (!user) window.location.href = '/login';
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !category || !title || !date) return;
    try {
      if (editId) {
        await updateDoc(doc(db, 'transactions', editId), {
          type,
          amount: parseFloat(amount),
          category,
          title,
          date,
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, 'transactions'), {
          type,
          amount: parseFloat(amount),
          category,
          title,
          date,
          userId: user.uid,
          createdAt: new Date(),
        });
      }
      setAmount('');
      setCategory('');
      setCustomCategory('');
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      alert(err.message);
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
    const headers = ['Type', 'Amount', 'Category', 'Created At'];
    const rows = transactions.map(t => [
      t.type,
      t.amount,
      t.category,
      t.createdAt instanceof Date ? t.createdAt.toISOString() : (t.createdAt?.toDate ? t.createdAt.toDate().toISOString() : t.createdAt)
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
              <h1>Welcome back, {user?.email?.split('@')[0]}</h1>
              <p>Track your expenses and manage your budget</p>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <button onClick={exportToCSV} className="logout-button" style={{ background: 'linear-gradient(135deg, #40ffbf 0%, #29eaa5 100%)', marginLeft: 10 }}>
              Export CSV
            </button>
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
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter transaction title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={predefinedCategories.includes(category) ? category : (category ? 'custom' : '')}
                onChange={e => {
                  if (e.target.value === 'custom') {
                    setCategory('');
                  } else {
                    setCategory(e.target.value);
                    setCustomCategory('');
                  }
                }}
                required
              >
                <option value="" disabled>Select category</option>
                {predefinedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">Custom...</option>
              </select>
              {(!predefinedCategories.includes(category)) && (
                <input
                  type="text"
                  placeholder="Enter custom category"
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
                No transactions yet. Add your first transaction above!
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