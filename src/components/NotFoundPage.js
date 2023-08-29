import React from 'react';
import { Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

const NotFoundPage = () => {
    useTitle('404 Not Found')

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="col-md-8 text-center">
                    <h1 className="display-1">404</h1>
                    <h2>Sorry!</h2>
                    <p>The page you are looking for does not exist.</p>
                    <Link className="btn btn-outline-primary" to="/">Go to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
