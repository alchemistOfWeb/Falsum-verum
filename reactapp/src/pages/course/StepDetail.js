import React from "react";
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie } from '../../functions';
import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown, Spinner } from "react-bootstrap";
import CourseSidebar from "./CourseSidebar";
import parseHtml from 'html-react-parser';


const loadStep = async ({courseId, moduleId, lessonId, stepId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${stepId}`;
    console.log({url})
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}

export default function StepDetail() {
    let { courseId, moduleId, lessonId, stepId } = useParams();
    console.log({stepId});

    // const [error, setError] = useState(null);
    // const [isPending, setIsPending] = useState(false);
    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     const { data, error, isPending } = useAsync({
    //         promiseFn: loadStep,
    //         courseId: courseId,
    //         moduleId: moduleId,
    //         lessonId: lessonId,
    //         stepId: stepId,
    //     });
    //     setIsPending(isPending);
    //     setError(error);
    //     setData(data);
    // }, [courseId, moduleId, lessonId, stepId]);

    const { data, error, isPending } 
        = useAsync({ 
            courseId: courseId,
            moduleId: moduleId,
            lessonId: lessonId,
            stepId: stepId,
            promiseFn: loadStep, 
            watch: stepId
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
        let stepObj = data.step;
        console.log({stepObj});
        return (
            <>
                <h2 className="text-center">{stepObj.title}</h2>
                <hr />
                <div className="step-content pb-3">
                    {parseHtml(stepObj.content)}
                    <hr />
                    
                </div>
                
            </>
        )
    }
}