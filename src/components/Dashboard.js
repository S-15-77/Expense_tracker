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
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);

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
    if (!amount || !category) return;
    try {
      if (editId) {
        await updateDoc(doc(db, 'transactions', editId), {
          type,
          amount: parseFloat(amount),
          category,
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, 'transactions'), {
          type,
          amount: parseFloat(amount),
          category,
          userId: user.uid,
          createdAt: new Date(),
        });
      }
      setAmount('');
      setCategory('');
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
    setType(transaction.type);
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
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="e.g., Rent, Salary, Food"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
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
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#b5b5b5', padding: '40px' }}>
                No transactions yet. Add your first transaction above!
              </div>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className={`transaction-item ${t.type}`}>
                  <div className="transaction-info">
                    <div className="transaction-type">{t.type}</div>
                    <div className="transaction-category">{t.category}</div>
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