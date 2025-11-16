import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './OrderNow.css';

const OrderNow = () => {
  const { currentUser } = useAuth();
  const [finances, setFinances] = useState([]);
  const [form, setForm] = useState({
    type: 'expense', // expense or income
    description: '',
    amount: '',
    category: '',
  });
  const [editingId, setEditingId] = useState(null);

  const loadFinances = useCallback(async () => {
    const financeRef = collection(db, 'users', currentUser.uid, 'finance');
    const snapshot = await getDocs(financeRef);
    const financeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFinances(financeData);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetchFinances = async () => {
        const financeRef = collection(db, 'users', currentUser.uid, 'finance');
        const snapshot = await getDocs(financeRef);
        const financeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFinances(financeData);
      };
      fetchFinances();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const financeData = { ...form, amount: parseFloat(form.amount), createdAt: new Date() };
    if (editingId) {
      await updateDoc(doc(db, 'users', currentUser.uid, 'finance', editingId), financeData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'users', currentUser.uid, 'finance'), financeData);
    }
    setForm({ type: 'expense', description: '', amount: '', category: '' });
    loadFinances();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'finance', id));
    loadFinances();
  };

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="order-now-container">
      <h1>Order Now - Financial Management</h1>
      <div className="finance-summary">
        <div className="summary-item">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h3>Net</h3>
          <p>${(totalIncome - totalExpenses).toFixed(2)}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="finance-form">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category (seeds, fertilizers, etc.)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Entry</button>
      </form>
      <div className="finance-list">
        {finances.map(item => (
          <div key={item.id} className="finance-item">
            <h3>{item.description}</h3>
            <p>Type: {item.type}</p>
            <p>Amount: ${item.amount}</p>
            <p>Category: {item.category}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderNow;
