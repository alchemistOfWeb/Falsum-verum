import { Link } from "react-router-dom"
import { crdRequest, getCookie, deleteCookie } from "../../functions";
import { BACKEND_ROOT_URL } from "../../setting";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";


async function logoutResponse () {
    let headers = {'Authorization': getCookie('access_token')};
    let url = `${BACKEND_ROOT_URL}auth/token/logout/`;
    const res = await crdRequest('POST', url, {}, headers);    
    return res;
}

function handleLogout() {
    if (window.confirm('Вы действительно хотите выйти?')) {
        logoutResponse()
            .then((res)=>{
                console.log({res})
                window.user = undefined;
                deleteCookie('access_token');
                window.location.href = '/';
            });
    }
}

export default function SNavbar() {
    let UserBtns = null;
    if (window.user) {
        UserBtns = () => (
            <>
                <Link 
                    to="/personal" 
                    role="link"
                    className="btn btn-outline-light me-2 text-decoration-none btn-dark-light"
                    id="personal-btn"
                >
                    Профиль
                </Link>
                <Link 
                    to="#logout" 
                    role="button"
                    className="btn btn-warning text-dark text-decoration-none"
                    id="logout-btn"
                    onClick={handleLogout}
                >
                    Выйти
                </Link>
            </>
        )
    } else {
        UserBtns = () => (
            <ul className="nav">
                <li>
                    <Link 
                        to="/signin" 
                        className="nav-link border border-light rounded me-2 text-decoration-none btn-dark-light"
                        id="signin-btn"
                    >
                        Войти
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/signup" 
                        className="nav-link rounded bg-warning text-dark text-decoration-none"
                        id="signup-btn"
                    >
                        Регистрация
                    </Link>
                </li>
            </ul>
        )
    }

    return (
        <header 
        className="p-3 text-white navigation-header"
        >
            <Navbar 
                className="fixed-top navigation-header__navbar" 
                expand="md"
                variant="dark"
            >
                <Container className="navigation-header__buttons" fluid>
                    <Navbar.Brand href="/">Stepos</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarCollapse"/>
                    <Navbar.Collapse id="navbarCollapse">
                        <Nav className="me-auto mb-2 mb-md-0">
                            <Nav.Link href="/catalog">Каталог</Nav.Link>
                            <Nav.Link href="/">Планирование</Nav.Link>
                            <Nav.Link href="/about">Информация</Nav.Link>
                            <Nav.Link href="/rules">Правила</Nav.Link>                            
                        </Nav>
                        {/* <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>                            
                        </Form> */}
                        <div className="text-end">
                            <UserBtns/>
                        </div>
                    </Navbar.Collapse>
                </Container>
                
                
            </Navbar>
        </header>
    )
}