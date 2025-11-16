import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Livestock.css';

const Livestock = () => {
  const { currentUser } = useAuth();
  const [livestock, setLivestock] = useState([]);
  const [form, setForm] = useState({
    type: '',
    totalNumbers: '',
    healthStatus: '',
    growthPercentage: '',
    yield: '',
  });
  const [editingId, setEditingId] = useState(null);

  const loadLivestock = useCallback(async () => {
    const livestockRef = collection(db, 'users', currentUser.uid, 'livestock');
    const snapshot = await getDocs(livestockRef);
    const livestockData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLivestock(livestockData);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetchLivestock = async () => {
        const livestockRef = collection(db, 'users', currentUser.uid, 'livestock');
        const snapshot = await getDocs(livestockRef);
        const livestockData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLivestock(livestockData);
      };
      fetchLivestock();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const livestockData = { ...form, createdAt: new Date() };
    if (editingId) {
      await updateDoc(doc(db, 'users', currentUser.uid, 'livestock', editingId), livestockData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'users', currentUser.uid, 'livestock'), livestockData);
    }
    setForm({ type: '', totalNumbers: '', healthStatus: '', growthPercentage: '', yield: '' });
    loadLivestock();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'livestock', id));
    loadLivestock();
  };

  return (
    <div className="livestock-container">
      <h1>Livestock Tracking</h1>
      <form onSubmit={handleSubmit} className="livestock-form">
        <input
          type="text"
          placeholder="Livestock Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Total Numbers"
          value={form.totalNumbers}
          onChange={(e) => setForm({ ...form, totalNumbers: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Health Status"
          value={form.healthStatus}
          onChange={(e) => setForm({ ...form, healthStatus: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Growth/Production Percentage"
          value={form.growthPercentage}
          onChange={(e) => setForm({ ...form, growthPercentage: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Yield (milk, eggs, etc.)"
          value={form.yield}
          onChange={(e) => setForm({ ...form, yield: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Livestock</button>
      </form>
      <div className="livestock-list">
        {livestock.map(item => (
          <div key={item.id} className="livestock-item">
            <h3>{item.type}</h3>
            <p>Total: {item.totalNumbers}</p>
            <p>Health: {item.healthStatus}</p>
            <p>Growth: {item.growthPercentage}%</p>
            <p>Yield: {item.yield}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Livestock;
