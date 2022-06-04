import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown, Spinner } from "react-bootstrap";
import CourseSidebar from "./CourseSidebar";


const loadFullCourse = async ({courseId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/?full=true`;
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}


export default function CourseDetail() {
    let urlParams = useParams();
    const courseId = urlParams.courseId;
    // const [courseId] = ;
    // let currentCourse = {
    //     id: 1,
    //     title: "Python за 30 дней",
    //     specialization: "Python-специалист",
    //     organization: "Mediasoft",
    //     doshow: true,
    //     tags: [
    //         {id: 4, title: "easy"},
    //         {id: 9, title: "base"},
    //         {id: 12, title: "programming"},
    //     ],
    //     modules: [
    //         {
    //             id: 3,
    //             title: "First module",
    //             description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam possimus magnam expedita odio.",
    //             order: 1,
    //             grade: 5,
    //             doshow: true,
    //             lessons: [
    //                 {
    //                     id: 105,
    //                     title: "Intruduction",
    //                     doshow: true,
    //                     grade: 0,
    //                     order: 1,
    //                     steps: [
    //                         {id: 991, is_complete: true, type: 0, order: 1},
    //                         {id: 992, is_complete: true, type: 0, order: 2},
    //                         {id: 993, is_complete: false, type: 0, order: 3},
    //                         {id: 994, is_complete: true, type: 1, order: 4}
    //                     ]
    //                 },
    //                 {
    //                     id: 106,
    //                     title: "Sample lesson",
    //                     doshow: true,
    //                     grade: 0,
    //                     order: 2,
    //                     steps: [
    //                         {id: 991, is_complete: true, type: 0, order: 1},
    //                         {id: 991, is_complete: false, type: 0, order: 2},
    //                         {id: 992, is_complete: false, type: 1, order: 3}
    //                     ]
    //                 },
    //             ]
    //         }
    //     ]
    // }

    const { data, error, isPending } 
        = useAsync({ 
            promiseFn: loadFullCourse, 
            courseId: urlParams.courseId
        });

    if (isPending) {
        return (
            <div className="d-flex align-items-center justify-content-center pt-5">
                <Spinner animation="border" variant="info"/>
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

        return (
            <div id="course-wrapper" className="d-flex">
                <CourseSidebar course={courseObj}/>
                <div id="content" className="px-4 px-md-5 pt-2">
                    <Outlet/>
                </div>
            </div>
        )
    }
}