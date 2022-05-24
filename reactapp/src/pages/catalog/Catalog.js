import { BACKEND_ROOT_URL } from "../../setting";
import { crdRequest, getAccessToken } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import React from 'react';
import jquery from 'jquery';
// import { useAsync } from 'react-async';
import { useState } from "react";

// import * as mdb from 'mdb-ui-kit'; // lib
// import { Input } from 'mdb-ui-kit'; // module
import {Nav, Button, Spinner, ListGroup} from 'react-bootstrap';
import { CourseCard } from "./components/CourseCard";


export default function Catalog() {

    let load_content = (
        <Spinner animation="border" variant="info" />
    )

    let des1 = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab dicta, possimus corrupti fuga distinctio aut delectus ivero maxime asperiores dicta, voluptatum animi? Reprehenderit."


    return (
        <div className="container">
            <h1 className="text-center">Каталог</h1>
            <hr/>
            <div className="container">
                <form className="col-8 col-md-5 col-lg-4 col-xl-3">
                    <div class="input-group">
                        <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                        <button type="button" className="btn btn-primary ms-2">search</button>
                    </div>
                </form>
                <Nav className="my-4 border-bottom catalog-category-list">
                    <Nav.Link className="h5" href="#">Специализации</Nav.Link>
                    <Nav.Link className="h5" href="#">Организации</Nav.Link>
                    <Nav.Link className="h5" href="#" active>Курсы</Nav.Link>
                </Nav>
                <ListGroup>
                    <CourseCard key={1} props={{pk: 1, title: "Python за 30 дней", short_description: "With supporting text below as a natural lead-in to additional content."}}/>
                    <CourseCard key={2} props={{pk: 2, title: "Python", short_description: "With supporting text below as a natural lead-in to additional content."}}/>
                    <CourseCard key={3} props={{pk: 3, title: "Java для начинающих", short_description: "With supporting text below as a natural lead-in to additional content."}}/>
                    <CourseCard key={4} props={{pk: 4, title: "Python", short_description: des1}}/>
                </ListGroup>
            </div>
        </div>
    )
}