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
import './Dashboard.css'; // ✅ Import CSS

function Dashboard() {
  const [user, setUser] = useState(null);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else window.location.href = '/login';
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogout = () => {
    signOut(auth);
  };

  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    setAmount(transaction.amount);
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

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.email}</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>

      <form onSubmit={handleAddTransaction} className="transaction-form">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category (e.g., Rent, Salary)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <ChartComponent income={income} expense={expense} />

      <h3>Transactions:</h3>
      <ul className="transaction-list">
        {transactions.map((t) => (
          <li key={t.id}>
            [{t.type}] ${t.amount.toFixed(2)} - {t.category}
            <span className="transaction-buttons">
              <button className="edit-btn" onClick={() => handleEdit(t)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;