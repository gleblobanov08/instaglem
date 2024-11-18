import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PacmanLoader } from "react-spinners";
import { AuthContext } from "../context/AppContext";
import { auth, onAuthStateChanged } from "../data/firebase";
   
const Login = () => {
    const { signInWithGoogle, loginWithEmailAndPassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
    }, [navigate])

    let initialValues = {
        email: "",
        password: "",
      };
    
      const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string().required("Required").min("6", "Password isn't long enough").matches(/^[a-zA-Z0-9]+$/, "Password is too good"),
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = formik.values;
        if (formik.isValid === true) {
            loginWithEmailAndPassword(email, password);
            setLoading(true)
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
            <div className="grid grid-cols-1 h-screen justify-items-center items-center">
                <div className="mx-auto w-[80%] lg:w-[30%]">
                    <Card>
                        <CardHeader title="Sign In" style={{margin: '16px', padding: '20px 0', borderRadius: 10, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'rgb(59, 108, 246)', color: 'white'}}></CardHeader>
                        <CardContent className="flex w-full flex-col gap-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                    <input type="email" name="email" placeholder="Email" style={{width: '100%', border: '1px solid gray', padding: 10}} {...formik.getFieldProps("email")} />
                                </div>
                                <div>
                                    {formik.touched.email && formik.errors.email && (
                                        <Typography variant="small" color="red">{formik.errors.email}</Typography>
                                    )}
                                </div>
                                <div className="my-4">
                                    <input type="password" name="password" placeholder="Password" style={{width: '100%', border: '1px solid gray', padding: 10}} {...formik.getFieldProps("password")} />
                                </div>
                                <div>
                                    {formik.touched.password && formik.errors.password && (
                                        <Typography variant="small" color="red">{formik.errors.password}</Typography>
                                    )}
                                </div>
                                <Button variant="contained" fullWidth className="mb-4" type="submit">Login</Button>
                            </form>
                            <div>
                                <Button variant="contained" fullWidth style={{marginBottom: 30}} onClick={signInWithGoogle}>Sign In with Google</Button>
                                <Link to="/reset">
                                    <p className="ml-1 font-roboto font-medium text-sm text-blue-500 text-center">Reset password</p>
                                </Link>
                                <div className="mt-6 mb-4 flex items-center font-roboto text-base justify-center">
                                    Don't have an account?
                                    <Link to="/signup">
                                        <p className="ml-1 font-bold font-roboto text-sm text-blue-500 text-center">Sign Up</p>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            )}
        </>
    );
}
  
export default Login;