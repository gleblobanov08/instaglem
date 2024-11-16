import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, where, updateDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../data/firebase";
import Navbar from "../components/Navbar";
import LeftItems from "../components/LeftItems";
import avatar from "../assets/avatar.png";
import { Avatar, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Cloudinary upload (or Firebase Storage if preferred)
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary preset

  const response = await fetch(`https://api.cloudinary.com/v1_1/dsyabbqdw/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data.secure_url;
};

const Profile = () => {
  //const { currentUser } = useContext(AuthContext);
  const currentUser = auth.currentUser;
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [newImageFile, setNewImageFile] = useState(null);
    
  const handleEdit = () => {
    setEditing(true);
    setUpdatedProfile(profile);
  };

  const handleCancel = () => {
    setEditing(false);
    setUpdatedProfile(profile);
    setNewImageFile(null);
  };

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const updateFriendsList = async (uid, updatedName, updatedImage) => {
    try {
      const userCollection = collection(db, "users");
      const usersSnapshot = await getDocs(userCollection);

      usersSnapshot.forEach(async (userDoc) => {
        const friendData = userDoc.data();
        const friendDocRef = userDoc.ref;
        const friendArray = friendData.friends || [];

        // Map over the friends array to update the existing friend information
        const updatedFriendsArray = friendArray.map((friend) => {
          if (friend.id === uid) {
            return {
              ...friend,
              name: updatedName,
              image: updatedImage,
            };
          }
          return friend; // Leave other friends unchanged
        });
  
        // Write the updated friends array back to the document
        //await updateDoc(friendDocRef, { friends: updatedFriendsArray });
        if (JSON.stringify(friendArray) !== JSON.stringify(updatedFriendsArray)) {
          await updateDoc(friendDocRef, { friends: updatedFriendsArray });
        }
      });
      console.log("Friends lists updated successfully.");
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

      const userDocRef = userSnapshot.docs[0].ref; // Get the first matched document reference

      // If there's a new profile image file, upload it to Cloudinary
      let imageUrl = updatedProfile.image;
      if (newImageFile) {
        imageUrl = await uploadImageToCloudinary(newImageFile);
      }

      await updateDoc(userDocRef, {
        ...updatedProfile,
        image: imageUrl, // Update image URL if new image was uploaded
      });

      await updateFriendsList(profile.uid, updatedProfile.name, imageUrl);
      setEditing(false);
      setProfile({ ...updatedProfile, image: imageUrl });
      setNewImageFile(null);
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
    getUserProfile();
  }, [id]);

  const isCurrentUser = currentUser?.uid === id;

  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar />
      </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[25%] fixed top-12">
          <LeftItems />
        </div>
        <div className="flex-auto w-[75%] absolute left-[25%] top-12 bg-gray-100 rounded-xl">
          <div className="w-[80%] mx-auto">
            <div>
              <div className="border-b border-gray-200 py-4 flex items-center">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <FontAwesomeIcon className="h-6" icon={faArrowLeft} />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold">Profile</h1>
                </div>
              </div>
              <div className="p-4">
                {!editing ? (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <Avatar sx={{ width: 52, height: 52 }} src={profile?.image || avatar} alt="avatar" />
                      {isCurrentUser && (
                        <Button onClick={handleEdit}>Edit profile</Button>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{profile?.name}</h2>
                    <p className="text-gray-500">{profile?.email}</p>
                    <p className="mt-2">{profile?.bio}</p>
                    <div className="flex gap-4 mt-4">
                      {profile?.friends?.length === 1 ? (
                        <p><span className="font-bold">1</span> Friend</p>
                      ) : (
                        <p><span className="font-bold">{profile?.friends?.length}</span> Friends</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-4">
                      <Avatar sx={{ width: 52, height: 52 }} src={updatedProfile.image || avatar} alt="avatar" />
                      <label htmlFor="image-upload" className="ml-4">
                        <input id="image-upload" type="file" onChange={handleImageChange} style={{ display: 'none' }} />
                        <Button variant="contained" component="span">Change Image</Button>
                      </label>
                    </div>
                    <input name="name" value={updatedProfile?.name || ''} onChange={handleChange} placeholder="Name" />
                    <textarea name="bio" value={updatedProfile?.bio || ''} onChange={handleChange} placeholder="Bio" />
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;