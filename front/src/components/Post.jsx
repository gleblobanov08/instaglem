import React, { useContext, useEffect, useReducer, useState } from "react";
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import avatar from "../assets/avatar.jpeg";
import { arrayUnion, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../data/firebase";
import { AuthContext } from "../context/AppContext";
import { postActions, PostReducer, postStates } from "../context/PostReducer";
import CommentSection from "./CommentSection";

const Post = ({uid, id, logo, name, email, text, image, timestamp}) => {
    const [open, setOpen] = useState(false);
    const user = useContext(AuthContext);
    const [state, dispatch] = useReducer(PostReducer, postStates);
    const likeCollection = collection(db, "posts", id, "likes");
    const likeRef = doc(collection(db, "posts", id, "likes"));
    const singlePostDocument = collection(db, "posts", id);
    const { ADD_LIKE, HANDLE_ERROR } = postActions;

    const handleOpen = (e) => {
        e.preventDefault();
        setOpen(true);
    }

    const addFriend = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].ref;
            await updateDoc(data, {
                friends: arrayUnion({
                    id: uid,
                    image: logo,
                    name: name
                }),
            });
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    }

    const handleLike = async (e) => {
        e.preventDefault();
        const q = query(likeCollection, where("id", "==", user?.uid));
        const querySnapshot = await getDocs(q);
        const likeDocsId = await querySnapshot?.docs[0]?.id;
        try {
            if (likeDocsId !== undefined) {
                const deleteID = doc(db, "posts", id, "likes", likeDocsId);
                await deleteDoc(deleteID);
            } else {
                await setDoc(likeRef, {
                    id: user?.uid,
                });
            }
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    }

    const deletePost = async (e) => {
        e.preventDefault();
        try {
            if (user?.uid === uid) {
                await deleteDoc(singlePostDocument);
            } else {
                alert("You can't delete other users posts");
            }
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    }

    useEffect(() => {
        const getLikes = async () => {
            try {
                const q = collection(db, "posts", id, "likes");
                await onSnapshot(q, (doc) => {
                    dispatch({
                        type: ADD_LIKE,
                        likes: doc.docs.map(item => item.data())
                    })
                })
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        }
        return () => getLikes();
    }, [id, HANDLE_ERROR, ADD_LIKE])

    return (
        <div className="mb-4">
            <div className="flex flex-col py-4 bg-white rounded-t-3xl">
                <div className="flex justify-start items-center pb-4 pl-4">
                    <Avatar sx={{height: "36px", width: "36px"}} variant="circular" alt="avatar" src={logo || avatar}></Avatar>
                    <div className="w-full flex flex-col ml-4">
                        <p className="py-2 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">{email}</p>
                        <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">Uploaded: {timestamp}</p>
                    </div>
                    {user?.uid !== uid && (
                        <div className="w-full flex justify-end cursor=pointer mr-10" onClick={addFriend}>
                            <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    <p className="ml-4 pb-4 font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">{text}</p>
                    {image && (
                        <img src={image} className="w-full h-[500px]" alt="post" />
                    )}
                </div>
                <div className="flex justify-around items-center pt-4">
                    <button className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleLike}>
                        <FontAwesomeIcon className="h-8 mr-4" icon={faHeart}></FontAwesomeIcon>
                        {state?.likes?.length > 0 && state?.likes?.length}
                    </button>
                    <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleOpen}>
                        <div className="flex items-center cursor-pointer">
                            <FontAwesomeIcon className="h-8 mr-4" icon={faComment}></FontAwesomeIcon>
                            <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">Comments</p>
                        </div>
                    </div>
                    <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={deletePost}>
                        <FontAwesomeIcon className="h-8 mr-4" icon={faTrash}></FontAwesomeIcon>
                        <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">Delete</p>
                    </div>
                </div>
            </div>
            {open && <CommentSection postId={id}></CommentSection>}
        </div>
    )
}

export default Post;