import React from 'react';
import { crdRequest, getCookie, setCookie } from "../functions";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAsync } from "react-async";
import { BACKEND_ROOT_URL } from "../setting";


async function createuserResponse (params={}) {
    let data = {
        username: params.username,
        email: params.email,
        password: params.password,
    }
    let url = `${BACKEND_ROOT_URL}auth/users/`;
    const res = await crdRequest('POST', url, data);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export default function SignUp() {
    if (getCookie('access_token')) window.location.href = '/';
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            alert("No fields can be empty");
            return;
        }
        if (password !== confirmPassword) {
            alert("password must match confirm-password");
            return;
        }
        createuserResponse({username, email, password})
            .then((res)=>{
                console.log(res);

                if (res.id) {
                    window.location.href = '/signin';
                }
            })
            .catch((err) => {
                console.log({err});
            });
    }

    return (
        <main className="container mt-3 d-flex justify-content-center">
            <form className="col-6 col-sm-4" onSubmit={handleSignUp}>
                <h1 className="h3 mb-3 font-weight-normal text-center">Register</h1>
                <div className="mb-3">
                    <input 
                        type="text" 
                        id="inputUsername" 
                        className="form-control" 
                        placeholder="Username" 
                        required autofocus=""
                    />
                    <div className="error-list  d-flex flex-column"></div>
                </div>
                <div className="mb-3">
                    <input 
                        type="email" 
                        id="inputEmail" 
                        className="form-control" 
                        placeholder="Email address" 
                        required autofocus=""
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        id="inputPassword" 
                        className="form-control" 
                        placeholder="Password" 
                        required
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        id="inputPassword2" 
                        className="form-control" 
                        placeholder="Repeat password" 
                        required
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"/> Remember me
                </label>
                </div>
                <p>
                    Have already registered? You can 
                    <Link to="/signin">signin</Link>
                </p>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-lg btn-primary btn-block"
                        type="submit"
                    >
                        Sign up
                    </button>
                </div>
                <p className="mt-5 mb-3 text-muted">© 1917-2022</p>
            </form>  
        </main>
    )
}