import React from "react";
import Navbar from "../components/Navbar";
import CardSection from "../components/CardSection";
import Main from "../components/Main";

const Home = () => {
    return (
        <div className="w-full">
            <Navbar></Navbar>
            <div className="flex-auto w-full absolute top-10 bg-gray-100 rounded-xl">
                <div className="w-[90%] mx-auto">
                    <CardSection></CardSection>
                    <Main></Main>
                </div>
            </div>
        </div>
    )
}

export default Home;