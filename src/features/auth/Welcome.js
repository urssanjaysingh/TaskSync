import React from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faUser, faEdit } from '@fortawesome/free-solid-svg-icons'; // Import the specific icons you want to use

const Welcome = () => {
    useTitle('Welcome');
    const userId = Cookies.get('userId');
    const username = Cookies.get('username');

    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    const content = (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome! {username}</h1>
            <p>
                <Link to={`/dash/post/user/${userId}`} style={{ color: "#405de6" }} className="instagram-link">
                    <FontAwesomeIcon icon={faList} /> View Posts
                </Link>
            </p>
            <p>
                <Link to="/dash/users" style={{ color: "#405de6" }} className="instagram-link">
                    <FontAwesomeIcon icon={faUser} /> View Profile
                </Link>
            </p>
            <p>
                <Link to="/dash/post/create" style={{ color: "#405de6" }} className="instagram-link">
                    <FontAwesomeIcon icon={faEdit} /> Create Post
                </Link>
            </p>
        </section>
    );

    return content;
};

export default Welcome;
