import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown, Offcanvas, Accordion } from "react-bootstrap";
import { useState } from "react";



export default function CourseSidebar({courseId}) {
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
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0" className="bg-transparent">
                                <Accordion.Header as="h1" className="h1 bg-transparent sidebar-menue-accordion">
                                    Меню
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Nav variant="pills" className="flex-column mb-sm-auto mb-0 align-items-start" id="menu">
                                        <Nav.Item>
                                            <Nav.Link href={`/catalog/courses/${courseId}`} className="align-middle px-0">
                                                <i className="fs-4 bi-house"></i> <span className="ms-1">На страницу каталога</span>
                                            </Nav.Link>
                                        </Nav.Item>
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
                                            <Nav.Link href="#submenu3" data-bs-toggle="collapse" className="px-0 align-middle">
                                                {/* <i className="fs-4 bi-grid"></i>  */}
                                                <i className="fs-4 bi-easel-fill"></i> 
                                                <span className="ms-1">Уроки</span> 
                                            </Nav.Link>
                                            <ul className="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                                                <li className="w-100">
                                                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 1</a>
                                                </li>
                                                <li>
                                                    <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Product</span> 2</a>
                                                </li>
                                            </ul>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link
                                            href="/" 
                                            className="px-0 align-middle"
                                            >
                                                <i className="fs-4 bi-diagram-3-fill"></i> 
                                                <span className="ms-1">Карта курса</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link href="#" className="px-0 align-middle">
                                                <i className="fs-4 bi-table"></i> 
                                                <span className="ms-1">Календарь</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link
                                            href="/courses/1" 
                                            className="px-0 align-middle active"
                                            >
                                                <i className="fs-4 bi-info-square-fill"></i> 
                                                <span className="ms-1">Информация о курсе</span> 
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link 
                                            href="/" 
                                            className="px-0 align-middle"
                                            >
                                                <i className="fs-4 bi-people"></i> 
                                                <span className="ms-1">Авторы</span> 
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link
                                            href="/" 
                                            className="px-0 align-middle"
                                            >
                                                <i className="fs-4 bi-graph-up"></i> 
                                                <span className="ms-1">Статистика</span> 
                                            </Nav.Link>
                                        </Nav.Item>
                                        
                                    </Nav>
                                    
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <hr />
                    <div className="p-4">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci eveniet pariatur esse facere aspernatur asperiores nulla ut ratione? Voluptatum veniam libero expedita quaerat minus! Voluptates quae deserunt optio error blanditiis.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci eveniet pariatur esse facere aspernatur asperiores nulla ut ratione? Voluptatum veniam libero expedita quaerat minus! Voluptates quae deserunt optio error blanditiis.</p>
                    </div>
                </div>
            </div>

                {/* <div className="mb-5">
                    <h3 className="h6 mb-3">Subscribe for newsletter</h3>
                    <form action="#" className="subscribe-form">
                        <div className="form-group d-flex">
                        <div className="icon">
                            <span className="icon-paper-plane"></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Enter Email Address"/>
                        </div>
                    </form>
                </div> */}
                {/* <div className="footer">
                    <p>
                    Copyright ©<script>document.write(new Date().getFullYear());</script>2022 All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib.com</a>
                    </p>
                </div> */}
            
        </nav>
        
    )
}