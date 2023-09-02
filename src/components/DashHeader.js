import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faHome, faUser, faEdit, faList, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';

const DashHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

    // Determine the current route pathname
    const currentRoute = location.pathname;

    // Define navigation buttons based on the current route
    const navigationButtons = {
        '/dash': [],
        '/dash/post/all': [
            {
                icon: faHome,
                title: 'Dashboard Home',
                to: '/dash',
            },
            {
                icon: faList,
                title: 'View Posts',
                to: '/dash/post/all',
            },
            {
                icon: faEdit,
                title: 'Create Post',
                to: '/dash/create-post',
            },
            {
                icon: faClipboardList,
                title: 'View Tasks',
                to: '/dash/task/all',
            },
        ],
        '/dash/create-post': [
            {
                icon: faHome,
                title: 'Dashboard Home',
                to: '/dash',
            },
            {
                icon: faList,
                title: 'View Posts',
                to: '/dash/post/all',
            },
            {
                icon: faEdit,
                title: 'Create Post',
                to: '/dash/create-post',
            },
            {
                icon: faClipboardList,
                title: 'View Tasks',
                to: '/dash/task/all',
            },
        ],
        '/dash/task/all': [
            {
                icon: faHome,
                title: 'Dashboard Home',
                to: '/dash',
            },
            {
                icon: faList,
                title: 'View Posts',
                to: '/dash/post/all',
            },
            {
                icon: faClipboardList,
                title: 'View Tasks',
                to: '/dash/task/all',
            },
            {
                icon: faEdit,
                title: 'Create Task',
                to: '/dash/create-task',
            },
        ],
        '/dash/create-task': [
            {
                icon: faHome,
                title: 'Dashboard Home',
                to: '/dash',
            },
            {
                icon: faList,
                title: 'View Posts',
                to: '/dash/post/all',
            },
            {
                icon: faClipboardList,
                title: 'View Tasks',
                to: '/dash/task/all',
            },
            {
                icon: faEdit,
                title: 'Create Task',
                to: '/dash/create-task',
            },
        ],
        '/dash/users': [
            {
                icon: faHome,
                title: 'Dashboard Home',
                to: '/dash',
            },
            {
                icon: faUser,
                title: 'View Profile',
                to: '/dash/users',
            },
            {
                icon: faList,
                title: 'View Posts',
                to: '/dash/post/all',
            },
            {
                icon: faClipboardList,
                title: 'View Tasks',
                to: '/dash/task/all',
            },
        ],
    };

    const buttons = navigationButtons[currentRoute] || [];

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

    return (
        <header className="dash-header">
            <div className="dash-header__container">
                <Link to="/dash">
                    <h1 className="dash-header__title">TaskSync</h1>
                </Link>
                <nav className="dash-header__nav">
                    {buttons.map((button, index) => (
                        <Link key={index} to={button.to}>
                            <button className="icon-button" title={button.title}>
                                <FontAwesomeIcon icon={button.icon} />
                            </button>
                        </Link>
                    ))}
                    {logoutButton}
                </nav>
            </div>
        </header>
    );
}

export default DashHeader;
