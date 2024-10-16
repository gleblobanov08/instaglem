import React from "react";
import Navbar from "../components/Navbar";
import LeftItems from "../components/LeftItems";
import CardSection from "../components/CardSection";
import Main from "../components/Main";

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
            </div>
            <div className="flex-auto w-[80%] absolute left-[20%] top-12 bg-gray-100 rounded-xl">
                <div className="w-[90%] mx-auto">
                    <CardSection></CardSection>
                    <Main></Main>
                </div>
            </div>
        </div>
    )
}

export default Home;