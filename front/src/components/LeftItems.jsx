import React, { useContext, useState } from "react";
import background from "../assets/background.jpeg";
import avatar from "../assets/avatar.jpeg";
import job from "../assets/job.png";
import location from "../assets/location.png";
import { Avatar, Tooltip } from "@mui/material";
import { AuthContext } from "../context/AppContext";
import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../data/firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const LeftItems = () => {
    const [value, setValue] = useState("");
    const { user, userData } = useContext(AuthContext);
    const friendList = userData?.friends;

    const handleChange = (event) => {
        setValue(event.target.value);
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

    return (
        <div className="flex flex-col h-screen bg-white pb-4 border-2 rounded-r-xl shadow-lg">
            <div className="flex flex-col items-center relative">
                <img className="h-28 w-full rounded-r-xl" src={background} alt="nat" />
                <div className="absolute -bottom-4">
                    <Tooltip title="Profile" placement="top">
                        <Avatar src={user?.photoURL || avatar} sx={{height: 46, width: 46}} alt="avatar"></Avatar>
                    </Tooltip>
                </div>
            </div> 
            <div className="flex flex-col items-center pt-6">
                <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none mb-2">{user?.email || userData?.email}</p>
                <p className="font-roboto font-bold text-sm text-gray-700 no-underline tracking-normal leading-none py-3">Become a premium member</p>
            </div>
            <div className="flex flex-col pl-2">
                <div className="flex items-center pb-4">
                    <img className="h-10" src={location} alt="location" />
                    <p className="font-roboto font-bold text-lg no-underline tracking-normal leading-none">Wakanda</p>
                </div>
                <div className="flex items-center">
                    <img className="h-10" src={job} alt="job" />
                    <p className="font-roboto font-bold text-lg no-underline tracking-normal leading-none">Full-time unemployed</p>
                </div>
                <div className="flex flex-col justify-center items-center pt-4">
                    <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none">Events</p>
                    <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none my-2">Groups</p>
                    <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none">Follow</p>
                </div>
                <div className="mt-8">
                    <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">Friends:{" "}</p>
                    <input className="border-0 outline-none cursor-pointer mt-4" name="input" value={value} type="text" placeholder="Search..." onChange={handleChange} />
                    {friendList?.length > 0 ? (
                        searchFriends(friendList)?.map((friend) => {
                            return (
                                <div className="flex items-center justify-between hover:bg-gray-100 duration-300 ease-in-out" key={friend.id}>
                                    <Link to={`/profile/${friend.id}`}>
                                        <div className="flex items-center my-2 cursor-pointer">
                                            <div className="flex items-center">
                                                <Avatar size="sm" variant="circular" src={friend?.image || avatar} alt="avatar" />
                                                <p className="ml-4 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">{friend.name}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="mr-4 cursor-pointer" onClick={() => removeFriend(friend.id, friend.name, friend.image)}>
                                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="mt-10 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">Add friends to check their profile</p>
                     )}
                </div>
            </div>
        </div>
    )
}

export default LeftItems;