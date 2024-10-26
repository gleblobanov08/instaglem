import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../data/firebase";
import Navbar from "../components/Navbar";
import LeftItems from "../components/LeftItems";
import Main from "../components/Main";
import profilePic from "../assets/profilePic.jpeg";
import avatar from "../assets/avatar.png";
import { Avatar } from "@mui/material";

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
            const q = query(collection(db, "users"), where("uid", "==", id));
            await onSnapshot(q, (doc) => {
                setProfile(doc.docs[0].data());
            })
        }
        getUserProfile();
    }, [id]);
    return (
        <div className="w-full">
            <div className="fixed top-0 z-10 w-full bg-white">
                <Navbar></Navbar>
            </div>
            <div className="flex bg-gray-100">
                <div className="flex-auto w-[25%] fixed top-12">
                    <LeftItems></LeftItems>
                </div>
                <div className="flex-auto w-[75%] absolute left-[25%] top-12 bg-gray-100 rounded-xl">
                    <div className="w-[80%] mx-auto">
                        <div>
                            <div className="relative py-4">
                                <img className="h-64 w-full rounded-md" src={profilePic} alt="profilePic" />
                                <div className="absolute bottom-10 left-6">
                                  <Avatar size="xl" variant="circular" src={profile?.image || avatar} alt="avatar"></Avatar>
                                  <p className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                                    {profile?.email}
                                  </p>
                                  <p className="py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">
                                    {profile?.name}
                                  </p>
                                </div>
                                <div className="flex flex-col absolute right-6 bottom-10">
                                  <div className="flex items-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="#fff"
                                      className="w-6 h-6">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                                    </svg>

                                    <span className="ml-2 py-2 font-roboto font-medium text-sm text-white no-underline tracking-normal leading-none">From Earth, Milky Way</span>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <Main></Main>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;