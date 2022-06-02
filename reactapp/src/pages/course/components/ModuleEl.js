import React from "react";
import { useParams, Link } from "react-router-dom";
import { ListGroup, Nav, Accordion, Tooltip, OverlayTrigger } from "react-bootstrap";


function LessonEl({courseId, lessonObj}) {
    return (
        <Nav.Item>
            <OverlayTrigger
                key={lessonObj.id}
                placement={"right"}
                overlay={
                    <Tooltip id={"tooltip-" + lessonObj.id}>
                        <strong>шагов: </strong>3<br />
                        <strong>пройдено: </strong>2<br />
                    </Tooltip>
                }
            >
                <Nav.Link
                href={`/courses/${courseId}/lessons/${lessonObj.id}`} 
                className="px-0 align-middle"
                >
                    
                        <i className="fs-4 bi-diagram-3-fill"></i> 
                        <span className="ms-1">{lessonObj.title}</span>
                </Nav.Link>
            </OverlayTrigger>
        </Nav.Item>
    )
}

export function ModuleEl({courseId, moduleObj}) {
    return (
        <Accordion>
            <Accordion.Item eventKey="1" className="bg-transparent">
                <Accordion.Header as="h1" className="h1 bg-transparent sidebar-menue-accordion">
                    {moduleObj.title}
                </Accordion.Header>
                <Accordion.Body>
                    <Nav variant="pills" className="flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                        { 
                            moduleObj.lessons.length > 0 
                            ?
                            moduleObj.lessons.map(
                                (lesson, ind) => <LessonEl courseId={courseId} lessonObj={lesson} key={ind} />) 
                            :
                            "There are no sections in this section yet."
                        }
                    </Nav>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}