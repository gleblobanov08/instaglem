import React, { useState } from "react";
import { Typography, Button } from "@mui/material";

const Reset = () => {
    const [email, setEmail] = useState("");
    return (
        <div className="grid grid-cols-1 justify-items-center items-center h-screen">
            <div className="w-[80%] md:w-[40%]">
                <Typography variant="h6" color="blue-gray" className="pb-4">Enter the email address associated with your account and we'll send you a link to reset your password</Typography>
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{width: '100%', border: '1px solid gray', padding: 10}} />
                <Button variant="contained" fullWidth style={{marginTop: 20}}>
                    Send
                </Button>
            </div>
        </div>
    )
}

export default Reset;