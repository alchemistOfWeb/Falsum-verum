import React from 'react';
import { BACKEND_DOMAIN } from '../../../setting';
import { Link } from 'react-router-dom';
import { Col, Row, Card } from 'react-bootstrap';
import DayJS from 'react-dayjs';


export function CourseCard({props}) {
    console.log(props)

    let img_url = "";
    if (props.image_sm) {
        img_url = `${BACKEND_DOMAIN}${props.image_sm}`;
    } else {
        img_url = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png";
    }

    return (
    <Col xs="12" sm="6" md="4" lg="3" className="catalog-card-wrapper">
        
        <Link to={`/catalog/courses/${props.id}`} className="catalog-card__linked-wrapper">
            <Card className="card catalog-card">
                <Card.Img variant="top" src={img_url} className="catalog-card__img"/>
                <Card.Body className="catalog-card__body">
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.short_description}</Card.Text>
                </Card.Body>
                <Card.Footer className="catalog-card__footer">
                    <small>
                        Обновлено <DayJS format="MM-DD-YYYY">{props.updated_at}</DayJS>
                    </small>
                </Card.Footer>
            </Card>
        </Link>
        {/* <div class="card catalog-list-card">
            <div class="card-body text-dark">
                <Row>
                    <div className="col-3 col-md-1 p-0 border border-solid">
                        <img 
                            src={img_url}
                            alt="Python для анализа данных" 
                            width={"100%"}
                            // height={"100%"}
                        />
                    </div>
                    <div className="col-9 col-md-11 row pe-0">
                        <div className="col-12 col-md-9">
                            <h5 class="card-title">{props.title}</h5>
                            <p className="card-text">{props.short_description}</p>
                        </div>
                        <div className="catalog-list-item__link-wrapper col-12 col-md-3 d-flex justify-content-end mt-3 mt-md-0 p-0">
                            <div className="d-block">
                                <Link to={`/catalog/courses/${props.id}`} className="btn btn-primary">
                                    Открыть курс →
                                </Link>
                            </div>
                        </div>
                    </div>
                </Row>
            </div>
        </div> */}
    </Col>
    )
}