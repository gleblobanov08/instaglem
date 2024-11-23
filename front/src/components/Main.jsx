import React, { useContext, useEffect, useReducer, useMemo } from "react";
import { Alert, Avatar, Button, Input } from "@mui/material";
import avatar from "../assets/avatar.png";
import { AuthContext } from "../context/AppContext";
import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../data/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Post from "./Post";

const Main = () => {
  const [state, setState] = useReducer((state, action) => ({ ...state, ...action }), {
    progressBar: 0,
    img: "",
    file: null,
    text: "",
    posts: [],
    loading: false,
    error: null
  });

  const { user, userData } = useContext(AuthContext);
  const collectionRef = useMemo(() => collection(db, "posts"), []);

  const handleUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    console.log("Selected file:", selectedFile);
    setState({ file: selectedFile });
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const response = await fetch(`https://api.cloudinary.com/v1_1/dsyabbqdw/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  };

  const handleImageSubmit = async () => {
    if (!state.file) return;
    try {
      setState({ loading: true });
      const url = await uploadImageToCloudinary(state.file);
      setState({ img: url, progressBar: 100, loading: false });
      console.log("Image uploaded successfully:", url);
    } catch (err) {
      setState({ error: "Failed to upload image. Please try again.", loading: false });
      console.error("Error uploading image:", err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!state.text.trim()) return;
    try {
      const postRef = doc(collectionRef);
      await setDoc(postRef, {
        documentId: postRef.id,
        uid: user?.uid || userData?.uid,
        text: state.text,
        image: state.img,
        timestamp: serverTimestamp(),
      });
      
      const likesRef = doc(collection(postRef, "likes"), user?.uid);
      await setDoc(likesRef, {
        id: user?.uid
      })

      setState({ text: "", img: "", file: null, progressBar: 0 });
    } catch (err) {
      setState({ error: "Error submitting post. Please try again." });
      console.error("Error submitting post:", err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collectionRef, orderBy("timestamp", "desc"), limit(10));
        await onSnapshot(q, (doc) => {
          const fetchedPosts = doc.docs.map((item) => item.data());
          setState({posts: fetchedPosts});
        })
      } catch (err) {
        console.error("Error fetching posts:", err);
        setState({ error: "Failed to fetch posts." });
      }
    };
    fetchPosts();
  }, [collectionRef]);

  const isDisabled = state.text.trim() === "";

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col py-3 sm:py-4 w-full bg-white rounded-2xl shadow-lg">
        <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-2 sm:pl-4">
          <Avatar size="sm" variant="circular" src={userData?.image || avatar} alt="avatar" />
          <form className="w-full" onSubmit={handlePostSubmit}>
            <div className="ml-4 flex justify-between items-center">
              <Input sx={{ fontSize: "14px" }} disableUnderline fullWidth placeholder="What's going on?" onChange={(e) => setState({ text: e.target.value })} value={state.text} />
              {state.img && <img className="h-10 rounded-lg mx-3" src={state.img} alt="preview" />}
              <Button type="submit" disabled={isDisabled}>
                <FontAwesomeIcon icon={faPaperPlane} className="h-5 sm:h-6" style={{ color: isDisabled ? "#74C0FC" : "#2071c9" }} />
              </Button>
            </div>
          </form>
        </div>
        <span style={{ width: `${state.progressBar}%` }} className="bg-blue-700 py-1"></span>
        <div className="flex justify-evenly items-center mt-2 md:mt-4">
          <label htmlFor="addImage" className="cursor-pointer">
            <FontAwesomeIcon icon={faPaperclip} className="h-6 mr-4 hover:text-blue-900" />
            <input id="addImage" type="file" className="hidden" onChange={handleUpload} />
          </label>
          <Button variant="text" onClick={handleImageSubmit} disabled={!state.file || state.loading}>
            {state.loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      {state.error && (
        <Alert severity="error" className="my-4">
          {state.error}
        </Alert>
      )}
      <div className="py-4 w-full">
        {state.posts?.map((post, index) => (
          <Post key={index} id={post?.documentId} uid={post?.uid} text={post?.text} image={post?.image} timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()} />
        ))}
      </div>
    </div>
  );
};

export default Main;