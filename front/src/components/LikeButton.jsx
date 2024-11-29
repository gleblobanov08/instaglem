import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../data/firebase';
import { AuthContext } from '../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user) {
        const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
        const likeDoc = await getDoc(likeRef);
        setLiked(likeDoc.exists());
      }
    }

    const getLikeCount = async () => {
      const likesRef = collection(db, 'posts', postId, 'likes');
      await onSnapshot(likesRef, (doc) => {
        setLikeCount(doc.docs?.length);
      })
      //setLikeCount(likeSnapshot.size);
    }

    checkLikeStatus();
    getLikeCount();
  }, [postId, user]);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;

    const likeRef = doc(db, 'posts', postId, 'likes', user.uid);

    if (liked) {
      await deleteDoc(likeRef);
      setLiked(false);
    } else {
      await setDoc(likeRef, { timestamp: new Date() });
      setLiked(true);
    }
  }

  return (
    <button className={`flex items-center text-md ${liked ? 'text-red-500' : 'text-gray-500'}`} onClick={handleLike}>
      <FontAwesomeIcon icon={faHeart} className='h-5 sm:h-6 mr-3 sm:mr-4'/>
      {likeCount}
    </button>
  )
}

export default LikeButton;