import React, { useRef } from "react";
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../setting";
import { request, getCookie, getAccessToken, crdRequest } from '../../functions';
import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { useAsync } from 'react-async';
import jquery from "jquery";
import personImg from "../../images/tesla-bot.jpg";
import DayJS from 'react-dayjs'; 


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
                <Button type="submit">??????????????????</Button>
            </>
        )
    } else {
        tc = <span>?? ???????? ?????????? ?????? ?????? ???? ???????????? ??????????????.</span>;
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
                </>
            )
        }
        if (stepObj.step_type == 'VideoLecture') {
            additionalContent = (
                <>
                    <VideoComponent step={stepObj}/>
                </>
            )
        }
        function handleStepLike(e) {
            e.preventDefault();
            console.log('handleStepLike');
        }

        function handleStepDislike(e) {
            e.preventDefault();
            console.log('handleStepDislike');
        }

        return (
            <>
                <h2 className="text-center">{stepObj.title}</h2>
                
                <div className="step-content pb-3">
                    <div className="">
                        <Row className="w-100 d-flex justify-content-center">
                            <Col xs={12} lg={10} xl={8}>
                                {parseHtml(stepObj.content)}
                            </Col>
                        </Row>
                        <hr />
                        <Row className="w-100 d-flex justify-content-center">
                            <Col xs={12} lg={10} xl={8}>
                                {additionalContent}
                            </Col>
                        </Row>
                        {additionalContent ? <hr/> : ''}
                        
                    </div>
                    <Container className="step-comments col-12 col-lg-10 col-xl-8 px-0">
                        <Row>
                            <Col xs="12" className="ps-0">
                                <span className="ms-2 step-comments-num">
                                    <i 
                                        onClick={handleStepLike} 
                                        className="like step-like active bi bi-hand-thumbs-up-fill"
                                    ></i> {stepObj.likes}
                                </span>
                                <span className="ms-2 step-comments-num">
                                    <i 
                                        onClick={handleStepDislike} 
                                        className="dislike step-dislike bi bi-hand-thumbs-down-fill"
                                    ></i> {stepObj.dislikes}
                                </span>
                                <span className="ms-2 step-comments-num">
                                    ????????????????????????: {stepObj.comments_num}
                                </span>
                            </Col>
                        </Row>
                    </Container>
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
    const refComments = useRef([]);
    const page = useRef(1);
    let comments = refComments.current;

    function handleLike(e) {
        e.preventDefault();
        console.log('handleLike');
    }

    function handleDislike(e) {
        e.preventDefault();
        console.log('handleDislike');
    }

    // function handleShowReplyForm(e) {
    //     e.preventDefault();
    //     console.log('handleShowReplyForm');
    //     const parentComment = jquery(jquery(e.target).closest(".parent-comment")[0]);
    //     const replyForm = parentComment.find('.comment-form');
    //     replyForm.toggleClass('d-none');
    // }

    function RepliesList({comment, onReply}) {
        // const [replyTo, setReplyTo] = useState(null);
        return (
            <>
                {comment.children.map((el, ind) => {
                    return <Reply reply={el} onReply={onReply}/>
                })}
            </>
        )
    }
    
    function Reply({reply, onReply}) {
        let avatarImg = '';
        if (reply.author.profile.image_sm) {
            avatarImg = BACKEND_DOMAIN + reply.author.profile.image_sm;
        } else {
            avatarImg = personImg;
        }
        console.log({reply});

        return (
            <Row className="step-comment" data-comment-id={reply.id}>
                <Col xs="12" className="step-comment__header d-flex">
                    <Col xs="2" className="step-comment__img-wrapper">
                        <img src={avatarImg} alt="" />
                    </Col>
                    <Col xs="8" className="step-comment__title-wrapper">
                        <Col xs="12">
                            <span className="step-comment__username">{reply.author.username}</span>
                        </Col>
                        <Col xs="12">
                            <span className="step-comment__updated-at">
                                <DayJS format="MM-DD-YYYY HH:mm">{reply.updated_at}</DayJS>
                            </span>
                        </Col>
                    </Col>
                </Col>
                <Col xs="12" className="step-comment__content-wrapper">
                    {reply.content}
                </Col>
                <Col xs="12" className="step-comment__footer">
                    <i 
                        onClick={handleLike} 
                        className="like active bi bi-hand-thumbs-up-fill"
                    ></i> {reply.likes}
                    <i 
                        onClick={handleDislike} 
                        className="dislike bi bi-hand-thumbs-down-fill"
                    ></i> {reply.dislikes}
                    <a 
                        href="#" 
                        className="step-comment__reply-btn ms-2"
                        onClick={onReply}
                    >
                        ????????????????
                    </a>
                </Col>
            </Row>
        )
    }

    
    function Comment({comment}) {
        const [replyTo, setReplyTo] = useState(null);

        function handleShowReplies(e) {
            e.preventDefault();
            console.log("handleShowReplies");
            const parent = jquery(jquery(e.target).closest('.step-comment')[0])
            console.log(parent);
            const subcommentsEl = parent.find('.step-comment__subcomments');
            subcommentsEl.toggleClass('d-none');
        }

        function handleShowReplyForm(e) {
            e.preventDefault();
            console.log('handleShowReplyForm');
            const commentEl = jquery(e.target).closest(".step-comment")[0];
            let commentId = commentEl.getAttribute('data-comment-id');
            if (replyTo == commentId) {
                setReplyTo(null);
            } else {
                setReplyTo(commentId);
            }
        }

        // const onReply = (e) => {
        //     setReply(e.target(''))
        // }
        let avatarImg = '';
        if (comment.author.profile.image_sm) {
            avatarImg = BACKEND_DOMAIN + comment.author.profile.image_sm;
        } else {
            avatarImg = personImg;
        }

        return (
            <Row className="step-comment parent-comment" data-comment-id={comment.id} id={`comment-${comment.id}`}>
                <Col xs="12" className="step-comment__header d-flex">
                    <Col xs="2" className="step-comment__img-wrapper">
                        <img src={avatarImg} alt="" />
                    </Col>
                    <Col xs="8" className="step-comment__title-wrapper">
                        <Col xs="12">
                            <span className="step-comment__username">{comment.author.username}</span>
                        </Col>
                        <Col xs="12">
                            <span className="step-comment__updated-at">
                                <DayJS format="MM-DD-YYYY HH:mm">{comment.updated_at}</DayJS>
                            </span>
                        </Col>
                    </Col>
                </Col>
                <Col xs="12" className="step-comment__content-wrapper">
                    {comment.content}
                </Col>
                <Col xs="12" className="step-comment__footer">
                    <i 
                        onClick={handleLike} 
                        className="like active bi bi-hand-thumbs-up-fill"
                    ></i> {comment.dislikes}
                    <i 
                        onClick={handleDislike} 
                        className="dislike bi bi-hand-thumbs-down-fill"
                    ></i> {comment.likes}
                    <a 
                        href="#" 
                        className="step-comment__reply-btn ms-2"
                        onClick={handleShowReplyForm}
                    >
                        ????????????????
                    </a>
                </Col>
                <Col xs="12" className="step-comment__footer">
                    {(()=>{
                        if (comment.comments_num) {
                            return (
                                <a 
                                    href="#" 
                                    onClick={handleShowReplies}
                                    className="step-comment__reply-btn"
                                >
                                    ???????????????? {comment.comments_num} ??????????????
                                </a>
                            )
                        }
                    })()}
                </Col>
                <Col xs="12" className="step-comment__subcomments d-none">
                    <RepliesList onReply={handleShowReplyForm} comment={comment} />
                </Col>
                <SendCommentForm parent={comment.id} replyTo={replyTo} />
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
    console.log({Startcomments: comments})

    const { data, error, isPending, run }
        = useAsync({ 
            deferFn: loadComments,
        });

    function HandleClickShowMore() {
        console.log('HandleClickShowMore')
        run({
            ...urlParams,
            page: page.current++}
        )
    }

    // if (!page.current || page.current < 1) {
    //     page.current = 1;
    // }

    let commentsContainer = (
        <>
            {comments.map((el, ind) => {
                return <Comment key={`comment-${ind}`} comment={el}/>
            })}
        </>
    )
    
    let afterCommentsContent = '';
    let beforeCommentsContent = '';

    if (comments.length > 0) {
        afterCommentsContent = (
            <Row>
                <Button id="show-more-btn" className="mt-1" onClick={HandleClickShowMore}>
                    ???????????????? ??????
                </Button>
            </Row>
        )
    } else {
        console.log('hello comments just no')
        beforeCommentsContent = (
            <Row>
                <Button id="show-more-btn" className="mt-1" onClick={HandleClickShowMore}>
                    ???????????????? ??????????????????????
                </Button>
            </Row>
        )
        
    }


    if (isPending) {
        commentsContainer = (
            <>
                {commentsContainer}
                <div className="d-flex align-items-center justify-content-center pt-5">
                    <Spinner animation="border" variant="info" size="xl"/>
                </div>
            </>
        )
    }
    if (error) {
        console.log({error})
        commentsContainer = (
            <>
                {commentsContainer}
                <div className="d-flex align-items-center justify-content-center pt-5">
                    <Spinner animation="border" variant="info" size="xl"/>
                </div>
                <h1 className="text-danger text-center">???????????? ???????????????? ????????????????????????.</h1>
            </>
        )
    }
    if (data) {
        comments = comments.concat(data.comments);
        console.log({data, comments});
        // setPage(page+1);
        beforeCommentsContent = '';

        if (comments.length > 0) {
            commentsContainer = (
                comments.map((el, ind) => {
                    return <Comment key={`comment-${ind}`} comment={el}/>
                })
            )
        } else {
            commentsContainer = <div className="h5">???????? ?????????? ?????? ????????????????????????</div>
        }


        if (data.comments.length == 10) {
            afterCommentsContent = 
                data.comments.length == 10
                ? (
                    <Row>
                        <Button id="show-more-btn" className="mt-1" onClick={HandleClickShowMore}>
                            ???????????????? ??????
                        </Button>
                    </Row>
                )
                : '';
        } else if (data.comments.length > 10) {
            alert('Mb comments pagination page size was increased. Check it out and correct the code.');
        } else {
            afterCommentsContent = ''
        }
        
    }

    function showCommentFrom(e) {
        console.log('hello');
        jquery('#send-comment-form').toggleClass(['d-none', 'show']);
    }

    return (
        <Container className="step-comments col-12 col-lg-10 col-xl-8 px-0">
            {/* <h2 className="section-title text-center">??????????????????????</h2> */}
            <Row>
                <div className="d-flex justify-content-center open-comment-form-btn__wrapper align-items-center">
                    <Button className={`open-comment-form-btn ${window.user ? "": "disabled"}`} variant="success" onClick={showCommentFrom}>
                        ??????????????????????????????????
                    </Button>
                </div>
                <SendCommentForm />
            </Row>
            <Container className="d-flex flex-wrap justify-content-center p-0 step-comments__inner">
                {beforeCommentsContent}

                <div 
                    className="d-flex flex-wrap w-100 comments-list__comments-container" 
                    id="comments-container"
                >
                    {commentsContainer}
                </div>

                {afterCommentsContent}
            </Container>
            
        </Container>
    )
}

function SendCommentForm({parent=null, replyTo=null}) {
    const [commentBody, setCommentBody] = useState('');
    let uriParams = useParams();

    async function createCommentResponse(body={}, uriParams) {
        let url = getCommentsUrl(uriParams)
        // let url = 
        //     `${BACKEND_ROOT_URL}courses/${courseId}/modules/${moduleId}/`
        //     + `lessons/${lessonId}/steps/${stepId}/comments/`;

        let headers = {};
        let accessToken = getAccessToken();
        if (accessToken) {
            headers['Authorization'] = getAccessToken();
        }
        const res = await crdRequest('POST', url, body, headers);    
        return res;
    }

    function handleComment(e) {
        let params = {}
        
        e.preventDefault();
        if (!commentBody) {
            alert("???????? ???????????? ???? ?????????? ???????? ????????????");
            return;
        }
        if (replyTo) {
            params['parent'] = replyTo;
        }
        params['content'] = commentBody
        console.log({params});
        createCommentResponse(params, uriParams)
            .then((res)=>{
                console.log({createCommentRes: res});
                alert("?????????? ?????????????? ??????????????????");
                // document.location.reload();
            })
            .catch((err) => {
                console.log({err});
                alert("??????-???? ?????????? ???? ??????");
            });
    }

    let formId = '';
    let inputId = '';

    if (parent) {
        formId = "reply-form-" + parent;
        inputId = `input-reply-body-${parent}`;
        // className = 'send-reply-form';
    } else {
        formId = "send-comment-form";
        inputId = "input-comment-body";
    }

    let formClassName = '';
    if (replyTo) {
        formClassName = "comment-form col-12 rounded px-0 py-3"
    } else {
        formClassName = "comment-form col-12 rounded px-0 py-3 d-none"
    }

    return (
        <>
            <Form className={formClassName} onSubmit={handleComment} id={formId}>
                <Form.Group className="mb-1">
                    <Form.Control 
                        as="textarea" 
                        rows={5}
                        id={inputId} 
                        className="" 
                        placeholder="?????????????? ?????????? ?????????????????????? ????????" 
                        required autofocus=""
                        onChange={(e)=>{setCommentBody(e.target.value)}}
                    />
                    <div className="error-list  d-flex flex-column"></div>
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button type="submit" className="btn-primary btn-block comment-form__submit" size="lg">
                        ??????????????????
                    </Button>
                </div>
                <p>
                    * ???????????????????????? ?????????? ?????????????????? 1000 ????????????????.
                </p>
            </Form>
        </>
    )
}