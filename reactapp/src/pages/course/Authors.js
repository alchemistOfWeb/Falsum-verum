import React from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "react-async";
import { Spinner, Container, Card, Row, Col } from "react-bootstrap";
import personImg from "../../images/tesla-bot.jpg";


function AuthorCard({author}) {
    let avatarImg = author.avatar ? author.avatar : personImg;
    
    return (
        <Col xs="12" lg="6" className="row author-card my-2">
            <Col xs="12" lg="3" className="author-card__img-wrapper mx-auto mx-lg-0">
                <img src={avatarImg} alt="avatar" className="border"/>
            </Col>
            <Col lg="9" className="author-card__description-wrapper">
                <div className="h4 author-card__name">{author.full_name}</div>
                <div className="author-card__desc">{author.description}</div>
            </Col>
        </Col>
    )
}

export default function Authors() {
    let urlParams = useParams();
    const courseId = urlParams.courseId;

    let authors = [
        {
            full_name: "Tom Wilson",
            avatar: "", 
            description: "Information about Tom Wilson. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, nihil."
        },
        {
            full_name: "Jack Dorsey",
            img: "", 
            description: "Information about Jack Dorsey. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, nihil."
        },
        {
            full_name: "Ilon Musk",
            img: "", 
            description: "Information about Ilon Musk. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, nihil."
        },
    ]

    // const { data, error, isPending } 
    //     = useAsync({ 
    //         promiseFn: loadFullCourse, 
    //         courseId: urlParams.courseId
    //     });

    // if (isPending) {
    //     return (
    //         <div className="d-flex align-items-center justify-content-center pt-5">
    //             <Spinner animation="border" variant="info" size="xl"/>
    //         </div>
    //     )
    // }
    // if (error) {
    //     console.log({error})
    //     return <h1 className="text-danger">Error of loading course.</h1>
    // }
    // if (data) {
        // data.authors;
        return (
            <>
                <h2 className="mb-4">Авторы курса</h2>
                <hr />
                <div className="course-undergoing-authors-page">
                    <Container className="d-flex flex-wrap">
                        
                    </Container>
                    <Container className="d-flex flex-wrap">
                        {authors.map((el, ind) => {
                            return <AuthorCard key={`author-card-${ind}`} author={el}/>
                        })}
                    </Container>

                </div>
            </>
        )
    // }
}