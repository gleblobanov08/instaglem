'use client'

import React, { useState, useEffect, useContext } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../data/firebase'; // Adjust this import based on your Firebase configuration file
import { Link } from 'react-router-dom';

const UserChats = () => {
  const [chats, setChats] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedChats = [];
      querySnapshot.forEach((doc) => {
        fetchedChats.push({ id: doc.id, ...doc.data() })
      });

      //Filter chats that include the current user's ID
      const filteredChats = fetchedChats.filter(chat => 
        chat.users.includes(user.uid)
      );

      setChats(filteredChats);
    });

    return () => unsubscribe()
  }, [user])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
      {chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        <ul className="space-y-2">
          {chats.map((chat) => (
            <Link to={`/chat/${chat.id}`}>
            <li key={chat.id} className="p-3 bg-gray-100 rounded-lg">
              {/* Display chat information here */}
              {chat.id}
            </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserChats;