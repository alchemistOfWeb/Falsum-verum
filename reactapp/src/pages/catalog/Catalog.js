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
        <h1>Catalog</h1>
        <div className="container">
            <form className="col-3">
                <div class="input-group">
                    <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                    <button type="button" className="btn btn-outline-primary ms-2">search</button>
                </div>
            </form>
            <nav className="nav mt-2">
                <Link 
                    to="/catalog/specializations" 
                    aria-current="page"
                    className="nav-link active px-2 text-success h5 border-bottom border-success border-3">
                    Специализации
                </Link>
                <Link 
                    to="/catalog/specializations" 
                    className="nav-link px-2 text-success h5">
                    Организации
                </Link>
                <Link 
                    to="/catalog/specializations" 
                    className="nav-link px-2 text-success h5">
                    Курсы
                </Link>
                {/* <a className="nav-link active" aria-current="page" href="#">Active</a>
                <a className="nav-link" href="#">Link</a> */}
            </nav>
            <hr className="mt-0"/>
        </div>
        </>
    )
}