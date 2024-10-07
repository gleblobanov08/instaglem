import React from "react";
import Navbar from "./Navbar";
import LeftItems from "./LeftItems";
import RightItems from "./RightItems";

const Home = () => {
    return (
        <div className="w-full">
            <div className="fixed top-0 z-10 w-full bg-white">
                <Navbar></Navbar>
            </div>
            <div className="flex bg-gray-100">
                <div className="flex-auto w-[20%] fixed top-12">
                    <LeftItems></LeftItems>
                </div>
                <div className="flex-auto w-[20%] fixed right-0 top-12">
                    <RightItems></RightItems>
                </div>
            </div>
        </div>
    )
}

export default Home;