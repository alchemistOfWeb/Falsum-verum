import React from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { ListGroup, Nav, Accordion, Tooltip, OverlayTrigger } from "react-bootstrap";


function activeLink2({isActive}) {
    let defaultCls = "px-0 align-middle nav-link"
    return isActive ? 
        defaultCls + " active"
        : 
        defaultCls;
    
}

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
                <NavLink
                    to={`/courses/${courseId}/lessons/${lessonObj.id}`} 
                    className={activeLink2}
                    // className="px-0 align-middle nav-link"
                >
                    <i className="fs-4 bi-diagram-3-fill"></i> 
                    <span className="ms-1">{lessonObj.title}</span>
                </NavLink>
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