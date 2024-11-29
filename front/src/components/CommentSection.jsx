/*import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { AuthContext } from "../context/AppContext";
import { postActions, PostReducer, postStates } from "../context/PostReducer";
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../data/firebase";
import { Avatar } from "@mui/material";
import avatar from "../assets/avatar.png";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
    const comment = useRef("");
    const {user, userData} = useContext(AuthContext);
    const commentRef = doc(collection(db, "posts", postId, "comments"));
    const [state, dispatch] = useReducer(PostReducer, postStates);
    const { ADD_COMMENT, HANDLE_ERROR } = postActions;
    const [comments, setComments] = useState([]);

    const addComment = async (e) => {
        e.preventDefault();
        if (comment.current.value !== "") {
            try {
                await setDoc(commentRef, {
                    id: commentRef.id,
                    authorId: user?.uid || userData?.uid,
                    comment: comment.current.value,
                    timestamp: serverTimestamp(),
                });
                comment.current.value = "";
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        }
    };
    
    useEffect(() => {
        const getComments = async () => {
            try {
                const commentsCollection = collection(db, `posts/${postId}/comments`);
                const q = query(commentsCollection, orderBy("timestamp", "desc"), limit(5));
                await onSnapshot(q, (doc) => {
                    /*dispatch({
                        type: ADD_COMMENT,
                        comments: doc.docs?.map((item) => item.data())
                    });
                    setComments(doc.docs?.map(((item) => item.data())))
                });
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        };
        return () => getComments();
    }, [postId, ADD_COMMENT, HANDLE_ERROR]);

    return (
        <div className="flex flex-col bg-white w-full py-2 rounded-b-3xl">
            <div className="flex items-center">
                <div className="mx-2">
                    <Avatar size="sm" variant="circular" src={userData?.photoURL || avatar} />
                </div>
                <div className="w-full pr-2">
                    <form className="flex items-center w-full" onSubmit={addComment}>
                        <input name="comment" maxLength="280" type="text" placeholder="Write a comment..." className="w-full text-xs sm:text-sm rounded-2xl outline-none border-0 p-2 bg-gray-100" ref={comment} />
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
    );
}

export default CommentSection;
*/
//Error: this.requestMonitor is undefined

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
                    <input name="comment" maxLength="280" type="text" placeholder="Write a comment..." className="w-full break-words text-xs sm:text-sm rounded-2xl outline-none border-0 p-2 bg-gray-100" value={comment} onChange={(e) => setComment(e.target.value)} />
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