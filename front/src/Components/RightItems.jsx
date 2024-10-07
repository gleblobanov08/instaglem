import React, { useState } from "react";
import nature2 from "../assets/nature2.jpeg"

const RightItems = () => {
    const [input, setInput] = useState("");

    return (
        <div className="flex flex-col h-screen bg-white shadow-lg border-2 rounded-l-xl">
            <div className="flex flex-col items-center relative pb-3">
                <img className="h-28 w-full rounded-l-xl" src={nature2} alt="nature2" />
            </div>
            <p className="font-roboto font-normal text-sm text-gray-700 max-w-fit no-underline tracking-normal leading-tight py-2 mx-2">
        Through photography, the beauty of Mother Nature can be frozen in time.
        This category celebrates the magic of our planet and beyond — from the
        immensity of the great outdoors, to miraculous moments in your own
        backyard.</p>
            <div className="mx-2 mt-8">
                <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
                  Friends:{" "}
                </p>
                <input className="border-0 outline-none mt-4" name="input" value={input} type="text" placeholder="Search..." onChange={(e) => setInput(e.target.value)}></input>
            </div>
        </div>
    )
}

export default RightItems;