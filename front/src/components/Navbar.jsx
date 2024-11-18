import React from "react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";

const Navbar = () => {
    return (
        <div className="flex justify-evenly items-center border-b border-gray-100 w-full px-4 md:px-10 py-2">
            <Link to="/">
                <div className="mr-3 sm:mr-0 text-xl sm:text-3xl font-extra-bold text-gray-900 dark:text-white font-roboto">
                    <span className="text-transparent bg-clip-text bg-blue-400">Instaglem</span>
                </div>
            </Link>
            <div className="flex justify-center item-center mx-auto">
                <NavLinks></NavLinks>
            </div>
        </div>
    )
}

export default Navbar;