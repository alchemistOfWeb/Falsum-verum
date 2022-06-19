import { BACKEND_ROOT_URL } from "../../setting";
import { crdRequest, getAccessToken } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import React from 'react';
import jquery from 'jquery';
// import { useAsync } from 'react-async';
import { useState } from "react";
import { useAsync } from 'react-async';

// import * as mdb from 'mdb-ui-kit'; // lib
// import { Input } from 'mdb-ui-kit'; // module
import { Nav, Button, Spinner, ListGroup, Container } from 'react-bootstrap';
import { CourseCard } from "./components/CourseCard";
import CoursesLoader from "./components/CoursesLoader";


export default function Catalog() {

    return (
        <div className="container">
            <h1 className="text-center">Каталог</h1>
            <hr/>
            <div className="container">
                <form className="col-8 col-md-5 col-lg-4 col-xl-3">
                    <div class="input-group catalog-search">
                        <input type="search" className="h-100 form-control rounded" placeholder="название курса" aria-label="Search" aria-describedby="search-addon" />
                        <button type="button" className="h-100 btn btn-primary ms-2">найти</button>
                    </div>
                </form>
                <Nav className="my-4 border-bottom catalog-category-list">
                    <Nav.Link className="h5" href="#">Специализации</Nav.Link>
                    <Nav.Link className="h5" href="#">Организации</Nav.Link>
                    <Nav.Link className="h5" href="#" active>Курсы</Nav.Link>
                </Nav>
                <Container>
                    <CoursesLoader/>
                </Container>
            </div>
        </div>
    )
}