import { useParams, Link, NavLink } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown, Offcanvas, Accordion } from "react-bootstrap";
import { useState } from "react";
import { ModuleEl } from "./components/ModuleEl";


function activeLink({isActive}) {
    let defaultCls = "px-0 align-middle nav-link"
    return isActive ? 
        defaultCls + " active"
        : 
        defaultCls;
    
}

export default function CourseSidebar({course}) {
    const [show, setShow] = useState(false);
    const toggleShow = () => setShow((s) => !s);

    return (
        <nav id="course-sidebar" className={show ? "rolled-up" : ""}>
            <div className="course-sidebar-fixator">
                <div className="custom-menu">
                    <button type="button" id="sidebarCollapse" className="btn btn-primary" onClick={toggleShow}>
                        {/* <i className="fa fa-bars"></i> */}
                        <i className="bi bi-list"></i>
                        {/* <span className="sr-only">Toggle Menu</span> */}
                    </button>
                </div>
                <div className="scrolling-content">

                
                    <div className="p-4">
                        <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5">Stepus</span>
                        </Link>
                        <div className="row">
                            <h4>{course.title}</h4>
                        </div>
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0" className="bg-transparent">
                                <Accordion.Header as="h1" className="h1 bg-transparent sidebar-menue-accordion">
                                    Меню
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Nav variant="pills" className="flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                                        <NavLink
                                            to={`/catalog/courses/${course.id}`} 
                                            role="button"
                                            className={activeLink}
                                        >
                                            <i className="fs-4 bi-house"></i> 
                                            <span className="ms-1">На страницу каталога</span>
                                        </NavLink>
                                        <Nav.Item>
                                            <Nav.Link href="#submenu1" data-bs-toggle="collapse" className="px-0 align-middle">
                                                <i className="fs-4 bi-speedometer2"></i> 
                                                <span className="ms-1">Панель управления</span> 
                                            </Nav.Link>
                                            <Nav 
                                                className="collapse flex-column ms-1" 
                                                id="submenu1" 
                                                data-bs-parent="#menu"
                                            >
                                                <li className="w-100">
                                                    <Nav.Link href="#" className="px-0"> 
                                                        <span className="">Item</span> 1 
                                                    </Nav.Link>
                                                </li>
                                                <li>
                                                    <Nav.Link href="#" className="px-0"> 
                                                        <span className="">Item</span> 2 
                                                    </Nav.Link>
                                                </li>
                                            </Nav>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <NavLink
                                                to={`/courses/${course.id}/modules`}
                                                role="button"
                                                className={activeLink}
                                            >
                                                <i className="fs-4 bi-easel-fill"></i> 
                                                <span className="ms-1">Прохождение</span> 
                                            </NavLink>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <NavLink
                                                to={`/courses/${course.id}/roadmap`}
                                                role="button"
                                                className={activeLink}
                                            >
                                                <i className="fs-4 bi-diagram-3-fill"></i> 
                                                <span className="ms-1">Карта курса</span>
                                            </NavLink>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <NavLink
                                                to={`/courses/${course.id}/schedule`} 
                                                role="button"
                                                className={activeLink}
                                            >
                                                <i className="fs-4 bi-table"></i>
                                                <span className="ms-1">Календарь</span> 
                                            </NavLink>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <NavLink
                                                to={`/courses/${course.id}/info`}
                                                role="button"
                                                className={activeLink}
                                            >
                                                <i className="fs-4 bi-info-square-fill"></i> 
                                                <span className="ms-1">Информация о курсе</span> 
                                            </NavLink>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <NavLink
                                                to={`/courses/${course.id}/authors`}
                                                role="button"
                                                className={activeLink}
                                            >
                                                <i className="fs-4 bi-people"></i> 
                                                <span className="ms-1">Авторы</span> 
                                            </NavLink>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <NavLink
                                                to={`/courses/${course.id}/statistics`}
                                                role="button"
                                                className={activeLink}
                                            >
                                                <i className="fs-4 bi-graph-up"></i> 
                                                <span className="ms-1">Статистика</span> 
                                            </NavLink>
                                        </Nav.Item>
                                    </Nav>
                                    
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <hr />
                    <div className="p-4">
                        { 
                            course.modules.length > 0 
                            ?
                            course.modules.map(
                                (m, ind) => <ModuleEl courseId={course.id} moduleObj={m} key={ind} />) 
                            :
                            "There are no sections in this section yet."
                        }
                    </div>
                </div>
            </div>
        </nav>
        
    )
}