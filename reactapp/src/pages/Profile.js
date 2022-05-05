import React from "react";
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from '../setting';
import { request, getCookie, getAccessToken } from '../functions';
import { useAsync } from 'react-async';
// import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";


const loadProfile = async (options) => {
    let headers = {'Authorization': getAccessToken()};
    let url = `${BACKEND_ROOT_URL}profile/`;
    const res = await request('GET', url, {}, headers, options);
    return res;
}



export default function Profile() {
    // let urlParams = useParams();
    if (!window.user) {
        window.history.back();
    }
    
    const user = window.user;
    const profile = user.profile;

    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    console.log({user, profile});

    function handleEditProfile(e) {
        e.preventDefault();
        console.log({email, firstName, lastName});
    }    
    function handleChangePassword(e) {
        e.preventDefault();
        console.log({password});
    }    

    return (
        <div className="container rounded mt-5 mb-5 profile-section">
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img 
                        className="rounded-circle mt-5" 
                        width="150px" 
                        src={`${BACKEND_DOMAIN}${profile.image_sm}`}/>
                        <span className="font-weight-bold">{user.username}</span>
                        <span className="text-secondary">{user.email}</span>
                        <span> </span>
                    </div>
                </div>
                <div className="col-md-5 border-right">
                    <form className="p-3 py-5" onSubmit={handleEditProfile}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Profile Settings</h4>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <label className="labels">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="first name" 
                                    value={firstName} 
                                    onChange={(e)=>setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="labels">Surname</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="password"
                                    value={lastName} 
                                    onChange={(e)=>setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            {/* <div className="col-md-12">
                                <label className="labels">Mobile Number</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="enter phone number" 
                                    value=""
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">State</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="enter address line 2" 
                                    value=""
                                />
                            </div> */}
                            <div className="col-md-12">
                                <label className="labels">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="enter email" 
                                    valueDefault={'hell'}
                                    value={email} 
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button className="btn btn-primary profile-button" type="submit">
                                Save Profile
                            </button>
                        </div>
                    </form>
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Change password</h4>
                        </div>
                        <form className="row mt-2" onSubmit={handleChangePassword}>
                            <div className="col-md-6">
                                <label className="labels">new password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="write new password" 
                                    value={password} 
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="labels">confirm new password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="repeat password"
                                    value={confirmPassword} 
                                    onChange={(e)=>setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </form>
                        <div className="mt-3 text-center">
                            <button className="btn btn-primary profile-button" type="submit">
                                Save Password
                            </button>
                        </div>
                    </div>
                </div>
                {/* <div className="col-md-4">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center experience">
                            <span>Edit Experience</span>
                            <span className="border px-3 p-1 add-experience">
                                <i className="fa fa-plus"></i>&nbsp;Experience
                            </span>
                        </div><br/>
                        <div className="col-md-12">
                            <label className="labels">Experience in Designing</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="experience" 
                                value=""
                            />
                        </div><br/>
                        <div className="col-md-12">
                            <label className="labels">Additional Details</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="additional details" 
                                value=""
                            />
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
    
}