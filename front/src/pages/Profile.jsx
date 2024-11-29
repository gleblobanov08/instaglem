import React, { useEffect, useState, useMemo, useContext } from "react";
import { collection, getDocs, onSnapshot, query, where, updateDoc, limit } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../data/firebase";
import Navbar from "../components/Navbar";
import LeftItems from "../components/LeftItems";
import avatar from "../assets/avatar.png";
import { Avatar, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Post from "../components/Post";
import { AuthContext } from "../context/AppContext";

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

const Profile = () => {
  const currentUser = auth.currentUser;
  const { id } = useParams();
  const { signOutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const isCurrentUser = useMemo(() => currentUser?.uid === id, [currentUser, id]);

  const handleEdit = () => {
    setEditing(true);
    setUpdatedProfile(profile);
  };

  const handleCancel = () => {
    setEditing(false);
    setUpdatedProfile(profile);
    setNewImageFile(null);
    setPreviewImage("");
  };

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File) {
      setNewImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    } else {
      console.log("invalid file selected");
    }
  };

  const removeProfilePicture = () => {
    setUpdatedProfile({ ...updatedProfile, photoURL: "" });
    setPreviewImage("");
    setNewImageFile(null);
  };

  const updateFriendsList = async (uid, updatedName, updatedImage) => {
    try {
      const userCollection = collection(db, "users");
      const usersSnapshot = await getDocs(userCollection);

      usersSnapshot.forEach(async (userDoc) => {
        const friendData = userDoc.data();
        const friendDocRef = userDoc.ref;
        const friendArray = friendData.friends || [];

        const updatedFriendsArray = friendArray.map((friend) => {
          if (friend.id === uid) {
            return { ...friend, name: updatedName, image: updatedImage };
          }
          return friend;
        });

        if (JSON.stringify(friendArray) !== JSON.stringify(updatedFriendsArray)) {
          await updateDoc(friendDocRef, { friends: updatedFriendsArray });
        }
      });
    } catch (error) {
      console.error("Error updating friends lists:", error);
    }
  };

  const handleSave = async () => {
    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", profile.uid));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        alert("User profile not found.");
        return;
      }

      const userDocRef = userSnapshot.docs[0].ref;

      let imageUrl = updatedProfile.photoURL;
      if (newImageFile) {
        imageUrl = await uploadImageToCloudinary(newImageFile);
      }

      await updateDoc(userDocRef, { ...updatedProfile, photoURL: imageUrl });

      await updateFriendsList(profile.uid, updatedProfile.name, imageUrl);
      setEditing(false);
      setProfile({ ...updatedProfile, photoURL: imageUrl });
      setNewImageFile(null);
      setPreviewImage("");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  useEffect(() => {
    const getUserProfile = () => {
      const q = query(collection(db, "users"), where("uid", "==", id));
      onSnapshot(q, (doc) => {
        setProfile(doc.docs[0]?.data());
      });
    };

    const getUserPosts = () => {
      const q = query(collection(db, "posts"), where("uid", "==", id), limit(10));
      onSnapshot(q, (doc) => {
        setUserPosts(doc.docs.map((item) => item.data()));
      });
    };

    getUserProfile();
    getUserPosts();

  }, [id]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    }
  }, [previewImage])

  return (
    <div className="w-full">
        <div className="fixed top-0 z-10 w-full bg-white">
            <Navbar />
        </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[30%] md:w-[25%] fixed top-12">
            <LeftItems />
        </div>
        <div className="flex-auto w-[70%] md:w-[75%] absolute left-[30%] md:left-[25%] top-10 bg-gray-100 rounded-xl">
          <div className="w-[90%] mx-auto py-2">
              <div className="border-b border-gray-200 ml-2 sm:ml-4 py-4 flex items-center">
                <Link to="/">
                  <FontAwesomeIcon className="h-5 sm:h-6" icon={faArrowLeft} />
                </Link>
                <div className="ml-4 sm:ml-6">
                    <h1 className="text-lg sm:text-xl font-bold">Profile</h1>
                </div>
              </div>
              <div className="w-full">
                {!editing || !isCurrentUser ? (
                    <div>
                        <div className="flex justify-center sm:justify-between gap-6 items-center py-4">
                            <Avatar sx={{ width: 52, height: 52 }} src={profile?.photoURL || avatar} />
                            {isCurrentUser && <Button onClick={handleEdit}>Edit</Button>}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold">{profile?.name}</h2>
                            <p className="text-gray-500">{profile?.email}</p>
                            <p className="break-words mt-2">{profile?.bio}</p>
                        </div>                    
                        <div className="flex justify-center sm:justify-start gap-4 mt-4">
                            <span className="font-bold">{profile?.friends?.length}</span> Friends
                        </div>
                        <div className="my-4">
                            {userPosts.map((post, index) => (
                                <Post key={index} id={post?.documentId} uid={post?.uid} text={post?.text} image={post?.image} timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()} />
                            ))}
                            {userPosts.length === 0 && <p className="text-center">No posts found</p>}
                        </div>
                        {isCurrentUser && <div onClick={signOutUser} className="cursor-pointer font-bold text-center text-red-600">Sign Out</div>}
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center py-4">
                            <Avatar sx={{ width: 52, height: 52 }} src={previewImage || updatedProfile.photoURL || avatar} />
                            <div className="flex items-center w-24 sm:w-auto">
                                <label htmlFor="img-upload" className="ml-4 text-center">
                                    <input id="img-upload" type="file" onChange={handleImageChange} style={{display: 'none'}} />
                                    <p className="cursor-pointer uppercase text-sm font-semibold text-blue-700">Change Image</p>
                                </label>
                                <button className="ml-3 md:ml-6 broder-none bg-transparent" onClick={removeProfilePicture}>
                                  <p className="uppercase text-sm font-semibold text-blue-700">Remove Image</p>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                            <input className="p-2 w-[90%] md:w-[60%] border-none outline-none cursor-pointer" name="name" maxLength="15" value={updatedProfile.name || ""} onChange={handleChange} placeholder="Name" />
                            <textarea className="break-words p-2 w-[90%] md:w-[60%] border-none outline-none resize-none cursor-pointer" maxLength="100" name="bio" value={updatedProfile.bio || ""} onChange={handleChange} placeholder="Bio" />
                        </div>
                        <div className="flex gap-2 my-4">
                            <Button variant="contained" onClick={handleSave}>Save</Button>
                            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;