import { BACKEND_ROOT_URL } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import Comment from '../components/Comment'
import {Nav, Button, Spinner, ListGroup} from 'react-bootstrap';
import telegram_icon from "../../images/social_icons/telegram.ico";
import vk_icon from "../../images/social_icons/vk.ico";
import whatsapp_icon from '../../images/social_icons/whatsapp.ico';

const loadCourse = async ({sectionId, topicId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}sections/${sectionId}/topics/${topicId}/comments/`;
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    console.log({res})
    return res;
}


export default function CatalogCourseDetail() {
    let urlParams = useParams();
    // urlParams.courseId;
    return (
        <>
            
            <div className="p-4 p-md-5 mb-4 text-white rounded bg-secondary">
                <div className="container">
                    <div className="col-md-6 px-0">
                        <h1 className="display-4 fst-italic">Python за 30 дней</h1>
                        <p className="lead my-3">
                            Курс посвящен базовым понятиям и элементам языка программирования Python (операторы, числовые и строковые переменные, списки, условия и циклы). Курс является вводным и наиболее подойдет слушателям, не имеющим опыта написания программ ни на одном из языков программирования.
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

                            <p>
                                В этом курсе по программированию на языке Python вы познакомитесь с базовыми понятиями программирования. Едва ли возможно научиться программировать без практики, поэтому в качестве домашних заданий вам будет предложено довольно много задач, в которых вы сможете потренировать своё умение программировать. 
                            </p>
                            <p>
                                Ваши решения будут проверяться автоматической системой, поэтому вы будете получать быструю обратную связь. В силу большого количества участников курса, преподаватели не смогут давать индивидуальных советов по каждой программе, но если у вас будут возникать проблемы, то их всегда можно обсудить с однокурсниками в комментариях к задачам.
                            </p>
                            <p>
                                Также в курсе присутствует несколько задач повышенной сложности, которые являются необязательными для прохождения курса, однако желающие смогут поломать голову над придумыванием алгоритмов и реализацией программ к этим задачам. Курс подготовлен на базе программы Института биоинформатики.
                            </p>
                            
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
                                {/* <ul class="list-unstyled social-icons">
                                    <li>
                                        <a 
                                        target="_blank" 
                                        rel="nofollow noopener" 
                                        href={`whatsapp://send?text=${window.location.href}`}
                                        className="social-whatsapp"
                                        >
                                            <img src={whatsapp_icon} alt="[x]"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={`https://t.me/share/url?url=${window.location.href}&amp;text=seehowicool`}
                                        >
                                            <img src={telegram_icon} alt="[x]"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                        href={`https://vkontakte.ru/share.php?url=${window.location.href}`} 
                                        target='_blank'
                                        >
                                            <img src={vk_icon} alt="[x]"/>
                                        </a>
                                    </li>
                                </ul> */}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// const loadTopic = async ({sectionId, topicId}, options) => {
//     let headers = {'Authorization': getCookie('access_token')};
//     let url = `${BACKEND_ROOT_URL}sections/${sectionId}/topics/${topicId}/comments/`;
//     const res = await request('GET', url, {}, headers, {signal: options.signal});
//     console.log({res})
//     return res;
// }


// export default function TopicDetail() {
//     let urlParams = useParams();
//     const { data, error, isPending } 
//         = useAsync({ 
//             promiseFn: loadTopic, 
//             sectionId: urlParams.sectionId, 
//             topicId: urlParams.topicId 
//         });

//     if (isPending) {
//         return <h1>Loading...</h1>
//     }
//     if (error) {
//         return <h1 className="text-danger">Error</h1>
//     }
//     if (data) {
//         console.log(data);
//         const comments = data.comments;
//         const topic = data.topic;
//         return (
//             <>
//                 <h3>Disscusing on {topic.title}</h3>
//                 <h4>Comments count: {topic.total_comments}</h4>
//                 <hr/>
//                 <div className="row actions-bar">
//                     <div className="col-1">
//                         <Link 
//                             className="btn btn-secondary" 
//                             to={`/sections/${urlParams.sectionId}/topics`} 
//                             role="button"
//                         >
//                             back
//                         </Link>

//                     </div>
//                     <div className="col-11 d-flex justify-content-end">
//                         <Link 
//                             className="btn btn-success" 
//                             to={`/sections/${urlParams.sectionId}/topics/create`} 
//                             role="button"
//                         >
//                             Edit
//                         </Link>
//                         <Link 
//                             className="btn btn-danger" 
//                             to={`/sections/${urlParams.sectionId}/topics/create`} 
//                             role="button"
//                         >
//                             Archive
//                         </Link>
//                     </div>
//                 </div>
//                 <hr/>

//                 <ul className="list-group comment-list">
//                 { 
//                 comments.length > 0 
//                 ?
//                 comments.map(
//                     (comment, ind) => <Comment comment={comment} key={ind} />) 
//                 :
//                 "There are no comments on this topic yet."
//                 }
//                 </ul>
//             </>
//         );
//     }
// }