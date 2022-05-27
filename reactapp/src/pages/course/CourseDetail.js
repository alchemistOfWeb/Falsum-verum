import { BACKEND_ROOT_URL } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';


export default function CourseDetail() {
    return (
        <div className="container">
            <h1>Course Detail</h1>
        </div>
    )
}