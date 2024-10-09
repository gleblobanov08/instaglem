import React, { useState } from "react";
import nature from "../assets/nature.jpeg";
import avatar from "../assets/avatar.jpeg";
import job from "../assets/job.png";
import location from "../assets/location.png";
import { Avatar, Tooltip } from "@mui/material";

const LeftItems = () => {

    const [value, setValue] = useState("");

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <div className="flex flex-col h-screen bg-white pb-4 border-2 rounded-r-xl shadow-lg">
            <div className="flex flex-col items-center relative">
                <img className="h-28 w-full rounded-r-xl" src={nature} alt="nat" />
                <div className="absolute -bottom-4">
                    <Tooltip title="Profile" placement="top">
                        <Avatar src={avatar} sx={{height: 46, width: 46}} alt="avatar"></Avatar>
                    </Tooltip>
                </div>
            </div> 
            <div className="flex flex-col items-center pt-6">
                <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none mb-2">
                    User Email
                </p>
                <p className="font-roboto font-bold text-sm text-gray-700 no-underline tracking-normal leading-none py-3">
                    Become a premium member
                </p>
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
                    <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none">
                        Events
                    </p>
                    <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none my-2">
                        Groups
                    </p>
                    <p className="font-roboto font-bold text-md text-[#0177b7] no-underline tracking-normal leading-none">
                        Follow
                    </p>
                </div>
            <div className="mt-8">
                <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
                  Friends:{" "}
                </p>
                <input className="border-0 outline-none cursor-pointer mt-4" name="input" value={value} type="text" placeholder="Search..." onChange={handleChange}></input>
            </div>
            </div>
        </div>
    )
}

export default LeftItems;