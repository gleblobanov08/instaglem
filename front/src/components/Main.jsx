import React, { useContext, useEffect, useReducer, useMemo } from "react";
import { Alert, Avatar, Button } from "@mui/material";
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
    mediaFiles: [],
    text: "",
    posts: [],
    loading: false,
    error: null,
    uploading: false
  });

  const { user, userData } = useContext(AuthContext);
  const collectionRef = useMemo(() => collection(db, "posts"), []);

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 3);
    console.log("Selected files:", selectedFiles);
    setState({ mediaFiles: [...state.mediaFiles, ...selectedFiles].slice(0, 3) });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const resourceType = file.type.startsWith('image') ? 'image' : 'video';
    const response = await fetch(`https://api.cloudinary.com/v1_1/dsyabbqdw/${resourceType}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  };

  const handleMediaSubmit = async () => {
    if (state.mediaFiles.length === 0 || state.uploading) return;
    try {
      setState({ uploading: true, loading: true });
      const urls = await Promise.all(state.mediaFiles.map(uploadToCloudinary));
      setState({ mediaFiles: [], progressBar: 100, uploading: false, loading: false });
      console.log("Media uploaded successfully:", urls);
      return urls;
    } catch (err) {
      setState({ error: "Failed to upload media. Please try again.", uploading: false, loading: false });
      console.error("Error uploading media:", err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!state.text.trim() && state.mediaFiles.length === 0) return;
    try {
      const mediaUrls = await handleMediaSubmit();
      const postRef = doc(collectionRef);
      await setDoc(postRef, {
        documentId: postRef.id,
        uid: user?.uid || userData?.uid,
        text: state.text,
        mediaUrls: mediaUrls || [],
        timestamp: serverTimestamp(),
      });

      const likesRef = doc(collection(postRef, "likes"), user?.uid);
      await setDoc(likesRef, {
        id: user?.uid
      })

      setState({ text: "", mediaFiles: [], progressBar: 0 });
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
          setState({ posts: fetchedPosts });
        })
      } catch (err) {
        console.error("Error fetching posts:", err);
        setState({ error: "Failed to fetch posts." });
      }
    };
    fetchPosts();
  }, [collectionRef]);

  const isDisabled = state.text.trim() === "" && state.mediaFiles.length === 0;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col py-3 sm:py-4 w-full bg-white rounded-2xl shadow-lg">
        <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-2 sm:pl-4">
          <Avatar size="sm" variant="circular" src={userData?.photoURL || avatar} alt="avatar" />
          <form className="w-full" onSubmit={handlePostSubmit}>
            <div className="ml-4 flex justify-between items-center">
              <input className="w-full break-words text-md border-none outline-none" maxLength="280" placeholder="Type something..." onChange={(e) => setState({ text: e.target.value })} value={state.text} />
              {state.mediaFiles.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {state.mediaFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <button className="absolute z-0 h-10 w-full" onClick={(e) => {
                        e.preventDefault();
                        setState({ mediaFiles: state.mediaFiles.filter((_, i) => i !== index) });}}></button>
                      {file.type.startsWith('image') ? (
                        <img className="m-auto h-10 rounded-lg z-10" src={URL.createObjectURL(file)} alt={`preview ${index}`} />
                        ) : (
                        <video className="m-auto h-10 rounded-lg z-10" src={URL.createObjectURL(file)}/>
                      )}
                    </div>
                  ))}
                </div>
              )}  
              <button type="submit" disabled={isDisabled || state.loading} className="mr-4">
                <FontAwesomeIcon icon={faPaperPlane} className="h-5 sm:h-6" style={{ color: isDisabled || state.loading ? "#74C0FC" : "#2071c9" }} />
              </button>
            </div>
          </form>
        </div>
        <span style={{ width: `${state.progressBar}%` }} className="bg-blue-700 py-1"></span>
        <div className="flex justify-evenly items-center mt-2 md:mt-4">
          <label htmlFor="addImage" className="cursor-pointer">
            <FontAwesomeIcon icon={faPaperclip} className="h-6 mr-4 hover:text-blue-900" />
            <input id="addImage" type="file" className="hidden" onChange={handleUpload} accept="image/*, video/*" multiple />
          </label>
          <Button variant="text" onClick={handleMediaSubmit} disabled={state.mediaFiles.length === 0 || state.loading}>
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
          <Post key={index} id={post?.documentId} uid={post?.uid} text={post?.text} mediaUrls={post?.mediaUrls} timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()} />
        ))}
      </div>
    </div>
  );
};

export default Main;