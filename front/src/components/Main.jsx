import React from "react";
import { Avatar, Button } from "@mui/material";
import avatar from "../assets/avatar.jpeg";
import addImage from "../assets/add-image.png";
import live from "../assets/live.png";

const Main = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
                <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
                    <Avatar size="sm" variant="circular" src={avatar} alt="avatar"></Avatar>
                    <form className="w-full">
                        <div className="flex justify-between items-center">
                            <div className="w-full ml-4">
                                <input className="outline-none w-full bg-white rounded-md" type="text" placeholder="Share your thoughts..." />
                            </div>
                            <div className="mx-4">
                                {/* img */}
                            </div>
                            <div className="mr-4">
                                <Button variant="text" type="submit">Post</Button>
                            </div>
                        </div>
                    </form>
          
                </div>
                <span>{/* progressbar */}</span>
                <div className="flex justify-around items-center pt-4">
                    <div className="flex items-center">
                        <label htmlFor="addImage" className="cursor-pointer flex items-center">
                            <img className="h-10 mr-4" src={addImage} alt="addimage" />
                        </label>
                        <Button variant="text">Upload</Button>
                        <input id="addImage" type="file" style={{display: "none"}} />
                    </div>
                    <div className="flex items-center">
                        <img className="h-10 mr-4" src={live} alt="live" />
                        <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">Live</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col py-4 w-full">
                {/* posts */}
            </div>
            <div>
                {/* reference for later */}
            </div>
        </div>
    )
}

export default Main;