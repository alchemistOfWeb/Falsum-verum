import React from 'react';
import { Outlet, Link } from "react-router-dom";
import Navbar from './components/SNavbar';
import { useAsync } from 'react-async';
import { userRequest } from '../functions';

const Layout = () => {
    console.log('hello');
    
    const { data, error, isPending } 
        = useAsync({ promiseFn: userRequest });

    if (isPending) {
        return <h1>Loading user...</h1>
    }
    if (error) {
        console.log({error});
        console.log('Error of loading user');
    }
    if (data) { 
        console.log({user: data});
        window.user = data.user;
    }
    
    return (
        <>
            <div className="main-wrapper">
                <Navbar/>
                <div className="content-section pb-3">
                    <Outlet />
                </div>
            </div>
        </>
    )
};

export default Layout;