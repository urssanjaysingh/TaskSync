import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from '../../hooks/usePersist';
import Cookies from 'js-cookie';
import useTitle from "../../hooks/useTitle";
import PulseLoader from 'react-spinners/PulseLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Login = () => {
    useTitle('Login');

    const userRef = useRef();
    const pwdRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState('')

    const [persist, setPersist] = usePersist()

    const [userValid, setUserValid] = useState(false)
    const [pwdValid, setPwdValid] = useState(false)

    const [success, setSuccess] = useState(false);

    const handleUserChange = (e) => {
        const newUser = e.target.value;
        setUsername(newUser);
        setUserValid(USER_REGEX.test(newUser));
    };

    const handlePwdChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPwdValid(PWD_REGEX.test(newPassword));
    };

    const handleToggle = () => setPersist(prev => !prev)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef?.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const errClass = errMsg ? "errmsg" : "offscreen"

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ username, password }).unwrap();
            const { accessToken, userId } = response;

            // Dispatch the setCredentials action with both accessToken and userId
            dispatch(setCredentials({ accessToken, userId }));

            // Set userId in a cookie with SameSite attribute set to None
            Cookies.set('userId', userId, { expires: 7, sameSite: 'none', secure: true }); // Expires in 7 days

            // Set the username in a cookie with SameSite attribute set to None
            Cookies.set('username', username, { expires: 7, sameSite: 'none', secure: true }); // Expires in 7 days

            setSuccess(true);
            setUsername('');
            setPassword('');
            navigate('/dash');

        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }
    };

    return (
        <section className="public">
            <header>
                <h1><span className="nowrap">FlexiBlog</span></h1>
            </header>
            <main className="public__main">
                <div className="login" style={{ width: "400px" }}>
                    {success ? (
                        <div className="text-center">
                            <h1>Success!</h1>
                            <br />
                        </div>
                    ) : (
                        <div className="form-container">
                            <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                            <h1 className="text-center">Login</h1><br />
                            <form onSubmit={handleSubmit}>
                                {/* User */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        id="user"
                                        placeholder="Username"
                                        value={username}
                                        onChange={handleUserChange}
                                        className={`form-control ${userValid ? "" : "is-invalid"}`}
                                        ref={userRef}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePwdChange}
                                        className={`form-control ${pwdValid ? "" : "is-invalid"}`}
                                        ref={pwdRef}
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                {isLoading ? (
                                    <div className="button-container">
                                        <PulseLoader color={"#405de6"} />
                                    </div>
                                ) : (
                                    <div className="button-container">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!userValid || !pwdValid}
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                )}
                                <br />
                                <label htmlFor="persist" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            marginRight: "8px",
                                        }}
                                        id="persist"
                                        onChange={handleToggle}
                                        checked={persist}
                                    />
                                    Remember Me
                                </label>
                            </form>
                        </div>
                    )}
                </div>
            </main>
            <footer>
                <div className="form-button-container">
                    <Link to="/" className="btn btn-link">
                        <FontAwesomeIcon icon={faHome} /> Home
                    </Link>
                    <span className="space"></span>
                    <Link to="/register" className="btn btn-link">
                        <FontAwesomeIcon icon={faUserPlus} /> Sign Up
                    </Link>
                </div>
            </footer>
        </section>
    );
}

export default Login;
