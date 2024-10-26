import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Alert, Avatar, Button } from "@mui/material";
import avatar from "../assets/avatar.png";
import { AuthContext } from "../context/AppContext";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { db } from "../data/firebase";
import { postActions, PostReducer, postStates } from "../context/PostReducer";
import Post from "./Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

const Main = () => {
    const [progressBar, setProgressBar] = useState(0);
    const [img, setImg] = useState(null);
    const [file, setFile] = useState(null);
    const { user, userData } = useContext(AuthContext);
    const text = useRef("");
    const scrollRef = useRef("");
    const [state, dispatch] = useReducer(PostReducer, postStates);
    const { SUBMIT_POST, HANDLE_ERROR } = postActions;

    const collectionRef = collection(db, "posts");
    const postRef = doc(collection(db, "posts"));
    const document = postRef.id;

    const handleUpload = (e) => {
        setFile(e.target.files[0]);
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (text.current.value !== "") {
            try {
                await setDoc(postRef, {
                    documentId: document,
                    uid: user?.uid || userData?.uid,
                    logo: user?.photoURL,
                    name: user?.displayName || userData?.name,
                    email: user?.email || userData?.email,
                    text: text.current.value,
                    image: img,
                    timestamp: serverTimestamp(),
                });
                text.current.value = "";
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        } else {
            dispatch({ type: HANDLE_ERROR });
        }
    };

    const storage = getStorage();
    const metadata = {
        contentType: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml",]
    }

    const handleImageSumbit = async () => {
        const fileType = metadata.contentType.includes(file["type"]);
        if (!file) return;
        if (fileType) {
            try {
                const storageRef = ref(storage, `images/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file, metadata.contentType);
                await uploadTask.on("state_changed", (snapshot) => {
                    const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                    setProgressBar(progress);
                }, (error) => {
                    alert(error)
                },
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setImg(downloadURL));
                }
                );
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        }
    }

    useEffect(() => {
        const postData = async () => {
            const q = query(collectionRef, orderBy("timestamp", "desc"));
            await onSnapshot(q, (doc) => {
                dispatch({
                    type: SUBMIT_POST,
                    posts: doc?.docs?.map((item) => item?.data())
                });
                scrollRef?.current?.scrollIntoView({behaviour: "smooth"});
                setImg(null);
                setFile(null);
                setProgressBar(0);
            })
        }
        return () => postData();
    }, [SUBMIT_POST]);

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
                    <Avatar size="sm" variant="circular" src={user?.photoURL || avatar} alt="avatar"></Avatar>
                    <form className="w-full" onSubmit={handlePostSubmit}>
                        <div className="flex justify-between items-center">
                            <div className="w-full ml-4">
                                <input className="outline-none w-full bg-white rounded-md" type="text" placeholder="Share your thoughts..." ref={text} />
                            </div>
                            <div className="mx-4">
                            {img && (
                                <img className="h-12 rounded-xl" src={img} alt="previewImage" />
                            )}
                            </div>
                            <div className="mr-4">
                                <Button variant="text" type="submit">Post</Button>
                            </div>
                        </div>
                    </form>
                </div>
                <span style={{ width: `${progressBar}%` }} className="bg-blue-700 py-1 rounded-md"></span>
                <div className="flex justify-around items-center pt-4">
                    <div className="flex items-center">
                        <label htmlFor="addImage" className="cursor-pointer flex items-center">
                            <FontAwesomeIcon icon={faPaperclip} className="h-6 mr-4"></FontAwesomeIcon>
                            <input id="addImage" type="file" style={{ display: "none" }} onChange={handleUpload}/>
                        </label>
                        <Button variant="text" onClick={handleImageSumbit} disabled={!file}>Upload</Button>
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
                        {state?.posts?.length > 0 && state?.posts?.map((post, index) => {
                            return (
                                <Post key={index} id={post?.documentId} uid={post?.uid} logo={post?.logo} name={post?.name} email={post?.email} text={post?.text} image={post?.image} timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()} />
                            );
                        })}
                    </div>
                )}
            </div>
            <div ref={scrollRef}>
            </div>
        </div>
    );
}

export default Main;