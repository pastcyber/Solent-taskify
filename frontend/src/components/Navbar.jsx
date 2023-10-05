import React from 'react'
import styles from '../css/navbar.module.css'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
function Navbar() {

    const navigate = useNavigate()

    const handleLogout = () => {
        // Sign out the user using Firebase
        auth
            .signOut()
            .then(() => {
                // Remove the user ID from local storage
                localStorage.removeItem('userId');

                // Redirect to the login page or any other desired route
                navigate('/');
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };
    return (
        <nav class={"navbar navbar-expand-lg navbar-light  " + styles.bgLight}>
            <a class="navbar-brand" href="#"><img src="/svg/logo.svg" alt="" /></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <Link class="nav-link mx-3  " to={'/dashboard'}>Dashboard <span class="sr-only">(current)</span></Link>
                    </li>
                    <li class="nav-item ">
                        <Link class="nav-link mx-3 " to={'/projects'}>Manage Projects <span class="sr-only">(current)</span></Link>
                    </li>
                    <li class="nav-item ">
                        <Link class="nav-link mx-3 " to={'/tasks'}>Tasks <span class="sr-only">(current)</span></Link>
                    </li>
                    <li class="nav-item ">
                        <Link class="nav-link mx-3 " to={'/events'}>Events & Appointments <span class="sr-only">(current)</span></Link>
                    </li>
                    <li class="nav-item ">
                        <Link class="nav-link mx-3 " to={'/timer'}>Pomodoro Timer <span class="sr-only">(current)</span></Link>
                    </li>
                </ul>
                <ul className='navbar-nav '>
                    <li className='nav-item'>
                        <form class="form-inline my-2 my-lg-0 d-flex justify-content-center">
                            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                        </form>
                    </li>
                    <li className='nav-item mx-3'>
                        <img src={auth?.currentUser?.photoURL ? auth?.currentUser?.photoURL : "images/profile.png"} alt="user" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                    </li>
                    <li className="nav-item d-flex" style={{alignItems:"center",color:"white",cursor:"pointer"}} onClick={handleLogout} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>
                    </li>

                </ul>

            </div>
        </nav>
    )
}

export default Navbar
