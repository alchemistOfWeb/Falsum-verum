import { BACKEND_ROOT_URL } from "../setting";
import { crdRequest, getAccessToken } from '../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
// import { useAsync } from 'react-async';
import { useState } from "react";


const createTopic = async (sectionId, data) => {
    let headers = {'Authorization': getAccessToken()};
    let url = `${BACKEND_ROOT_URL}sections/${sectionId}/topics/`;
    const res = await crdRequest('POST', url, data, headers);
    return res;
}


export default function TopicCreate() {
    let urlParams = useParams();
    const [title, setTitle] = useState('');
    
    const handleCreateTopic = (e) => {
        e.preventDefault();
        if (title.length < 4) return;
        createTopic(urlParams.sectionId, {title})
            .then((topic)=>{  
                console.log({topic});
                if (topic.id) {
                    window.location.href = `/sections/${urlParams.sectionId}/topics/${topic.id}`;
                }
            });
    }

    return (
        <>
            <hr/>
            <div className="row actions-bar">
                <div className="col-1">
                    <Link 
                        className="btn btn-secondary" 
                        to={`/sections/${urlParams.sectionId}/topics`} 
                        role="button"
                    >
                        back
                    </Link>
                </div>
            </div>
            <hr/>
            <main className="container mt-3 d-flex justify-content-center">
                <form className="col-6 col-sm-4" onSubmit={handleCreateTopic}>
                    <h1 className="h3 mb-3 font-weight-normal text-center">Creating topic</h1>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            id="inputTitle" 
                            className="form-control" 
                            placeholder="Title" 
                            required autofocus=""
                            onChange={(e)=>{setTitle(e.target.value)}}
                        />
                        <div className="error-list d-flex flex-column"></div>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-lg btn-primary btn-block" id="signin-submit">Create</button>
                    </div>
                </form>  
            </main>
        </>
    );
}