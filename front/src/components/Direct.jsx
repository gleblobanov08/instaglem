import React, { useRef, useState } from "react";
import { collection, orderBy, query, setDoc, serverTimestamp, doc } from "firebase/firestore";
import { auth, db } from "../data/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const ChatRoom = () => {
    const dummy = useRef();
    const collectionRef = collection(db, "messages");
    const messagesRef = doc(collection(db, "messages"));
    const q = query(collectionRef, orderBy('createdAt', 'asc'))
    const [messages] = useCollectionData(q, { idField: 'id' });
    const [formValue, setFormValue] = useState('');
  
  
    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;
  
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
        <>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
            <span ref={dummy}></span>
  
            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" />
                <button type="submit" disabled={!formValue}>Send</button>
            </form>
        </>
    )
}
  
  
const ChatMessage = (props) => {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
      </div>
    </>)
}

export default ChatRoom;