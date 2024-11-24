import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Avatar, Tooltip } from "@mui/material";
import { AuthContext } from "../context/AppContext";
import avatar from '../assets/avatar.png';

const NavLinks = () => {
  const { signOutUser, user, userData } = useContext(AuthContext);

  return (
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
      <Link to={`/profile/${user?.uid}`}>
        <Tooltip title="Profile" placement="bottom">
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </Tooltip>
      </Link>
      <Tooltip title="Coming soon..." placement="bottom">
        <div className="ml-4 hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
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
      <div className="mx-4 flex items-center" onClick={signOutUser}>
        <Tooltip title="Sign Out" placement="bottom">
            <Avatar src={userData?.photoURL || avatar} alt="user" sx={{height: 26, width: 26}}></Avatar>
        </Tooltip>
        <p className="hidden sm:block ml-4 font-roboto text-sm text-black font-medium no-underline">
          {user?.displayName === null && userData?.name !== undefined ? userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1) : user?.displayName?.split(" ")[0]}
        </p>
      </div>
    </div>
  );
};

export default NavLinks;