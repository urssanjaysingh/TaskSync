import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faHome, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { useRegisterMutation } from '../features/auth/authApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
    useTitle('Register');

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(true);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // State to track form validity
    const [formValid, setFormValid] = useState(false);

    const [register, { isLoading }] = useRegisterMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        // Validate email
        const emailRegex = EMAIL_REGEX;
        setValidEmail(emailRegex.test(newEmail));
    };

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    // Update form validity whenever form fields change
    useEffect(() => {
        setFormValid(validName && validEmail && validPwd && validMatch);
    }, [validName, validEmail, validPwd, validMatch]);

    const errClass = errMsg ? "errmsg" : "offscreen"

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if form is valid before proceeding
        if (!formValid) {
            setErrMsg("Please fill in the required fields correctly.");
            return;
        }

        // Create a data object with the user's registration information
        const registrationData = {
            username: user,
            email: email,
            password: pwd,
        };

        try {
            // Call the register mutation with registrationData
            const response = await register(registrationData).unwrap();

            // Registration successful
            setSuccess(true);
        } catch (error) {
            // Handle errors from the register mutation
            if (error.status === 400) {
                setErrMsg("Registration failed: Invalid data.");
            } else if (error.status === 409) {
                setErrMsg("Username or email already in use.");
            } else {
                setErrMsg("An error occurred during registration.");
            }
        }
    };

    return (
        <section className="public">
            <header className="dash-header">
                <div className="dash-header__container">
                    <h1 className="dash-header__title">TaskSync</h1>
                    <nav className="dash-header__nav">
                        <Link to="/" className="btn btn-link">
                            <FontAwesomeIcon icon={faHome} /> Home
                        </Link>
                        <Link to="/login" className="btn btn-link">
                            <FontAwesomeIcon icon={faSignInAlt} /> Sign In
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="public__main">
                <div className="register" style={{ width: "400px" }}>
                    {success ? (
                        <div className="text-center">
                            <h1>Registration Successfull!</h1>
                            <br />
                            <p>
                                <Link to="/login" className="btn btn-primary">Login</Link>
                            </p>
                        </div>
                    ) : (
                        <div className="form-container">
                            <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
                            <h1 className="text-center">Register</h1><br />
                            <form onSubmit={handleSubmit}>
                                {/* Username */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        className={`form-control ${validName ? "" : "is-invalid"}`}
                                        aria-invalid={validName ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)}
                                    />
                                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        4 to 24 characters.<br />
                                        Must begin with a letter.<br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        autoComplete="off"
                                        value={email}
                                        required
                                        onChange={handleEmailChange}
                                        className={`form-control ${validEmail ? "" : "is-invalid"}`}
                                        aria-invalid={!validEmail}
                                        aria-describedby="emailnote"
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                    />
                                    <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                                        Please enter a valid email address.
                                    </p>
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        autoComplete="off"
                                        value={pwd}
                                        required
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        className={`form-control ${validPwd ? "" : "is-invalid"}`}
                                    />
                                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                                        8 to 24 characters.<br />
                                        Must include uppercase and lowercase letters, a number and a special character.<br />
                                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        id="confirm_pwd"
                                        placeholder="Confirm Password"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        autoComplete="off"
                                        value={matchPwd}
                                        required
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="confirmnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                        className={`form-control ${validMatch ? "" : "is-invalid"}`}
                                    />
                                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                                        Must match the first password input field.
                                    </p>
                                </div>
                                {isLoading ? (
                                    <div className="button-container">
                                        <PulseLoader color={"#405de6"} /> {/* Use Instagram's primary blue color */}
                                    </div>
                                ) : (
                                    <div className="button-container">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!formValid}
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </section>
    );
}

export default Register;
