import React, { useContext, useState } from "react";
import avatar from "../assets/avatar.png";
import job from "../assets/job.png";
import location from "../assets/location.png";
import { Avatar, Tooltip } from "@mui/material";
import { AuthContext } from "../context/AppContext";
import { addDoc, arrayRemove, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../data/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTrash } from "@fortawesome/free-solid-svg-icons";

const LeftItems = () => {
    const [value, setValue] = useState("");
    const { user, userData } = useContext(AuthContext);
    const friendList = userData?.friends;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const searchFriends = (data) => {
        return data.filter((item) => item["name"].toLowerCase().includes(value.toLowerCase()));
    }

    const removeFriend = async (id, name, image) => {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const getDoc = await getDocs(q);
        const userDocumentId = getDoc.docs[0].id;

        await updateDoc(doc(db, "users", userDocumentId), {
            friends: arrayRemove({id: id, name: name, image: image})
        })
    }

    const startConversation = async (friendId) => {
        try {
            const chatsRef = collection(db, "chats");
            const q = query(chatsRef, where("users", "array-contains", user?.uid));
            
            const querySnapshot = await getDocs(q);
            let existingChat = null;
      
            querySnapshot.forEach((doc) => {
              const chatData = doc.data()
              if (chatData.users.includes(friendId)) {
                existingChat = { id: doc.id, ...chatData }
              }
            })
      
            if (existingChat) {
              navigate(`/chat/${existingChat.id}`);
            } else {
              const chatRef = await addDoc(chatsRef, {
                users: [user.uid, friendId],
                createdAt: serverTimestamp(),
              })
              navigate(`/chat/${chatRef.id}`)
            }
          } catch (error) {
            console.error('Error creating/finding chat:', error)
          }
        }

    return (
        <div className="flex flex-col h-screen bg-white pb-4 px-1 border-none rounded-r-xl shadow-lg">
            <div className="flex flex-col items-center">
                <div className="mt-4">
                    <Tooltip title="Profile" placement="top">
                        <Avatar src={userData?.image || avatar} sx={{height: 46, width: 46}} alt="avatar"></Avatar>
                    </Tooltip>
                </div>
            </div> 
            <div className="flex flex-col items-center pt-6">
                <p className="hidden sm:block font-roboto font-medium text-xs sm:text-sm md:text-md xl:text-lg text-gray-700 no-underline tracking-normal leading-none mb-2">{user?.email || userData?.email}</p>
                <p className="font-roboto font-bold text-sm text-center text-gray-700 no-underline tracking-normal py-3">Become a premium member</p>
            </div>
            <div className="flex flex-col pl-2">
                <div className="hidden sm:flex items-center pb-4">
                    <img className="h-10 mr-2" src={location} alt="location" />
                    <p className="font-roboto font-bold text-sm md:text-md lg:text-lg no-underline tracking-normal leading-none">Wakanda</p>
                </div>
                <div className="hidden sm:flex items-center">
                    <img className="h-10 mr-2" src={job} alt="job" />
                    <p className="font-roboto font-bold text-sm md:text-md lg:text-lg no-underline tracking-normal leading-none">Full-time unemployed</p>
                </div>
                <div className="mt-8">
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <p className="font-roboto font-medium text-sm md:text-md text-gray-700 no-underline tracking-normal leading-none">Friends:{" "}</p>
                        <input className="w-[80%] text-center md:text-left text-sm md:text-md border-0 outline-none mt-4" name="input" value={value} type="text" placeholder="Search..." onChange={handleChange} />
                    </div>
                    {friendList?.length > 0 ? (
                        searchFriends(friendList)?.map((friend) => {
                            return (
                                <div className="mr-1 md:mr-2 lg:mr-4 flex flex-wrap items-center justify-between hover:bg-gray-100 duration-300 ease-in-out" key={friend.id}>
                                    <div className="w-full sm:w-auto">
                                        <Link to={`/profile/${friend.id}`}>
                                            <div className="flex items-center my-2 cursor-pointer justify-center">
                                                <div className="flex items-center">
                                                    <Avatar size="sm" variant="circular" src={friend?.image || avatar} alt="avatar" />
                                                    <p className="hidden sm:block ml-4 font-roboto font-medium text-xs md:text-sm text-gray-700 no-underline tracking-normal leading-none">{friend.name}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="w-full sm:w-auto flex justify-center gap-4">
                                        <div className="cursor-pointer" onClick={() => startConversation(friend.id)}>
                                            <FontAwesomeIcon icon={faCommentDots} className="text-blue-300 hover:text-blue-700"></FontAwesomeIcon>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => removeFriend(friend.id, friend.name, friend.image)}>
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="mt-10 font-roboto font-medium text-sm text-center text-gray-700 no-underline tracking-normal">Add friends to check their profile</p>
                     )}
                </div>
            </div>
        </div>
    )
}

export default LeftItems;