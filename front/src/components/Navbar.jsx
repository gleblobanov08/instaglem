import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Tooltip } from "@mui/material";
import { AuthContext } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faRightToBracket, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import avatar from "../assets/avatar.png";
import job from "../assets/job.png";
import location from "../assets/location.png";
import { addDoc, arrayRemove, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../data/firebase";
import Modal from "./Modal";

const Navbar = () => {
    const { signOutUser, user, userData } = useContext(AuthContext);
    const [value, setValue] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const friendList = userData?.friends;
    const navigate = useNavigate();

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

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

        const frQ = query(collection(db, "users"), where("uid", "==", id));
        const frGetDoc = await getDocs(frQ);
        const frUserDocumentId = frGetDoc.docs[0].id;

        await updateDoc(doc(db, "users", frUserDocumentId), {
            friends: arrayRemove({id: user?.uid, name: userData?.name, image: user?.photoURL})
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
        <>
            <div className="fixed top-0 z-10 w-full bg-white">
                <div className="flex justify-evenly items-center border-b border-gray-100 w-full px-4 md:px-10 py-2">
                    <button onClick={toggleModal}>
                        <div className="mr-3 sm:mr-0 text-xl sm:text-3xl font-extra-bold text-gray-900 dark:text-white font-roboto">
                            <span className="text-transparent bg-clip-text bg-blue-400">Instaglem</span>
                        </div>
                    </button>
                    <div className="flex justify-center item-center mx-auto">
                        <div className="flex justify-center items-center cursor-pointer">
                            <Link to="/">
                                <Tooltip title="Home" placement="bottom">
                                <div className="hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                    />
                                    </svg>
                                </div>
                                </Tooltip>
                            </Link>
                            <Link to={`/chats/${user?.uid}`}>
                                <Tooltip title="Your chats" placement="bottom">
                                <div className="hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 mx-4"
                                    >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                    </svg>
                                </div>
                                </Tooltip>
                            </Link>
                            <Link to={"/search"}>
                                <Tooltip title="Search" placement="bottom">
                                <div className="mr-4 hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                </Tooltip>
                            </Link>
                            <Tooltip title="Coming soon..." placement="bottom">
                                <div className="mr-4 hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                    />
                                </svg>
                                </div>
                            </Tooltip>
                            <Link to={`/profile/${user?.uid}`}>
                                <Tooltip title="Profile" placement="bottom">
                                <Avatar src={userData?.photoURL || avatar} alt="user" sx={{height: 26, width: 26}}></Avatar>
                                </Tooltip>
                            </Link>
                            <div className="mx-4 flex items-center" onClick={signOutUser}>
                                <Tooltip title="Sign Out" placement="bottom">
                                    <FontAwesomeIcon icon={faRightToBracket} />
                                </Tooltip>
                                <p className="hidden sm:block ml-4 font-roboto text-sm text-black font-medium no-underline">
                                {user?.displayName === null && userData?.name !== undefined ? userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1) : user?.displayName?.split(" ")[0]}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalOpen && (
                <Modal onClose={toggleModal}>
                    <div>
                            <div className="flex flex-col bg-white pb-4 border-none">
                                <div className="flex flex-col items-center">
                                    <div className="mt-4">
                                        <Tooltip title="Profile" placement="top">
                                            <Avatar src={userData?.photoURL || avatar} sx={{height: 46, width: 46}} alt="avatar"></Avatar>
                                        </Tooltip>
                                    </div>
                                </div> 
                                <div className="flex flex-col items-center pt-6">
                                    <p className="hidden sm:block font-roboto font-medium text-xs sm:text-sm md:text-md xl:text-lg text-gray-700 no-underline tracking-normal leading-none mb-2">{user?.email || userData?.email}</p>
                                    <p className="font-roboto font-bold text-sm text-center text-gray-700 no-underline tracking-normal py-3">Become a premium member</p>
                                </div>
                                <div className="flex flex-col">
                                    <div className="hidden sm:flex items-center pb-4">
                                        <img className="h-10 mx-2" src={location} alt="location" />
                                        <p className="font-roboto font-bold text-sm md:text-md lg:text-lg no-underline tracking-normal leading-none">Wakanda</p>
                                    </div>
                                    <div className="hidden sm:flex items-center">
                                        <img className="h-10 mx-2" src={job} alt="job" />
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
                                                    <div className="w-full hover:bg-gray-100 duration-300 ease-in-out" key={friend.id}>
                                                        <div className="mr-1 md:mr-2 lg:mr-4 flex flex-wrap items-center justify-between">
                                                            <div className="w-full sm:w-auto">
                                                                <Link to={`/profile/${friend.id}`}>
                                                                    <div className="flex items-center pl-2 my-2 cursor-pointer justify-center">
                                                                        <div className="flex items-center">
                                                                            <Avatar size="sm" variant="circular" src={friend?.image || avatar} alt="avatar" />
                                                                            <p className="hidden sm:block ml-4 font-roboto font-medium text-xs md:text-sm text-gray-700 no-underline tracking-normal leading-none">{friend.name}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="w-full sm:w-auto flex justify-center gap-4 md:gap-8">
                                                                <div className="cursor-pointer" onClick={() => startConversation(friend.id)}>
                                                                    <FontAwesomeIcon icon={faCommentDots} className="h-4 text-blue-300 hover:text-blue-700" />
                                                                </div>
                                                                <div className="cursor-pointer" onClick={() => removeFriend(friend.id, friend.name, friend.image)}>
                                                                    <FontAwesomeIcon icon={faTrash} className="h-4"/>
                                                                </div>
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
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Navbar;