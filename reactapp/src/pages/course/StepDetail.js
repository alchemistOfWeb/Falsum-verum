import React from "react";
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie, getAccessToken, crdRequest } from '../../functions';
import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { useAsync } from 'react-async';
import jquery from "jquery";
import personImg from "../../images/tesla-bot.jpg";

import { 
    Collapse, Form, ListGroup, 
    Nav, Container, Row, 
    Col, Dropdown, Spinner, 
    Button 
} from "react-bootstrap";

import CourseSidebar from "./CourseSidebar";
import parseHtml from 'html-react-parser';
import {MDBContainer, MDBRow, MDBCol, MDBBtn} from 'mdb-react-ui-kit';

const loadStep = async ({courseId, moduleId, lessonId, stepId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${stepId}`;
    console.log({url})
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}

function CheckAnswer({key, taskId, answer}) { // ?????????????????
    return (
        <Form.Check
            // required
            name={`task-${taskId}`}
            label={`${answer.text}`}
            // onChange={onChange}
            // isInvalid={!!errors.terms}
            // feedback={errors.terms}
            // feedbackType="invalid"
            id={`task${taskId}-${key}`} // ??????????????????
        />
    )
}


function TestTask({task, order}) {
    const taskTypes = {
        "Longer text answer": (el, ind) => {
            return <CheckAnswer 
                key={`task-${task.id}-ans-${ind}`} 
                taskId={task.id} 
                answer={el}
                // onChange={(e) => {setAnswer(e.target.value)}}
            />
        },
    }
    let mapCallback = taskTypes[task.structure.type];

    if (mapCallback) {
        return (
            <Form.Group className="my-3">
                <h5>{order+1}. {task.description}</h5>
                {task.structure.answers.map(mapCallback)}
            </Form.Group>
        )
    } else {
        return '';
    }
}

function TestForm({tasks}) {
    const [answer, setAnswer] = useState(null);
    let tc = null;
    if (tasks.length > 0) {
        tc = (
            <>
                {tasks.map((el, ind) => {
                    return <TestTask order={ind} key={`task-${el.id}`} task={el} />
                })}
                <Button type="submit">Отправить</Button>
            </>
        )
    } else {
        tc = <span>В этом тесте ещё нет ни одного вопроса.</span>;
    }

    return (
        <Form >
            {tc}
        </Form>
    )
}

function VideoComponent({step}) {
    return (
        <div className="video-lecture w-100 d-flex justify-content-center">
            <iframe className="video-lecture__iframe" width="560" height="315" src={step.video} title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    )
}

export default function StepDetail() {
    let { courseId, moduleId, lessonId, stepId } = useParams();
    console.log({stepId});

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
        let additionalContent = '';

        if (stepObj.step_type == 'Test') {
            additionalContent = (
                <>
                    <TestForm tasks={stepObj.tasks}/>
                    <hr/>
                </>
            )
        }
        if (stepObj.step_type == 'VideoLecture') {
            additionalContent = (
                <>
                    <VideoComponent step={stepObj}/>
                    <hr/>
                </>
            )
        }

        return (
            <>
                <h2 className="text-center">{stepObj.title}</h2>
                <hr />
                <div className="step-content pb-3">
                    {parseHtml(stepObj.content)}
                    <hr />
                    {additionalContent}
                    <CommentsList step={stepObj} />
                </div>
                
            </>
        )
    }
}

function getCommentsUrl({courseId, moduleId, lessonId, stepId, page=null}) {
    return `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/`
    + `lessons/${lessonId}/steps/${stepId}/comments${page?'?page='+page:'/'}`;
}

function CommentsList({step}) {

    // const [page, setPage] = useState(1);

    function SendCommentForm({courseId}) {
        const [commentBody, setCommentBody] = useState('');

        async function createCommentResponse(params={}, courseId, moduleId, lessonId, stepId) {
            let url = getCommentsUrl({courseId, moduleId, lessonId, stepId})
            // let url = 
            //     `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/`
            //     + `lessons/${lessonId}/steps/${stepId}/comments/`;

            let headers = {};
            let accessToken = getAccessToken();
            if (accessToken) {
                headers['Authorization'] = getAccessToken();
            }
            const res = await crdRequest('POST', url, params, headers);    
            return res;
        }

        function handleComment(e) {
            e.preventDefault();
            if (!commentBody) {
                alert("Поле текста не может быть пустым");
                return;
            }
            createCommentResponse({content: commentBody}, courseId)
                .then((res)=>{
                    console.log(res);
                    alert("Отзыв успешно отправлен");
                    document.location.reload();
                })
                .catch((err) => {
                    console.log({err});
                    alert("что-то пошло не так");
                });
        }

        function showCommentFrom(e) {
            jquery('#send-comment-from').toggleClass(['d-none', 'show']);
        }

        return (
            <>
                <div className="d-flex open-comment-form-btn__wrapper align-items-center">
                    <Button className={`open-comment-form-btn ${window.user ? "": "disabled"}`} variant="success" onClick={showCommentFrom}>
                        Прокомментировать
                    </Button>
                </div>
                <Form className="comment-form col-12 rounded px-0 py-3 fade d-none" onSubmit={handleComment} id="send-comment-from">
                    <Form.Group className="mb-1">
                        <Form.Control 
                            as="textarea" 
                            rows={5}
                            id="inputCommentBody" 
                            className="" 
                            placeholder="Введить текст отзыва сюда" 
                            required autofocus=""
                            onChange={(e)=>{setCommentBody(e.target.value)}}
                        />
                        <div className="error-list  d-flex flex-column"></div>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button type="submit" className="btn-primary btn-block comment-form__submit" size="lg">
                            Отправить
                        </Button>
                    </div>
                    <p>
                        * максимальная длина сообщения 1000 символов.
                    </p>
                </Form>
            </>
        )
    }

    function Comment({comment}) {
        return (
            <Row className="course-comment">
                <Col xs="12" className="course-comment__header d-flex">
                    <Col xs="2" className="course-comment__img-wrapper">
                        <img src={personImg} alt="" />
                    </Col>
                    <Col xs="8" className="course-comment__title-wrapper">
                        <Col xs="12">
                            <span className="course-comment__username">{comment.author.username}</span>
                        </Col>
                        <Col xs="12">
                            <span className="course-comment__updated-at">{comment.updated_at}</span>
                        </Col>
                    </Col>
                </Col>
                <Col xs="12" className="course-comment__content-wrapper">
                    {comment.content}
                </Col>
            </Row>
        )
    }

    const loadComments = async ([{courseId, moduleId, lessonId, stepId, page}], options) => {
        console.log('hello')
        let tkn = getAccessToken();
        let headers = {};
        if (tkn) {
            headers['Authorization'] = tkn;
        }
        console.log({courseId, page, options});
        let url = getCommentsUrl({courseId, moduleId, lessonId, stepId, page})
        // let url = 
        //         `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/`
        //         + `lessons/${lessonId}/steps/${stepId}/comments?page=${page}`;

        const res = await request('GET', url, {}, headers, {signal: options.signal});
        return res;
    }

    let urlParams = useParams();

    const { data, error, isPending, run }
        = useAsync({ 
            deferFn: loadComments,
        });

    function HandleClickShowMore() {
        console.log('HandleClickShowMore')
        run({
            courseId: urlParams.courseId,
            moduleId: urlParams.moduleId,
            lessonId: urlParams.lessonId,
            stepId: urlParams.stepId,
            page: window.page++}
        )
    }

    if (!window.page || window.page < 1) {
        window.page = 1;
    }

    let comments = [];

    let commentsInCashContent = (
        <>
            {comments.map((el, ind) => {
                return <Comment key={`comment-${ind}`} comment={el}/>
            })}
            <Button id="show-more-btn" className="mt-1" onClick={HandleClickShowMore}>Показать ещё</Button>
        </>
    )
    
    let innerContent = (
        <>
            {comments.length > 0 
                ?
                commentsInCashContent
                :
                <Button id="show-more-btn" className="mt-1" onClick={HandleClickShowMore}>Показать комментарии</Button>
            }
        </>
    )

    if (isPending) {
        innerContent = (
            <>
                {innerContent}
                <div className="d-flex align-items-center justify-content-center pt-5">
                    <Spinner animation="border" variant="info" size="xl"/>
                </div>
            </>
        )
    }
    if (error) {
        console.log({error})
        innerContent = (
            <>
                {innerContent}
                <div className="d-flex align-items-center justify-content-center pt-5">
                    <Spinner animation="border" variant="info" size="xl"/>
                </div>
                <h1 className="text-danger text-center">Ошибка загрузки отзывов.</h1>
            </>
        )
    }
    if (data) {
        comments = comments.concat(data.comments);
        console.log({data, comments});
        // setPage(page+1);
        innerContent = (
            <>
                {comments.length > 0 
                ? 
                    comments.map((el, ind) => {
                        return <Comment key={`comment-${ind}`} comment={el}/>
                    })
                :
                <div className="h5">Пока здесь нет комментариев</div>
                }
                {
                    data.comments.length == 10
                    ?
                    <Button id="show-more-btn" className="mt-1" onClick={HandleClickShowMore}>Показать ещё</Button>
                    :
                    ''
                }
            </>
        )
    }

    return (
        <Container className="step-comments col-12 col-lg-10 col-xl-8">
            <h2 className="section-title text-center">Комментарии</h2>
            
            <SendCommentForm stepId={step.id} />
            <Container className="d-flex flex-wrap p-0 step-comments__inner" id="comments-container">
                {innerContent}
            </Container>
            
        </Container>
    )
}