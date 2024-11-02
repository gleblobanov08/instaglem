import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, orderBy, query, setDoc, serverTimestamp, doc } from "firebase/firestore";
import { auth, db } from "../data/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import avatar from "../assets/avatar.png";
import '../Direct.css';

const ChatRoom = () => {
    const { conversationId } = useParams();
    const dummy = useRef();
    const currentUser = auth.currentUser;
    const collectionRef = collection(db, `chats/${conversationId}/messages`);
    const messagesRef = doc(collection(db, `chats/${conversationId}/messages`));
    const q = query(collectionRef, orderBy('createdAt', 'asc'))
    const [messages] = useCollectionData(q, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid, photoURL } = currentUser;
  
        await setDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            photoURL
        })
  
        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="flex flex-col self-end w-[80%] mt-2 mx-auto p-4 rounded-lg bg-gray-400">
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            <span ref={dummy}></span>
    
            <form className="form" onSubmit={sendMessage}>
                <input className="input" value={formValue} onChange={(e) => setFormValue(e.target.value)}placeholder="Message" />
                <button className="button" type="submit" disabled={!formValue}>Send</button>
            </form>
        </div>
    )
}
  
  
const ChatMessage = (props) => {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (
        <div className={`message ${messageClass}`}>
            <img className="img" src={photoURL || avatar} alt="avatar" />
            <p className="p">{text}</p>
        </div>
    )
}

export default ChatRoom;