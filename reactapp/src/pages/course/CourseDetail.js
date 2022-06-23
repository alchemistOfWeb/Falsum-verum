import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie, userRequest } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown, Spinner } from "react-bootstrap";
import CourseSidebar from "./CourseSidebar";
import "../../styles/course_undergoing.scss";


const loadFullCourse = async ({courseId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/?full=true`;
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}

function CourseLoader() {
    let urlParams = useParams();
    const courseId = urlParams.courseId;

    const { data, error, isPending } 
        = useAsync({ 
            promiseFn: loadFullCourse, 
            courseId: urlParams.courseId
        });

    if (isPending) {
        return (
            <div className="d-flex align-items-center justify-content-center pt-5">
                <Spinner animation="border" variant="info" size="xl"/>
            </div>
        )
    }
    if (error) {
        console.log({error})
        return <h1 className="text-danger">Error of loading course.</h1>
    }
    if (data) {
        let courseObj = data.course;
        console.log({courseObj})
        // let img_url = `${BACKEND_DOMAIN}${courseObj.banner_lg}`;
        window.currentCourse = courseObj;

        return (
            <div id="course-wrapper" className="d-flex">
                <CourseSidebar course={courseObj}/>
                <div id="content" className="px-4 px-md-5 pt-2 w-100">
                    <Outlet/>
                </div>
            </div>
        )
    }
}


export default function CourseDetail() {
    const { data, error, isPending } 
        = useAsync({ promiseFn: userRequest });

    if (isPending) {
        return <h1>Loading user...</h1>
    }
    if (error) {
        console.log({error});
        console.log('Error of loading user');
        window.alert('Вы не авторизованы!');
        window.location.href = '/signin';
    }
    if (data) { 
        console.log({user: data});
        window.user = data.user;
        return (
            <CourseLoader/>
        )
    }
}