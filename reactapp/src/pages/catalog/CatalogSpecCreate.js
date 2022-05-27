import { BACKEND_ROOT_URL } from "../../setting";
import { request, getCookie } from '../../functions';
import { useParams, Link } from "react-router-dom";
import React from 'react';
import { useAsync } from 'react-async';


export default function CatalogSpecCreate() {
    return (
        <div className="container">
            <h1>Catalog Spec Create</h1>
        </div>
    )
}