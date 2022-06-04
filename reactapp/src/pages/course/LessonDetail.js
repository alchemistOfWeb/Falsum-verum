import React from "react";
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link, Outlet, NavLink } from "react-router-dom";
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown, Spinner } from "react-bootstrap";
import CourseSidebar from "./CourseSidebar";


function activeLink({isActive}) {
    let defaultCls = "step-link nav-link"

    return isActive ? 
        defaultCls + " active"
        : 
        defaultCls;
}

function StepLink({stepObj}) {
    let iconEl = '';
    if (stepObj.step_type == 0) {
        iconEl = <i className="bi bi-square-fill"></i> 
    }
    if (stepObj.step_type == 1) {
        iconEl = <i class="bi bi-question-square-fill"></i>
    }

    return (
        <NavLink to={`steps/${stepObj.id}`} className={activeLink}>
            {iconEl}
        </NavLink>
    )
}

export default function LessonDetail() {
    let urlParams = useParams();
    const courseId = urlParams.courseId;
    const moduleId = urlParams.moduleId;
    const lessonId = urlParams.lessonId;

    let currentModule = window.currentCourse.modules
        .find((el)=>el.id == moduleId);

    let currentLesson = currentModule.lessons
        .find((el)=>el.id == lessonId);

    console.log({currentModule, currentLesson})
    // let currentLesson = window.currentCourse.modules[moduleId].lessons[lessonId];
    // console.log({currentLesson})

    // window.currentCourse.modules[]
    return (
        <>
            <Nav className="d-flex justify-content-center">
                {
                    currentLesson.steps
                        .map((step, ind) => {
                            return (
                                <StepLink 
                                    stepObj={step}
                                />
                            )
                        })
                }
                {/* <NavLink to="/">
                    <i className="bi bi-square-fill text-success mx-1"></i>
                </NavLink> */}
            </Nav>
            <hr />
            <h2 className="mb-4 text-center">{currentLesson.title}</h2>
            <hr />
            <Outlet/>
        </>
    )
}