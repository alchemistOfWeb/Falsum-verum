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
    let url = `${BACKEND_ROOT_URL}create/`;
    const res = await crdRequest('POST', url, data);
    // if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export default function SignUp() {
    // if (getCookie('access_token')) window.location.href = '/';
    if (window.user) window.location.href = '/';
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
            <form className="col-12 col-md-8 col-sm-9 col-lg-6 col-xl-4" onSubmit={handleSignUp}>
                <h1 className="h3 mb-3 font-weight-normal text-center">Регистрация</h1>
                <div className="mb-3">
                    <input 
                        type="text" 
                        id="inputUsername" 
                        className="form-control" 
                        placeholder="Логин"
                        onChange={(e)=>{setUsername(e.target.value)}}
                        required autofocus=""
                    />
                    <div className="error-list  d-flex flex-column"></div>
                </div>
                <div className="mb-3">
                    <input 
                        type="email" 
                        id="inputEmail" 
                        className="form-control" 
                        placeholder="Email" 
                        onChange={(e)=>{setEmail(e.target.value)}}
                        required autofocus=""
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        id="inputPassword" 
                        className="form-control" 
                        placeholder="Пароль" 
                        onChange={(e)=>{setPassword(e.target.value)}}
                        required
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        id="inputPassword2" 
                        className="form-control" 
                        placeholder="Повторите пароль" 
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        required
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"/> Запомнить меня
                </label>
                </div>
                <p>
                    Уже зарегистрированы? Вы можете 
                    <Link to="/signin" className="text-decoration-none"> войти</Link>
                </p>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-lg btn-primary btn-block"
                        type="submit"
                    >
                        Зарегистрироваться
                    </button>
                </div>
                <p className="mt-5 mb-3 text-muted">© 2022</p>
            </form>  
        </main>
    )
}