import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Crops.css';

const Crops = () => {
  const { currentUser } = useAuth();
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({
    name: '',
    plantingSchedule: '',
    notes: '',
    expectedYield: '',
  });
  const [editingId, setEditingId] = useState(null);

  const loadCrops = useCallback(async () => {
    const cropsRef = collection(db, 'users', currentUser.uid, 'crops');
    const snapshot = await getDocs(cropsRef);
    const cropsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCrops(cropsData);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetchCrops = async () => {
        const cropsRef = collection(db, 'users', currentUser.uid, 'crops');
        const snapshot = await getDocs(cropsRef);
        const cropsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCrops(cropsData);
      };
      fetchCrops();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const cropData = { ...form, createdAt: new Date() };
    if (editingId) {
      await updateDoc(doc(db, 'users', currentUser.uid, 'crops', editingId), cropData);
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'users', currentUser.uid, 'crops'), cropData);
    }
    setForm({ name: '', plantingSchedule: '', notes: '', expectedYield: '' });
    loadCrops();
  };

  const handleEdit = (crop) => {
    setForm(crop);
    setEditingId(crop.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', currentUser.uid, 'crops', id));
    loadCrops();
  };

  return (
    <div className="crops-container">
      <h1>Crops Management</h1>
      <form onSubmit={handleSubmit} className="crop-form">
        <input
          type="text"
          placeholder="Crop Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Planting Schedule"
          value={form.plantingSchedule}
          onChange={(e) => setForm({ ...form, plantingSchedule: e.target.value })}
          required
        />
        <textarea
          placeholder="Advanced Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <input
          type="text"
          placeholder="Expected Yield"
          value={form.expectedYield}
          onChange={(e) => setForm({ ...form, expectedYield: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Crop</button>
      </form>
      <div className="crops-list">
        {crops.map(crop => (
          <div key={crop.id} className="crop-item">
            <h3>{crop.name}</h3>
            <p>Planting: {crop.plantingSchedule}</p>
            <p>Expected Yield: {crop.expectedYield}</p>
            <p>Notes: {crop.notes}</p>
            <button onClick={() => handleEdit(crop)}>Edit</button>
            <button onClick={() => handleDelete(crop.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crops;
