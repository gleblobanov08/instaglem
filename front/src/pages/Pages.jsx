import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Reset from "./Reset";
import Profile from "./Profile";
import ChatRoom from "./Direct";
import UserChats from "./UserChats";
import PostSearch from "./PostSearch";

const Pages = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/reset" element={<Reset />}></Route>
                <Route path="/profile/:id" element={<Profile />}></Route>
                <Route path="/chats/:userId" element={<UserChats />}></Route>
                <Route path="/chat/:conversationId" element={<ChatRoom />}></Route>
                <Route path="/search" element={<PostSearch />}></Route>
            </Routes>
        </div>
    )
}

export default Pages;