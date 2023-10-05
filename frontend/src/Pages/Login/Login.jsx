import styles from '../../css/login.module.css'

import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase';
import { googleProvider ,facebookProvider ,twitterProvider} from '../../firebase'; // Import your Firebase config



function Login() {
    const email = useRef()
    const password = useRef()
    const [error, seterror] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const userInfo = await auth.signInWithEmailAndPassword(email.current.value, password.current.value);
            console.log(userInfo);
            localStorage.setItem("userId", userInfo?.user?.uid);
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            seterror(true)
        }
    };


        useEffect(() => {
            if (error) {
                const timeoutId = setTimeout(() => {
                    seterror(false);
                }, 5000); // 5000 milliseconds (5 seconds)

                // Cleanup the timeout if the component unmounts or if the error state changes.
                return () => clearTimeout(timeoutId);
            }
        }, [error]);


        const handleSignInWithGoogle = async () => {
            try {
                const userInfo = await auth.signInWithPopup(googleProvider);
                console.log(userInfo);
                localStorage.setItem("userId", userInfo?.user?.uid);
                navigate('/dashboard')
            } catch (error) {
                console.error('Google Sign-In Error:', error);
                seterror(true)
            }
        }
    return (
        <div className={styles.bgLogin + " container-fluid"} style={{height:"100vh"}}>
            <div className="row" style={{  justifyContent: "center", alignItems: "center" }}>
                <div className={styles.box + " col-lg-3 "} >
                <img src="/svg/logo.svg" alt="" width={"100px"} />
                    <p className='mt-3' style={{fontSize:"32px"}}>Sign in to Your Account</p>
                    <p className='text-left mb-0' style={{fontSize:"21px"}}>Email</p>
                    <input type="email" className='form-control mb-3' ref={email}   />
                    <p className='text-left mb-0'  style={{fontSize:"21px"}}>Password</p>
                    <input type="password" className='form-control' ref={password} />

                    <p className='text-right'  style={{fontSize:"16px"}}>Forgot Password?</p>

                    <button className={styles.signInBtn} onClick={handleLogin}>SIGN IN</button>
                    <p  style={{fontSize:"16px"}}>Or Continue with</p>
                    <div className={styles.social + ""}>
                        <img onClick={handleSignInWithGoogle} src="/images/google.png" alt="" />
                    </div>
                    {error && <div className=' my-2' >Error ! Please put Right  Credentials</div>}

                    <svg xmlns="http://www.w3.org/2000/svg" width="176" height="2" viewBox="0 0 176 2" fill="none">
                        <path d="M0 1H176" stroke="#F7F7F7" />
                    </svg>
                    <Link to={'/register'}><button className={styles.signupBtn}  style={{fontSize:"14px"}}>Sign Up for a New Account</button></Link>
                </div>

            </div>
        </div>
    )
}

export default Login
