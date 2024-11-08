import React, { useState, useContext, useEffect, useReducer } from "react";
import { Avatar } from "@mui/material";
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AppContext";
import { PostReducer, postActions, postStates } from "../context/PostReducer";
import { doc, setDoc, collection, query, onSnapshot, where, getDocs, updateDoc, arrayUnion, deleteDoc,} from "firebase/firestore";
import { db } from "../data/firebase";
import CommentSection from "./CommentSection";

const Post = ({ uid, id, logo, name, email, text, image, timestamp }) => {
  const { user, userData } = useContext(AuthContext);
  const [state, dispatch] = useReducer(PostReducer, postStates);
  const likesRef = doc(collection(db, "posts", id, "likes"));
  const likesCollection = collection(db, "posts", id, "likes");
  const singlePostDocument = doc(db, "posts", id);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    if (open === false) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const addUser = async () => {
    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
      const userDocs = await getDocs(userQuery);
      const userRef = userDocs.docs[0].ref;

      const friendQuery = query(collection(db, "users"), where("uid", "==", uid));
      const friendDocs = await getDocs(friendQuery);
      const friendRef = friendDocs.docs[0].ref;

      await updateDoc(userRef, {
        friends: arrayUnion({
          id: uid,
          image: logo,
          name: name,
        })
      });

      await updateDoc(friendRef, {
        friends: arrayUnion({
          id: user?.uid || userData?.uid,
          image: user?.photoURL || userData?.photoURL || '',
          name: user?.name || userData?.name
        })
      })
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const q = query(likesCollection, where("id", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const likesDocId = await querySnapshot?.docs[0]?.id;
    try {
      if (likesDocId !== undefined) {
        const deleteId = doc(db, "posts", id, "likes", likesDocId);
        await deleteDoc(deleteId);
      } else {
        await setDoc(likesRef, {
          id: user?.uid,
        });
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        alert("You cant delete other users posts !!!");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const getLikes = async () => {
      try {
        const q = collection(db, "posts", id, "likes");
        await onSnapshot(q, (doc) => {
          dispatch({
            type: ADD_LIKE,
            likes: doc.docs.map((item) => item.data()),
          });
        });
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
        console.log(err.message);
      }
    };
    return () => getLikes();
  }, [id, ADD_LIKE, HANDLE_ERROR]);

  return (
    <div className="mb-4">
      <div className="flex flex-col py-4 bg-white rounded-t-3xl">
        <div className="flex justify-start items-center pb-4 pl-4 ">
          <Avatar size="sm" variant="circular" src={logo || avatar} alt="avatar"></Avatar>
          <div className="flex flex-col ml-4">
            <p className=" py-2 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
              {email}
            </p>
            <p className=" font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
              Uploaded: {timestamp}
            </p>
          </div>
          {user?.uid !== uid && (
            <div onClick={addUser} className="w-full flex justify-end cursor-pointer mr-10">
              <FontAwesomeIcon className="h-6" icon={faUserPlus}></FontAwesomeIcon>
            </div>
          )}
        </div>
        <div>
          <p className="ml-4 pb-4 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
            {text}
          </p>
          {image && (
            <img className="h-[500px] w-full" src={image} alt="postImage"></img>
          )}
        </div>
        <div className="flex justify-around items-center pt-4">
          <button className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleLike}>
            <FontAwesomeIcon className="h-6 mr-4 text-red-700" icon={faHeart}></FontAwesomeIcon>
            {state.likes?.length > 0 && state?.likes?.length}
          </button>
          <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleOpen}>
            <div className="flex items-center cursor-pointer">
                <FontAwesomeIcon className="h-6 mr-4 text-blue-700" icon={faComment}></FontAwesomeIcon>
              <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                Comments
              </p>
            </div>
          </div>
          {user?.uid === uid &&
            <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleDelete}>
            <FontAwesomeIcon className="h-6 mr-4" icon={faTrash}></FontAwesomeIcon>
            <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
              Delete
            </p>
            </div>
          }
        </div>
      </div>
      {open && <CommentSection postId={id}></CommentSection>}
    </div>
  );
};

export default Post;