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
    </Col>
    )
}