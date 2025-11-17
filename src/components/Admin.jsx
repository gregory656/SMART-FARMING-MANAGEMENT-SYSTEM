import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Admin.css';

const Admin = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({ crops: [], livestock: [], finance: [] });



  useEffect(() => {
    // Check if user is admin (might want to use Firebase custom claims for this)
    if (currentUser && currentUser.email === 'admin@smartfarm.com') {
      const fetchUsers = async () => {
        const cropsRef = collection(db, 'users');
        const snapshot = await getDocs(cropsRef);
        const userIds = snapshot.docs.map(doc => doc.id);
        setUsers(userIds);
      };
      fetchUsers();
    }
  }, [currentUser]);

  const loadUserData = async (userId) => {
    const cropsRef = collection(db, 'users', userId, 'crops');
    const livestockRef = collection(db, 'users', userId, 'livestock');
    const financeRef = collection(db, 'users', userId, 'finance');

    const [cropsSnap, livestockSnap, financeSnap] = await Promise.all([
      getDocs(cropsRef),
      getDocs(livestockRef),
      getDocs(financeRef),
    ]);

    setUserData({
      crops: cropsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      livestock: livestockSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      finance: financeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    });
  };

  if (!currentUser || currentUser.email !== 'admin@smartfarm.com') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title h5 mb-0">Users</h2>
            </div>
            <div className="card-body">
              <div className="list-group">
                {users.map(userId => (
                  <button
                    key={userId}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => { setSelectedUser(userId); loadUserData(userId); }}
                  >
                    {userId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {selectedUser && (
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title h5 mb-0">Data for {selectedUser}</h2>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h3 className="h6">Crops</h3>
                  <ul className="list-group">
                    {userData.crops.map(crop => (
                      <li key={crop.id} className="list-group-item">{crop.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="h6">Livestock</h3>
                  <ul className="list-group">
                    {userData.livestock.map(item => (
                      <li key={item.id} className="list-group-item">{item.type}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="h6">Finance</h3>
                  <ul className="list-group">
                    {userData.finance.map(item => (
                      <li key={item.id} className="list-group-item">{item.description}: ${item.amount}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
