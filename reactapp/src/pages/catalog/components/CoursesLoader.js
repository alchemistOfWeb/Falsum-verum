import { BACKEND_ROOT_URL } from "../../../setting";
import { getCookie, request,  } from "../../../functions";
import React from 'react';
import { useAsync } from 'react-async';
import {Nav, Button, Spinner, ListGroup} from 'react-bootstrap';
import { CourseCard } from "./CourseCard";


const loadCoursesList = async (options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/`;
    const res = await request('GET', url, {}, headers, {signal: options.signal})
    console.log({res})
    return res;
}

export default function CoursesLoader() {
    const { data, error, isPending } 
        = useAsync({ promiseFn: loadCoursesList });

    if (isPending) {
        return (
            <div className="d-flex align-items-center justify-content-center pt-5">
                <Spinner animation="border" variant="info"/>
            </div>
        )
    }
    if (error) {
        console.log({error})
        return <h1 className="text-danger">Error of loading sections.</h1>
    }
    if (data) {
        console.log({data})
        let coursesList = data.courses;
        return (
            <>
                { 
                    coursesList.length > 0 
                    ?
                    coursesList.map(
                        (courseObj, ind) => <CourseCard key={ind} props={courseObj}/>
                    ) 
                    :
                    "По заданным параметрам курсов не найдено."
                }
            </>
        )

    }
}