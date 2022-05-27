import { BACKEND_ROOT_URL } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';
import { Collapse, ListGroup, Nav, Container, Row, Col, Dropdown } from "react-bootstrap";


export default function CourseDetail() {
    return (
        <Container fluid>
            <Row className="flex-nowrap">
                <div className="offcanvas-btn-sidebar">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-dark bg-light min-vh-100">
                        dfdf sdfsd
                    </div>
                </div>
                <Col className="offcanvas-sidebar col-auto px-sm-2 px-0 bg-dark" md="3" xl="2">
                    <div className="inner-content d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 d-none d-sm-inline">Stepus</span>
                        </Link>
                        <Nav variant="pills" className="flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <Nav.Item>
                                <Nav.Link href="#" className="align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Домой</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#submenu1" data-bs-toggle="collapse" className="px-0 align-middle">
                                    <i className="fs-4 bi-speedometer2"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Панель управления</span> 
                                </Nav.Link>
                                <Nav 
                                    className="collapse flex-column ms-1" 
                                    id="submenu1" 
                                    data-bs-parent="#menu"
                                >
                                    <li className="w-100">
                                        <Nav.Link href="#" className="px-0"> 
                                            <span className="d-none d-sm-inline">Item</span> 1 
                                        </Nav.Link>
                                    </li>
                                    <li>
                                        <Nav.Link href="#" className="px-0"> 
                                            <span className="d-none d-sm-inline">Item</span> 2 
                                        </Nav.Link>
                                    </li>
                                </Nav>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#" className="px-0 align-middle">
                                    <i className="fs-4 bi-table"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Календарь</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="#submenu3" data-bs-toggle="collapse" className="px-0 align-middle">
                                    {/* <i className="fs-4 bi-grid"></i>  */}
                                    <i className="fs-4 bi-easel-fill"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Уроки</span> 
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
                                <Nav.Link href="/" className="px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Авторы</span> 
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                href="/" 
                                className="px-0 align-middle"
                                >
                                    <i className="fs-4 bi-graph-up"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Статистика</span> 
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                href="/" 
                                className="px-0 align-middle"
                                >
                                    <i className="fs-4 bi-diagram-3-fill"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Карта курса</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                href="/courses/1" 
                                className="px-0 align-middle active"
                                >
                                    <i className="fs-4 bi-info-square-fill"></i> 
                                    <span className="ms-1 d-none d-sm-inline">Информация о курсе</span> 
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <hr/>
                        <Dropdown className="pb-4">
                            <Dropdown.Toggle as="a" href="#" className="d-flex align-items-center text-white text-decoration-none" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img 
                                src="https://github.com/mdo.png" 
                                alt="hugenerd" width="30" height="30" 
                                className="rounded-circle"/>
                                <span className="d-none d-sm-inline mx-1">User</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="dark" className="text-small shadow" aria-labelledby="dropdownUser1">
                                <Dropdown.Item href="#">New course</Dropdown.Item>
                                <Dropdown.Item href="#">Settings</Dropdown.Item>
                                <Dropdown.Item href="#">Profile</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item href="#">Sign out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
                <Col className="py-3">
                    <h3>Left Sidebar with Submenus</h3>
                    <p className="lead">
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <ul className="list-unstyled">
                        <li><h5>Responsive</h5> shrinks in width, hides text labels and collapses to icons only on mobile</li>
                    </ul>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                    <p>
                        An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single 
                        menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.
                    </p>
                </Col>
            </Row>
        </Container>
    )
}