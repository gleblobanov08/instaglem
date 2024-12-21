import { useState, useEffect, useContext } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from "../data/firebase";
import { AuthContext } from '../context/AppContext';
import Comment from './Comment';
import { Avatar } from '@mui/material';
import avatar from '../assets/avatar.png';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const { user, userData } = useContext(AuthContext);

  useEffect(() => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('timestamp', 'desc'), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    })

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        comment: comment,
        authorId: user.uid || userData.uid,
        timestamp: new Date(),
      })
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  return (
    <div className="flex flex-col bg-white w-full py-2 rounded-b-3xl">
        <div className="flex items-center">
            <div className="mx-2">
                <Avatar size="sm" variant="circular" src={userData?.photoURL || avatar} />
            </div>
            <div className="w-full pr-2">
                <form className="flex items-center w-full" onSubmit={handleAddComment}>
                    <input name="comment" maxLength="280" type="text" placeholder="Write a comment..." className="w-full break-words text-xs sm:text-sm rounded-lg outline-none border-0 p-2 bg-gray-100" value={comment} onChange={(e) => setComment(e.target.value)} />
                    <button className="hidden" type="submit">Submit</button>
                </form>
            </div>
        </div>
        {comments?.map((comment, index) => {
            return (
                <Comment key={index} uid={comment?.authorId} comment={comment?.comment}></Comment>
            );
        })}
    </div>
  )
}

export default CommentSection;