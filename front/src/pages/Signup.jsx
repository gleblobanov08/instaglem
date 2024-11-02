import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PacmanLoader } from "react-spinners";
import { AuthContext } from "../context/AppContext";
import { auth, onAuthStateChanged } from "../data/firebase";

const Signup = () => {
    const { signUpWithEmailAndPassword } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
                setLoading(false);
            } else {
                setLoading(false);
            }
        })
    }, [navigate]);

    let initialValues = {
        name: "",
        email: "",
        password: "",
      };
    
      const validationSchema = Yup.object({
        name: Yup.string().required("Required").min("4", "Username isn't long enough").matches(/^[a-zA-Z]+$/, "Name can only contain letters"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().required("Required").min("6", "Password isn't long enough").matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password } = formik.values;
        if (formik.isValid === true) {
            signUpWithEmailAndPassword(name, email, password);
            setLoading(true);
        } else {
            setLoading(false);
        }
      };
    
      const formik = useFormik({ initialValues, validationSchema, handleSubmit });
    
    return (
        <>
        {loading ? (
            <div className="grid grid-cols-1 justify-items-center items-center h-screen">
                <PacmanLoader color="#2562cc" loading size={40}/>
            </div>) : (
            <div className="grid grid-cols-1 justify-items-center items-center h-screen">
                <Card sx={{width: "30%"}}>
                    <CardHeader title="Sign Up" style={{width: '90%', margin: '10px auto', padding: '20px 0', borderRadius: 10, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(59, 108, 246)', color: 'white'}}></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <input type="text" name="name" placeholder="Username" style={{width: '100%', border: '1px solid gray', padding: 10}} {...formik.getFieldProps("name")}/>
                            </div>
                            <div>
                                {formik.touched.name && formik.errors.name && (
                                    <Typography variant="small" color="red">{formik.errors.name}</Typography>
                                )}
                            </div>
                            <div className="mt-4 mb-2">
                                <input type="email" name="email" placeholder="Email" style={{width: '100%', border: '1px solid gray', padding: 10}} {...formik.getFieldProps("email")}/>
                            </div>
                            <div>
                                {formik.touched.email && formik.errors.email && (
                                    <Typography variant="small" color="red">{formik.errors.email}</Typography>
                                )}
                            </div>
                            <div className="mt-4 mb-2">
                                <input type="password" name="password" placeholder="Password" style={{width: '100%', border: '1px solid gray', padding: 10}} {...formik.getFieldProps("password")}/>
                            </div>
                            <div>
                                {formik.touched.password && formik.errors.password && (
                                    <Typography variant="small" color="red">{formik.errors.password}</Typography>
                                )}
                            </div>
                            <Button variant="contained" fullWidth className="mb-4" type="submit">Sign Up</Button>
                        </form>
                        <div className="mt-6 flex font-roboto text-base justify-center">
                            Already have an account?
                            <Link to="/login">
                                <p className="ml-1 font-bold font-roboto text-base text-blue-500 text-center">Login</p>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
    </>
    )
}

export default Signup;