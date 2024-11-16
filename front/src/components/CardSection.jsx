import React from "react";

const CardSection = () => {
    return (
        <div>
            <div className="grid grid-cols-4 gap-4 pt-8 mb-10">
                <div className="h-48 border-2 border-gray-500 rounded-lg hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg flex justify-center items-center">
                    <p className="text-5xl">+</p>
                </div>
                <div className="h-48 border-2 border-gray-500 rounded-lg hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg flex justify-center">
                    <p className="mt-5 text-lg font-bold">Stories</p>
                </div>
                <div className="h-48 border-2 border-gray-500 rounded-lg hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg flex justify-center">
                    <p className="mt-5 text-lg font-bold">Coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default CardSection;