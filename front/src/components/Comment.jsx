import React, { useState, useEffect } from "react";
import avatar from "../assets/avatar.png";
import { Avatar } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../data/firebase";

const Comment = ({ uid, comment }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const authorSnapshot = await getDocs(q);

        if (!authorSnapshot.empty) {
          setAuthor(authorSnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching author data: ", error);
      }
    };

    fetchAuthor();
  }, [uid]);

  return (
    <div className="flex items-center mt-2 w-full">
      <div className="mx-2">
        <Avatar size="sm" alt="avatar" variant="circular" src={author.photoURL || avatar} />
      </div>
      <div className="flex flex-col items-start bg-gray-100 rounded-2xl p-1 max-w-[600px]">
        <p className="font-roboto text-black text-xs sm:text-sm no-underline tracking-normal leading-none p-1 font-medium">{author.name}</p>
        <p className="font-roboto text-black text-xs sm:text-sm no-underline tracking-normal leading-none p-1 font-medium">{comment}</p>
      </div>
    </div>
  );
};

export default Comment;
