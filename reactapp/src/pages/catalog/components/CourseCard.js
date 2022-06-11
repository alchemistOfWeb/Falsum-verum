import React from 'react';
import { BACKEND_DOMAIN } from '../../../setting';
import { Link } from 'react-router-dom';
import {ListGroup} from 'react-bootstrap';


export function CourseCard({props}) {
    console.log(props)

    let img_url = "";
    if (props.image_sm) {
        img_url = `${BACKEND_DOMAIN}${props.image_sm}`;
    } else {
        img_url = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png";
    }

    return (
    <ListGroup.Item className="my-1 bg-light catalog-list-item" variant="light" bg="light">
        <div class="card catalog-list-card">
            <div class="card-body text-dark">
                <div className="row">
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
                </div>
            </div>
        </div>
    </ListGroup.Item>
    )
}