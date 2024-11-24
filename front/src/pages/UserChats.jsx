import React, { useState, useEffect, useContext } from 'react';
import { collection, query, onSnapshot, orderBy, limit, getDocs, where } from 'firebase/firestore';
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
    const q = query(chatsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const fetchedChats = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().users.includes(user.uid)) {
          fetchedChats.push({ id: doc.id, ...doc.data() })
        }
      });
      const chatsWithFriendInfo = await Promise.all(
        fetchedChats.map(async chat => {
          const friendUID = chat.users.find(uid => uid !== user.uid); // Get the friend's UID
          let friendData = { name: 'Unknown User', photoURL: avatar }; // Default values

         if (friendUID) {
          const q = query(collection(db, 'users'), where('uid', '==', friendUID));
          const getDoc = await getDocs(q);
          friendData = getDoc.docs[0].data();
        }

          return {
            ...chat,
            friendName: friendData.name,
            friendAvatar: friendData.photoURL // Use friend's photoURL or default avatar
          };
        })
      );

      setChats(chatsWithFriendInfo);
    });

    return () => unsubscribe()
  }, [user])

  const getLastMessage = async (chatId) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1)); // Assuming you have a `createdAt` field
    const messagesSnapshot = await getDocs(q);
    if (messagesSnapshot.docs.length > 0) {
      if (messagesSnapshot.docs[0].data().uid === user.uid) {
        return 'You: ' + messagesSnapshot.docs[0].data().text;
      } else {
        return messagesSnapshot.docs[0].data().text;
      }
    }
      else {
        return 'No messages yet'; // Assuming you have a `text` field
      }
  };

  useEffect(() => {
    const fetchLastMessages = async () => {
      const messages = await Promise.all(chats.map(chat => getLastMessage(chat.id)));
      setChats(prevChats => prevChats.map((chat, index) => ({ ...chat, lastMessage: messages[index] })));
    };

    if (chats.length > 0) {
      fetchLastMessages();
    }
  }, [chats]);

  return (
    <div className='wrap'>
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar></Navbar>
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
                  <img src={chat.friendAvatar || avatar} alt="avatar"/>
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
  )
}

export default UserChats;