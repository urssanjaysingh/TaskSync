import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const Public = () => {
    const content = (
        <section className="home">
            <header className='home__header'>
                <h1>Welcome to TaskSync!</h1>
            </header>
            <main className="home__main">
                <p>Streamline your tasks and stay organized with TaskSync.</p>
                <p>Efficiently manage your tasks and keep track of your progress.</p>
            </main>
            <footer className="home__footer">
                <div className="footer-links">
                    <div className="button-container">
                        <Link className="btn btn-link" to="/register">
                            <FontAwesomeIcon icon={faUser} /> Sign Up
                        </Link>
                        <span className="space"></span>
                        <Link className="btn btn-link" to="/login">
                            <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                        </Link>
                    </div>
                </div>
            </footer>
        </section>
    );

    return content;
}

export default Public;
