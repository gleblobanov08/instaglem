import React from "react";

const CardSection = () => {
    return (
        <div>
            <div className="grid grid-cols-3 gap-4 pt-8 mb-6">
                <div className="h-34 sm:h-48 border-2 border-gray-500 rounded-lg hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg flex justify-center items-center">
                    <p className="text-5xl">+</p>
                </div>
                <div className="h-32 sm:h-48 border-2 border-gray-500 rounded-lg hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg flex justify-center">
                    <p className="mt-5 text-lg font-bold">Stories</p>
                </div>
                <div className="h-32 sm:h-48 border-2 border-gray-500 rounded-lg hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg flex justify-center">
                    <p className="mt-5 text-lg text-center font-bold">Coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default CardSection;