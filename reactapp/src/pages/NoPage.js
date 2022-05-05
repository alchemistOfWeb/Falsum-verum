import React from 'react';
import { Link } from 'react-router-dom';

const NoPage = () => {
    return (
        <div class="vh-100 d-flex text-center justify-content-center align-items-center flex-column">
            <h1 class="text-danger">404|Such page does not exist!</h1>
            <Link to="/">
                <h2>Take me home →</h2>
            </Link>
        </div>
    )
};

export default NoPage;