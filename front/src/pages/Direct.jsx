import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, orderBy, query, setDoc, serverTimestamp, doc, getDoc, where, getDocs } from "firebase/firestore";
import { auth, db } from "../data/firebase";
import { AuthContext } from "../context/AppContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import avatar from "../assets/avatar.png";
import '../Direct.css';
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ChatRoom = () => {
    const { user } = useContext(AuthContext);
    const { conversationId } = useParams();
    const dummy = useRef();
    const currentUser = auth.currentUser;
    const collectionRef = collection(db, `chats/${conversationId}/messages`);
    const messagesRef = doc(collectionRef);
    const q = query(collectionRef, orderBy('createdAt', 'asc'))
    const [messages] = useCollectionData(q, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
    const [friendData, setFriendData] = useState({name: '...', image: avatar});

    useEffect(() => {
        if (!user) return;
    
        const fetchFriendData = async () => {
          // Query the chat document to find the friend’s UID
          const chatRef = doc(db, 'chats', conversationId);
          const chatSnapshot = await getDoc(chatRef);
          const chatData = chatSnapshot.data();
    
          if (chatData && chatData.users) {
            const friendUID = chatData.users.find(uid => uid !== user.uid);
    
            if (friendUID) {
              // Fetch the friend's document from 'users' collection
              const q = query(collection(db, 'users'), where('uid', '==', friendUID));
              const friendSnapshot = await getDocs(q);
              if (!friendSnapshot.empty) {
                const friend = friendSnapshot.docs[0].data();
                setFriendData({ name: friend.name, photoURL: friend.photoURL || avatar });
              }
            }
          }
        };
    
        fetchFriendData();
      }, [conversationId, user]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid } = currentUser;
  
        await setDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
        })
  
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="chat-conversation h-screen">
            <div className="w-full bg-white">
                <Navbar></Navbar>
            </div>
            <div className="relative top-10 sm:top-12 chat-header">
                <Link to={`/chats/${user?.uid}`}>
                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 sm:h-6 mr-4"/>
                </Link>
                <img src={friendData.photoURL} alt="ava" className="header-avatar" />
                <h3>{friendData.name}</h3>
            </div>
            <div className="relative top-10 sm:top-12 messages-container">
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            </div>
            <span ref={dummy}></span>        
            <form className="form" onSubmit={sendMessage}>
                <input className="break-words form-input" maxLength="280" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" />
                <button className="form-button" type="submit" disabled={!formValue}>Send</button>
            </form>            
        </div>
    )
}
  
  
const ChatMessage = (props) => {
    const { text, uid } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (
        <div className={`message ${messageClass}`}>
            <p className="break-words message-text">{text}</p>
        </div>
    )
}

export default ChatRoom;
