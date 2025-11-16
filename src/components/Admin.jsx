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
    // Check if user is admin (you might want to use Firebase custom claims for this)
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
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-content">
        <div className="users-list">
          <h2>Users</h2>
          {users.map(userId => (
            <div key={userId} onClick={() => { setSelectedUser(userId); loadUserData(userId); }}>
              {userId}
            </div>
          ))}
        </div>
        {selectedUser && (
          <div className="user-data">
            <h2>Data for {selectedUser}</h2>
            <div className="data-section">
              <h3>Crops</h3>
              {userData.crops.map(crop => <div key={crop.id}>{crop.name}</div>)}
            </div>
            <div className="data-section">
              <h3>Livestock</h3>
              {userData.livestock.map(item => <div key={item.id}>{item.type}</div>)}
            </div>
            <div className="data-section">
              <h3>Finance</h3>
              {userData.finance.map(item => <div key={item.id}>{item.description}: ${item.amount}</div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
