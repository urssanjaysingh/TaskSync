import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faHome, faUser, faEdit, faList } from "@fortawesome/free-solid-svg-icons"; // Import the icons for the buttons
import { useNavigate, Link } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DashHeader = () => {

    const navigate = useNavigate();

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(() => {
        if (isSuccess) navigate('/');
    }, [isSuccess, navigate]);

    if (isLoading) return <PulseLoader color={"#405de6"} />;

    if (isError) return <p>Error: {error.data?.message}</p>;

    const homeButton = (
        <Link to="/dash">
            <button className="icon-button" title="Dashboard Home">
                <FontAwesomeIcon icon={faHome} />
            </button>
        </Link>
    );

    const postListButton = (
        <Link to={`/dash/post/all`}>
            <button className="icon-button" title="View Posts">
                <FontAwesomeIcon icon={faList} />
            </button>
        </Link>
    );

    const profileButton = (
        <Link to="/dash/users">
            <button className="icon-button" title="View Profile">
                <FontAwesomeIcon icon={faUser} />
            </button>
        </Link>
    );

    const createPostButton = (
        <Link to="/dash/create-post">
            <button className="icon-button" title="Create Post">
                <FontAwesomeIcon icon={faEdit} />
            </button>
        </Link>
    );

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );
    
    const content = (
        <header className="dash-header">
            <div className="dash-header__container">
                <Link to="/dash">
                    <h1 className="dash-header__title">TaskSync</h1>
                </Link>
                <nav className="dash-header__nav">
                    {homeButton}
                    {postListButton}
                    {profileButton}
                    {createPostButton}
                    {logoutButton}
                </nav>
            </div>
        </header>
    );

    return content;
}

export default DashHeader;
