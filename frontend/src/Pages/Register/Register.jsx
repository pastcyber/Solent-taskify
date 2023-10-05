import styles from '../../css/login.module.css'

import React, { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase';


function Register() {
    const email = useRef()
    const password = useRef()
    const [error, seterror] = useState(false)
    const navigate = useNavigate()

    const handleSignup = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email.current.value, password.current.value);
            navigate('/')
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
    return (
        <div>
            <div className={styles.bgLogin + " container-fluid"}>
                <div className="row" style={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
                    <div className={styles.box + " col-lg-3 "} >
                        <img src="/svg/logo.svg" alt="" width={"100px"} />
                        <p className='mt-3' style={{ fontSize: "32px" }}>Create your Account!</p>
                        <p className='text-left mb-0' style={{ fontSize: "21px" }}>Email</p>
                        <input type="email" className='form-control mb-3' ref={email} />
                        <p className='text-left mb-0' style={{ fontSize: "21px" }}>Password</p>
                        <input type="password" className='form-control' ref={password} />

                        <button className={styles.signInBtn + " mt-4"} onClick={handleSignup}>SIGN UP</button>
                        <p style={{ fontSize: "16px" }}>Or Continue with</p>
                        {error && <div className=' my-2' >Error ! Please put Right  Credentials</div>}

                        <svg xmlns="http://www.w3.org/2000/svg" width="176" height="2" viewBox="0 0 176 2" fill="none">
                            <path d="M0 1H176" stroke="#F7F7F7" />
                        </svg>
                        <p className='text-center' style={{ color: "white" }}>Already have an account? <Link to={'/'}><span style={{ color: "white" }}> SIGN IN</span></Link></p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register
