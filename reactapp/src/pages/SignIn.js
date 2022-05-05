import { crdRequest, getCookie, setCookie, userRequest } from "../functions";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BACKEND_ROOT_URL } from "../setting";
import React from "react";
import jquery from "jquery";



let inputErrors = {
    inputUsername: [],
    inputPassword: [],
}

function eraseErrors() {
    jquery('.error-list').html('');
}

function drawErrors() {
    for (var key in inputErrors) {
        if (inputErrors.hasOwnProperty(key)) {
            let errorEls = [];
            
            inputErrors[key].forEach(msg => {
                console.log({msg});
                let errEl = jquery('<span>');
                errEl.addClass('text-danger');
                errEl.html(msg);
                errorEls.push(errEl);
            });
            inputErrors[key] = [];

            jquery(`#${key}+.error-list`).append(...errorEls);
        }
    }
    setTimeout(eraseErrors, 3000);
}


async function loginResponse (username, password) {
    let url = `${BACKEND_ROOT_URL}auth/token/login/`;
    const res = await crdRequest('POST', url, {username, password});
    return res;
}



export default function SignIn() {
    if (window.user) window.location.href = '/';

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSignIn = (e) => {
        e.preventDefault();

        if (!username || !password) {
            // console.log('password field is empty');
            // inputErrors.inputPassword.push('password field is empty');
            return;
        }

        loginResponse(username, password)
            .then((res)=>{
                console.log(res);
                if (res.auth_token) {
                    setCookie('access_token', `Token ${res.auth_token}`);
                    // let user = await userRequest();
                    // window.user = user;
                    window.location.href = '/';
                }
            })
            .catch((err) => {
                console.log({err});
            });
    }

    return (
        <main className="container mt-3 d-flex justify-content-center">
            <form className="col-6 col-sm-4" onSubmit={handleSignIn}>
                <h1 className="h3 mb-3 font-weight-normal text-center">Please sign in</h1>
                <div className="mb-3">
                    <input 
                        type="text" 
                        id="inputUsername" 
                        className="form-control" 
                        placeholder="Username" 
                        required autoFocus=""
                        onChange={(e)=>{setUsername(e.target.value)}}
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
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <div className="error-list d-flex flex-column"></div>
                </div>
                <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me"/> Remember me
                </label>
                </div>
                <p>Have not registered yet? You can do this now - 
                    <Link to="/signup">signup</Link>
                </p>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-lg btn-primary btn-block" id="signin-submit">Sign in</button>
                </div>
                <p className="mt-5 mb-3 text-muted">© 1717-2022</p>
            </form>  
        </main>
    )
}