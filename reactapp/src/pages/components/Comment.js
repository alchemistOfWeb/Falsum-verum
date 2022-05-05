import React from "react";
import { useState } from "react";
import { BACKEND_DOMAIN } from "../../setting";


export default function Comment({comment}) {
    console.log({comment});
    const {report, setReport} = useState("")
    let profile_img = 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp';
    if (comment.author.profile) {
        profile_img = `${BACKEND_DOMAIN}${comment.author.profile.image_sm}`;
    }

    return (
        <li className="list-group-item list-comment-item">
            <div className="card" data-comment-id={comment.id}>
                <div className="card-body">
                    <div className="d-flex flex-start align-items-center">
                        <img className="rounded-circle shadow-1-strong me-3"
                            src={profile_img} alt="avatar" width="60"
                            height="60" />
                        <div>
                            <h6 className="fw-bold text-primary mb-1">{comment.author.username}</h6>
                            <p className="text-muted small mb-0">
                            Shared publicly - Jan 2020
                            </p>
                        </div>
                    </div>
        
                    <p className="mt-3 mb-4 pb-2">
                    {comment.content}
                    </p>
        
                    <div className="small d-flex justify-content-start">
                        <a href="#!" className="d-flex align-items-center me-3 comment-like">
                            <i className="far fa-thumbs-up me-2"></i>
                            <p className="mb-0">Like</p>
                        </a>
                        <a href="#!" className="d-flex align-items-center me-3">
                            <i className="far fa-comment-dots me-2"></i>
                            <p className="mb-0">Comment</p>
                        </a>
                    </div>
                </div>
                <div 
                    className="card-footer py-3 border-0 comment-reply"
                >
                    <div className="d-flex flex-start w-100">
                    <img 
                        className="rounded-circle shadow-1-strong me-3"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp" alt="avatar" width="40"
                        height="40" 
                    />
                    <div className="form-outline w-100">
                        <textarea 
                            className="form-control" 
                            id={`textAreaExample_${comment.id}`} 
                            rows="4"
                            style={{background: "#fff"}}
                            value={report} 
                            onChange={e => setReport(e.target.value)}
                            placeholder="Write your report here"
                        />                        
                    </div>
                    </div>
                    <div className="float-end mt-2 pt-1">
                    <button type="button" className="btn btn-primary btn-sm">Post comment</button>
                    <button type="button" className="btn btn-outline-warning btn-sm">Cancel</button>
                    </div>
                </div>
            </div>
        </li>
    )
}