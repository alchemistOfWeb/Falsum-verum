import React from 'react';
import { BACKEND_ROOT_URL, BACKEND_DOMAIN } from "../../../setting";
import { request, getCookie, getAccessToken, crdRequest } from '../../../functions';
import { useParams, Link, NavLink } from "react-router-dom";
import { Nav, Button, Spinner, ListGroup, Tab, Row, Col, Container, Form } from 'react-bootstrap';
import { useAsync } from 'react-async';
import { useState } from 'react';
// import Comment from '../../../components/Comment';
import telegram_icon from "../../../images/social_icons/telegram.ico";
import vk_icon from "../../../images/social_icons/vk.ico";
import whatsapp_icon from '../../../images/social_icons/whatsapp.ico';
import parseHtml from 'html-react-parser';
import personImg from "../../../images/tesla-bot.jpg";
import jquery from 'jquery';


const loadCourse = async ({courseId}, options) => {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}courses/${courseId}/`;
    const res = await request('GET', url, {}, headers, {signal: options.signal});
    return res;
}


function SectionDescription({course}) {
    return (
        <div className="course-full-description">
            <h2 className="course-full-description__title">Про курс</h2>
            {parseHtml(course.description)}
        </div>
    )
}

function SectionProgram({course}) {
    return (
        <div className="course-full-description">
            <h2 className="course-full-description__title">Программа</h2>
            
        </div>
    )
}

function SectionAuthors({course}) {

    function AuthorCard({author}) {
        let profile = author.author.profile;
        let avatarImg = profile.image_md ? `${BACKEND_DOMAIN}${profile.image_md}` : personImg;
        
        return (
            <Col xs="12" lg="6" className="row author-card">
                <Col xs="12" lg="3" className="author-card__img-wrapper mx-auto mx-lg-0">
                    <img src={avatarImg} alt="avatar" className="border"/>
                </Col>
                <Col lg="9" className="author-card__description-wrapper">
                    <div className="h4 author-card__name">{author.author.username}</div>
                    <div className="author-card__desc">{author.description}</div>
                </Col>
            </Col>
        )
    }

    // let authors = [
    //     {
    //         full_name: "Tom Wilson",
    //         avatar: "", 
    //         description: "Information about Tom Wilson. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, nihil."
    //     },
    //     {
    //         full_name: "Jack Dorsey",
    //         img: "", 
    //         description: "Information about Jack Dorsey. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, nihil."
    //     },
    //     {
    //         full_name: "Ilon Musk",
    //         img: "", 
    //         description: "Information about Ilon Musk. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, nihil."
    //     },
    // ]

    return (
        <div className="course-full-description">
            <h2 className="course-full-description__title">Авторы курса</h2>
            <div className="course-catalog-authors-section">
                {/* <Container className="d-flex flex-wrap">
                    {course.organization}
                </Container> */}
                <Container className="d-flex flex-wrap p-0">
                    {course.authors.map((el, ind) => {
                        return <AuthorCard key={`author-card-${ind}`} author={el}/>
                    })}
                </Container>
            </div>
        </div>
    )
}

function SectionReviews({course}) {

    function ReviewEl({review}) {
        return (
            <Row className="course-review">
                <Col xs="12" className="course-review__header d-flex">
                    <Col xs="2" className="course-review__img-wrapper">
                        <img src={personImg} alt="" />
                    </Col>
                    <Col xs="8" className="course-review__title-wrapper">
                        <Col xs="12">
                            <span className="course-review__username">{review.user.username}</span>
                        </Col>
                        <Col xs="12">
                            <span className="course-review__updated-at">{review.updated_at}</span>
                        </Col>
                    </Col>
                </Col>
                <Col xs="12" className="course-review__content-wrapper">
                    {review.content}
                </Col>
            </Row>
        )
    }

    let reviews = [
        {
            user: {
                username: "Tom Soier"
            },
            updated_at: "09-09-2021",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam eligendi quisquam perferendis commodi excepturi provident eaque consectetur praesentium possimus quis corporis, laborum quidem, exercitationem sint ab sed impedit, unde est."
        },
        {
            user: {
                username: "Giovanny Georgio"
            },
            updated_at: "09-09-2021",
            content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam eligendi quisquam perferendis commodi exceptud fgident eaque consectetur praesentium possimus quis corporis, laborum quidem, exercitationem sint ab sed impdfgt, unde est."
        },
        {
            user: {
                username: "Ilon Musk"
            },
            updated_at: "09-09-2021",
            content: "GSFd ffds  dfum dolor sit amet consectetur adipisicing elit. Totam eligendi quisquam perferendis commodi excepturi provident eaque consectetur praesentium possimus quis corporis, laborum quidem, exsd fd tionem sint ab sed impedit, unde est."
        },
    ]

    function SendReviewForm() {
        const [reviewBody, setReviewBody] = useState('');

        async function reviewResponse(params={}) {
            let url = `${BACKEND_ROOT_URL}reviews/`;
            let headers = {
                "Authorization": getAccessToken()
            }
            const res = await crdRequest('POST', url, params, headers);    
            return res;
        }

        function handleReview(e) {
            e.preventDefault();
            if (!reviewBody) {
                alert("Поле текста не может быть пустым");
                return;
            }
            reviewResponse({content: reviewBody})
                .then((res)=>{
                    console.log(res);
                    alert("Отзыв успешно отправлен");
                })
                .catch((err) => {
                    console.log({err});
                });
        }

        function showReviewFrom(e) {
            jquery('#send-review-from').toggleClass(['d-none', 'show']);
        }

        return (
            <>
                <div className="d-flex open-review-form-btn__wrapper align-items-center">
                    <Button className="open-review-form-btn" variant="success" onClick={showReviewFrom}>
                        Оставить отзыв
                    </Button>
                    <small className="open-review-form-btn__label"> 
                        - для того чтобы оставлять отзыв вам необходимо пройти больше 70% курса
                    </small>

                </div>
                <Form className="review-form col-12 rounded px-0 py-3 fade d-none" onSubmit={handleReview} id="send-review-from">
                    <Form.Group className="mb-1">
                        <Form.Control 
                            as="textarea" 
                            rows={5}
                            id="inputReviewBody" 
                            className="" 
                            placeholder="Введить текст отзыва сюда" 
                            required autofocus=""
                            onChange={(e)=>{setReviewBody(e.target.value)}}
                        />
                        <div className="error-list  d-flex flex-column"></div>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button type="submit" className="btn-primary btn-block review-form__submit" size="lg">
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
    
    return (
        <div className="course-full-description">
            <h2 className="course-full-description__title">Отзывы</h2>
            
            <SendReviewForm />
            <Container className="d-flex flex-wrap p-0">
                {reviews.map((el, ind) => {
                    return <ReviewEl key={`review-${ind}`} review={el}/>
                })}
                
            </Container>
            
        </div>
    )
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
        console.log(courseObj)
        let img_url = `${BACKEND_DOMAIN}${courseObj.banner_lg}`;

        return (
            <>
                <div className="text-white bg-secondary position-relative">
                    <div style={{backgroundImage: `url(${img_url})`}} className="course-banner" />
                    <div className="p-4 p-md-5 mb-4 container position-relative">
                        <div className="col-md-6 px-0">
                            <h1 className="display-4 fst-italic course-title">{courseObj.title}</h1>
                            <p className="lead my-3 course-short-description">
                                { courseObj.short_description }
                            </p>
                            <p className="lead mb-0">
                                {/* <a href="#" className="text-white fw-bold">Continue reading...</a> */}
                            </p>
                        </div>
                    </div>
                    
                </div>

                
                <div className="container position-relative">
                    <div className="row">
                        <Tab.Container  
                            defaultActiveKey="description"
                        >
                            <div className="col-md-8" id="catalog-course-tab-container">
                                <Nav className="my-4 border-bottom course-description-section-list">
                                    <Nav.Link className="h5" eventKey="description">
                                        Описание
                                    </Nav.Link>
                                    <Nav.Link className="h5" eventKey="authors">
                                        Авторы
                                    </Nav.Link>
                                    <Nav.Link className="h5" eventKey="program">
                                        Программа
                                    </Nav.Link>
                                    <Nav.Link className="h5" eventKey="reports">
                                        Отзывы
                                    </Nav.Link>
                                </Nav>
                                <Tab.Content className="course-catalog-tab-content">
                                    <Tab.Pane eventKey="description">
                                        <SectionDescription course={courseObj}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="authors">
                                        <SectionAuthors course={courseObj}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="program">
                                        <SectionProgram course={courseObj}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="reports">
                                        <SectionReviews course={courseObj}/>
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Tab.Container>

                        <div className="col-md-4">
                            <div className="position-sticky mt-2">
                                <div className="pt-4 mb-3 rounded">
                                    {/* <h4 className="fst-italic">Start</h4> */}
                                    
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
                                    <p className="mt-1 start-minitip">
                                        Вы можете начать сейчас или запланировать на другое время.
                                    </p>
                                </div>

                                <div className="p-2">
                                    <h4 className="fst-italic text-center">Поделиться</h4>
                                    {/* <ol className="list-unstyled mb-0">
                                        <li><a href="#">вконтакте</a></li>
                                        <li><a href="#">telegram</a></li>
                                        <li><a href="#">однокласники</a></li>
                                        <li><a href="#">facebook</a></li>
                                        <li><a href="#">twitter</a></li>
                                    </ol> */}
                                    
                                    <ListGroup horizontal className="list-unstyled social-icons justify-content-center">
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