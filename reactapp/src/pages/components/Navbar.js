import { Link } from "react-router-dom"
import { crdRequest, getCookie, deleteCookie } from "../../functions";
import { BACKEND_ROOT_URL } from "../../setting";
import React from "react";


async function logoutResponse () {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}auth/token/logout/`;
    const res = await crdRequest('POST', url, {}, headers);    
    return res;
}

function handleLogout() {
    if (window.confirm('Do you really want to logout?')) {
        logoutResponse()
            .then((res)=>{
                console.log({res})
                window.user = undefined;
                deleteCookie('access_token');
                window.location.href = '/';
            });
    }
}

export default function Navbar() {
    let UserBtns = null;
    if (window.user) {
        UserBtns = () => (
            <>
                <Link 
                    to="/personal" 
                    role="button"
                    className="btn btn-outline-light me-2 text-decoration-none btn-dark-light"
                    id="personal-btn"
                >
                    Profile
                </Link>
                <Link 
                    to="#logout" 
                    role="button"
                    className="btn btn-warning text-dark text-decoration-none"
                    id="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </Link>
            </>
        )
    } else {
        UserBtns = () => (
            <>
                <Link 
                    to="/signin" 
                    role="button"
                    className="btn btn-outline-light me-2 text-decoration-none btn-dark-light"
                    id="signin-btn"
                >
                    Login
                </Link>
                <Link 
                    to="/signup" 
                    role="button"
                    className="btn btn-warning text-dark text-decoration-none"
                    id="signup-btn"
                >
                    Signup
                </Link>
            </>
        )
    }

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li>
                        <Link to="/" className="nav-link px-2 text-secondary">Home</Link>
                    </li>
                    <li>
                        <Link to="/sections" className="nav-link px-2 text-white">Sections</Link>
                    </li>
                    <li>
                        <Link to="/about" className="nav-link px-2 text-white">About</Link>
                    </li>
                    <li>
                        <Link to="/rules" className="nav-link px-2 text-white">Rules</Link>
                    </li>
                    </ul>

                    <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                    <input type="search" className="form-control form-control-dark" placeholder="Search..." aria-label="Search"/>
                    </form>

                    <div className="text-end">
                        <UserBtns/>
                    </div>
                </div>
            </div>
        </header>
    )
}