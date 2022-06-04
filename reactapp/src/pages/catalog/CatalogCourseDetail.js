import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import Comment from '../components/Comment'
import {Nav, Button, Spinner, ListGroup} from 'react-bootstrap';
import telegram_icon from "../../images/social_icons/telegram.ico";
import vk_icon from "../../images/social_icons/vk.ico";
import whatsapp_icon from '../../images/social_icons/whatsapp.ico';
import parseHtml from 'html-react-parser';


const loadCourse = async ({courseId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/`;
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}


export default function CatalogCourseDetail() {
    let urlParams = useParams();
    // urlParams.courseId;

    const { data, error, isPending } 
        = useAsync({ 
            promiseFn: loadCourse, 
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
        console.log(courseObj)
        let img_url = `${BACKEND_DOMAIN}${courseObj.banner_lg}`;

        return (
            <>
                <div className="text-white bg-secondary position-relative">
                    <div style={{backgroundImage: `url(${img_url})`}} className="course-banner" />
                    <div className="p-4 p-md-5 mb-4 container position-relative">
                        <div className="col-md-6 px-0">
                            <h1 className="display-4 fst-italic">{courseObj.title}</h1>
                            <p className="lead my-3">
                                { courseObj.short_description }
                            </p>
                            <p className="lead mb-0">
                                {/* <a href="#" className="text-white fw-bold">Continue reading...</a> */}
                            </p>
                        </div>
                    </div>
                    
                </div>

                
                <div className="container position-relative">
                    <div className="row g-5">
                        <div className="col-md-8">
                            <Nav className="my-4 border-bottom course-description-section-list">
                                <Nav.Link className="h5" href="#" active>Описание</Nav.Link>
                                <Nav.Link className="h5" href="#">Авторы</Nav.Link>
                                <Nav.Link className="h5" href="#">Программа</Nav.Link>
                                <Nav.Link className="h5" href="#">Отзывы</Nav.Link>
                            </Nav>

                            <div className="blog-post">
                                <h2 className="blog-post-title">Про курс</h2>
                                {/* <p className="blog-post-meta">
                                    December 23, 2020 by 
                                    <a href="#">Jacob</a>
                                </p> */}
                                {parseHtml(courseObj.description)}
                                
                            </div>
                        </div>

                        <div className="col-md-4 ">
                            <div className="position-sticky mt-2">
                                <div className="p-4 mb-3 rounded">
                                    <h4 className="fst-italic">Start</h4>
                                    <p className="mb-0">
                                        Вы можете начать сейчас или запланировать на другое время.
                                    </p>
                                    <Nav defaultActiveKey="/home" className="flex-column" variant="pills">
                                        <Nav.Link 
                                            className="bg-success text-center my-2 text-light start-course-btn" 
                                            href={`/courses/${urlParams.courseId}`}
                                        >
                                            Начать прохождение
                                        </Nav.Link>
                                        <Nav.Link 
                                            className="bg-warning text-center plan-course-btn" 
                                            eventKey="link-1"
                                        >
                                            Запланировать
                                        </Nav.Link>
                                    </Nav>
                                </div>

                                <div className="p-4">
                                    <h4 className="fst-italic">Поделиться</h4>
                                    {/* <ol className="list-unstyled mb-0">
                                        <li><a href="#">вконтакте</a></li>
                                        <li><a href="#">telegram</a></li>
                                        <li><a href="#">однокласники</a></li>
                                        <li><a href="#">facebook</a></li>
                                        <li><a href="#">twitter</a></li>
                                    </ol> */}
                                    
                                    <ListGroup horizontal className="list-unstyled social-icons">
                                        <ListGroup.Item>
                                            <a 
                                                target="_blank" 
                                                rel="nofollow noopener" 
                                                href={`whatsapp://send?text=${window.location.href}`}
                                                className="social-whatsapp"
                                                >
                                                    <img src={whatsapp_icon} alt="[x]"/>
                                            </a>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <a 
                                                href={`https://t.me/share/url?url=${window.location.href}&amp;text=seehowicool`}
                                            >
                                                <img src={telegram_icon} alt="[x]"/>
                                            </a>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <a 
                                                href={`https://vkontakte.ru/share.php?url=${window.location.href}`} 
                                                target='_blank'
                                            >
                                                <img src={vk_icon} alt="[x]"/>
                                            </a>
                                        </ListGroup.Item>

                                    </ListGroup>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
