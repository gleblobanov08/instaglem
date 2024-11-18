import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Alert, Avatar, Button, Input } from "@mui/material";
import avatar from "../assets/avatar.png";
import { AuthContext } from "../context/AppContext";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../data/firebase";
import { postActions, PostReducer, postStates } from "../context/PostReducer";
import Post from "./Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Main = () => {
    const [progressBar, setProgressBar] = useState(0);
    const [img, setImg] = useState(null); // To store Cloudinary URL after upload
    const [file, setFile] = useState(null); // Stores the selected file before upload
    const [posts, setPosts] = useState([]);
    const { user, userData } = useContext(AuthContext);
    const text = useRef("");
    const [state, dispatch] = useReducer(PostReducer, postStates);
    const { HANDLE_ERROR } = postActions;

    const collectionRef = collection(db, "posts");
    const postRef = doc(collection(db, "posts"));
    const document = postRef.id;

    const handleUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const handleImageSubmit = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dsyabbqdw/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setImg(data.secure_url); // Set the Cloudinary URL for use in the post
            setProgressBar(100);
        } catch (err) {
            dispatch({ type: HANDLE_ERROR });
            alert("Image upload failed. " + err.message);
            console.error('Error uploading image:', err);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (text.current.value !== "") {
            try {
                await setDoc(postRef, {
                    documentId: document,
                    uid: user?.uid || userData?.uid,
                    logo: user?.photoURL || userData.image,
                    name: user?.displayName || userData?.name,
                    email: user?.email || userData?.email,
                    text: text.current.value,
                    image: img, // Use Cloudinary URL here
                    timestamp: serverTimestamp(),
                });
                text.current.value = "";
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert("Error submitting post: " + err.message);
                console.error(err.message);
            }
        } else {
            dispatch({ type: HANDLE_ERROR });
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
           try {
            const q = query(collectionRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedPosts = querySnapshot.docs.map((doc) => doc.data());
            setPosts(fetchedPosts);
           } catch (err) {
                console.log("Error fetching chats: ", err.message);
           }
        }
        fetchPosts();
        setImg(null);
        setFile(null);
        setProgressBar(0);
    }, [collectionRef])

    const isDisabled = !text.current.value;

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col py-3 sm:py-4 w-full bg-white rounded-3xl shadow-lg">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-2 sm:pl-4 w-full">
                    <Avatar size="sm" variant="circular" src={userData?.image || avatar} alt="avatar" />
                    <form className="w-full" onSubmit={handlePostSubmit}>
                        <div className="flex justify-between items-center">
                            <div className="w-full ml-4">
                                {/*<input className="outline-none w-full bg-white rounded-md tracking-wide sm:tracking-normal" type="text" placeholder="What's going on?" ref={text} />*/}
                                <Input sx={{fontSize: '15px'}} disableUnderline="true" placeholder="What's going on?" ref={text}/>
                            </div>
                            <div className="hidden sm:block mx-4">
                                {img && (
                                    <img className="h-12 rounded-xl" src={img} alt="previewImage" />
                                )}
                            </div>
                            <div className="mr-4">
                                <button type="submit" disabled={isDisabled}>
                                    <FontAwesomeIcon icon={faPaperPlane} className="h-5 sm:h-6" style={{color: isDisabled ? "#74C0FC" : "#2071c9"}} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <span style={{ width: `${progressBar}%` }} className="bg-blue-700 py-1 rounded-md"></span>
                <div className="flex justify-around items-center pt-2 sm:pt-4">
                    <div className="flex items-center">
                        <label htmlFor="addImage" className="cursor-pointer flex items-center">
                            <FontAwesomeIcon icon={faPaperclip} className="h-6 mr-4 hover:text-blue-900"></FontAwesomeIcon>
                            <input id="addImage" type="file" style={{ display: "none" }} onChange={handleUpload} />
                        </label>
                        <Button variant="text" onClick={handleImageSubmit} disabled={!file}>Upload</Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col py-4 w-full">
                {state?.error ? (
                    <div className="flex justify-center items-center">
                        <Alert severity="error">Something went wrong...</Alert>
                    </div>
                ) : (
                    <div>
                        {posts?.map((post, index) => {
                            return (
                                <div key={index}>
                                    <Post id={post?.documentId} uid={post?.uid} logo={post?.logo} name={post?.name} email={post?.email} text={post?.text} image={post?.image} timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;