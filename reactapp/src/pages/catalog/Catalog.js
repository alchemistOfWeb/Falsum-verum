import { BACKEND_ROOT_URL } from "../../setting";
import { crdRequest, getAccessToken } from '../../functions';
import { useParams, Link, Outlet } from "react-router-dom";
import React from 'react';
// import { useAsync } from 'react-async';
import { useState } from "react";

import * as mdb from 'mdb-ui-kit'; // lib
import { Input } from 'mdb-ui-kit'; // module

export default function Catalog() {
    return (
        <>
        <h1>Каталог</h1>
        <div className="container">
            <form className="col-3">
                <div class="input-group">
                    <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                    <button type="button" className="btn btn-primary ms-2">search</button>
                </div>
            </form>
            <nav className="nav mt-2">
                <Link 
                    to="/catalog/specializations" 
                    aria-current="page"
                    className="nav-link px-2 text-success h5">
                    Специализации
                </Link>
                <Link 
                    to="/catalog/specializations" 
                    className="nav-link px-2 text-success h5">
                    Организации
                </Link>
                <Link 
                    to="/catalog/specializations" 
                    className="nav-link active px-2 text-success h5 border-bottom border-success border-3">
                    Курсы
                </Link>
                {/* <a className="nav-link active" aria-current="page" href="#">Active</a>
                <a className="nav-link" href="#">Link</a> */}
            </nav>
            <hr className="mt-0"/>
            <div class="mb-2">
                <div class="card">
                <div class="card-body text-dark">
                    <div className="row">
                        <div className="col-1">
                        <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png" alt="Python для анализа данных" className="css-1bx66lg" width={50}/>
                        </div>
                        <div className="col-9">
                            <h5 class="card-title">Python</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                        <div className="col-2">
                            <a href="#" className="btn btn-primary">Открыть курс -></a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            
            <div class="mb-2">
                <div class="card">
                <div class="card-body text-dark">
                    <div className="row">
                        <div className="col-1">
                        <img src="https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b4/f98ce0fd2911e89919af3b4975e9e1/logo_python_2.png" alt="Python для анализа данных" className="css-1bx66lg" width={50}/>
                        </div>
                        <div className="col-9">
                            <h5 class="card-title">Python</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                        <div className="col-2">
                            <a href="#" className="btn btn-primary">Открыть курс -></a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            
            
        </div>
        </>
    )
}