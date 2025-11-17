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
    <div className="container mt-4">
      <h1 className="mb-4">Crops Management</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">{editingId ? 'Edit Crop' : 'Add New Crop'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Crop Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Planting Schedule"
                    value={form.plantingSchedule}
                    onChange={(e) => setForm({ ...form, plantingSchedule: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Make Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Expected Yield"
                    value={form.expectedYield}
                    onChange={(e) => setForm({ ...form, expectedYield: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Add'} Crop
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Your Crops</h5>
            </div>
            <div className="card-body">
              {crops.length === 0 ? (
                <p className="text-muted">No crops added yet.</p>
              ) : (
                <div className="list-group">
                  {crops.map(crop => (
                    <div key={crop.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{crop.name}</h6>
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(crop)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(crop.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mb-1">Planting: {crop.plantingSchedule}</p>
                      <p className="mb-1">Expected Yield: {crop.expectedYield}</p>
                      {crop.notes && <p className="mb-0 text-muted">Notes: {crop.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crops;
