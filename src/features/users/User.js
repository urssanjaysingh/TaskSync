import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import useTitle from '../../hooks/useTitle';
import { Link } from 'react-router-dom';

const User = ({ user }) => {
    useTitle(`${user.username}'s Profile`);

    return (
        <section className="user-profile">
            <div className="user-profile__container">
                <h2 className="user-profile__username comment-author">{user.username}</h2>
                <div className="user-profile__avatar">
                    <img
                        src={user.profile.avatar}
                        alt=''
                    />
                </div>
                <div className="user-profile__info">
                    <p className='user-profile__name'><strong>{user.profile.first_name} {user.profile.last_name}</strong></p>
                    <p className="user-profile__bio">{user.profile.bio}</p>
                    <br />
                    <p className="user-profile__email">{user.email}</p>
                    <div className="user-profile__social-links">
                        <a
                            href={user.profile.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-button linkedin-button"
                        >
                            <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                        </a>
                        <span className="space"></span>
                        <a
                            href={user.profile.social_links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-button github-button"
                        >
                            <FontAwesomeIcon icon={faGithub} /> GitHub
                        </a>
                        <span className="space"></span>
                        <a
                            href={user.profile.social_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-button website-button"
                        >
                            <FontAwesomeIcon icon={faGlobe} /> Website
                        </a>
                    </div>
                    <div className="button-container">
                        <Link to='/dash/profile-completion' className="btn btn-primary">
                            Edit Your Profile
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default User;
