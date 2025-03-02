import React, { useState, useEffect, useContext } from 'react';
import { collection, query, onSnapshot, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../data/firebase';
import { Link } from 'react-router-dom';
import avatar from '../assets/avatar.png';
import '../UserChats.css';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AppContext';

const UserChats = () => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('users', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedChats = [];
      const friendUIDs = [];

      querySnapshot.forEach((doc) => {
        const chat = { id: doc.id, ...doc.data() };
        fetchedChats.push(chat);
        const friendUID = chat.users.find(uid => uid !== user.uid);
        if (friendUID && !friendUIDs.includes(friendUID)) {
          friendUIDs.push(friendUID);
        }
      });

      const friendsQuery = query(collection(db, 'users'), where('uid', 'in', friendUIDs));
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendsData = friendsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().uid] = doc.data();
        return acc;
      }, {});

      const chatsWithLastMessages = await Promise.all(
        fetchedChats.map(async (chat) => {
          const friendUID = chat.users.find(uid => uid !== user.uid);
          const friendData = friendsData[friendUID];

          const messagesRef = collection(db, `/chats/${chat.id}/messages`);
          const lastMessageQuery = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
          const lastMessageSnapshot = await getDocs(lastMessageQuery);
          const lastMessage = lastMessageSnapshot.docs[0]?.data()?.text || "No messages yet";

          return {
            ...chat,
            friendName: friendData.name,
            friendAvatar: friendData.photoURL,
            lastMessage
          }
        })
      )

      setChats(chatsWithLastMessages);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className='wrap'>
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar />
      </div>
      <div className="chat-lobby">
        <h2 className="text-2xl font-bold mt-12 mb-6">Your Chats</h2>
        {chats.length === 0 ? (
          <p className="text-center">Your chats are loading... Or you can just start a new one</p>
        ) : (
          <ul className="chat-list">
            {chats.map((chat) => (
              <Link to={`/chat/${chat.id}`} key={chat.id}>
                <li className="chat-item">
                  <div className="avatar">
                    <img src={chat.friendAvatar || avatar} alt="avatar" />
                  </div>
                  <div className="chat-info">
                    <h3 className="username">{chat.friendName}</h3>
                    <p className='last-message'>{chat.lastMessage}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserChats;