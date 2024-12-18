import React from "react";

const Modal = ({onClose, children}) => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={onClose}></div>
            <div className="fixed top-0 left-0 w-[25%] sm:w-[30%] h-full bg-white shadow-lg z-50 transition-transform transform translate-x-0">
                <div className="mx-1 h-full overflow-y-auto rounded-lg shadow-lg">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Modal;