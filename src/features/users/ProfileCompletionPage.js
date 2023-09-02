import React, { useRef, useState, useEffect } from "react";
import useTitle from "../../hooks/useTitle";
import PulseLoader from 'react-spinners/PulseLoader';
import { useUpdateUserMutation } from './userApiSlice';
import { useGetUsersQuery } from "./userApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileCompletionPage = () => {
    useTitle('Complete Profile');

    // Get the userId from your authentication state
    const userId = useSelector(state => state.auth.userId);

    // Fetch user profile data using useGetUsersQuery
    const {
        data: userProfile,
    } = useGetUsersQuery(userId);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const bioRef = useRef();
    const linkedinRef = useRef();
    const githubRef = useRef();
    const websiteRef = useRef();
    const avatarRef = useRef();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [website, setWebsite] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [updateProfile] = useUpdateUserMutation();

    const [formData, setFormData] = useState(new FormData());

    const navigate = useNavigate();

    // Prepopulate form fields with user profile data if available
    useEffect(() => {
        firstNameRef.current.focus();

        if (userProfile) {

            const { entities } = userProfile;
            const userId = userProfile.ids[0];
            const user = entities[userId];
            
            setFirstName(user.profile.first_name || '');
            setLastName(user.profile.last_name || '');
            setBio(user.profile.bio || '');
            setLinkedin(user.profile.social_links.linkedin || '');
            setGithub(user.profile.social_links.github || '');
            setWebsite(user.profile.social_links.website || '');
        }
    }, [userProfile, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // Create a new FormData instance and append all the fields
        const newFormData = new FormData();

        if (firstName) newFormData.append('first_name', firstName);
        if (lastName) newFormData.append('last_name', lastName);
        if (bio) newFormData.append('bio', bio);
        if (linkedin) newFormData.append('linkedin', linkedin);
        if (github) newFormData.append('github', github);
        if (website) newFormData.append('website', website);

        if (avatar) {
            newFormData.append('avatar', avatar); // Append the avatar field if available
        }

        try {
            // Pass the userId and formData to the mutation
            const response = await updateProfile({ userId, userData: newFormData }).unwrap();

            setSuccessMessage('Profile updated successfully!');
            navigate(-1);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('An error occurred while updating the profile.');
        }

        setIsLoading(false);
    };

    return (
        <main className="dash__main">
            <div className="register" style={{ width: "400px" }}>
                <div className="form-container">
                    <h1 className="text-center" style={{ color: "black" }}>Complete Profile</h1><br />
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* First Name */}
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="First Name"
                                ref={firstNameRef}
                                autoComplete="off"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Last Name"
                                ref={lastNameRef}
                                autoComplete="off"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {/* Bio */}
                        <div className="mb-3">
                            <textarea
                                placeholder="Bio"
                                ref={bioRef}
                                value={bio}
                                rows="1"
                                onChange={(e) => setBio(e.target.value)}
                                className="form-control"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: 'none',
                                    height: 'auto',
                                    whiteSpace: 'pre-wrap', // This preserves line breaks and whitespace
                                    wordWrap: 'break-word', // This ensures long words wrap correctly
                                }}
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="LinkedIn"
                                ref={linkedinRef}
                                autoComplete="off"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {/* GitHub */}
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="GitHub"
                                ref={githubRef}
                                autoComplete="off"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {/* Website */}
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Website"
                                ref={websiteRef}
                                autoComplete="off"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        {/* Avatar */}
                        <div className="mb-3">
                            <label htmlFor="avatar">Choose an Avatar Image:</label>
                            <input
                                type="file"
                                id="avatar"
                                ref={avatarRef}
                                accept="image/*"
                                onChange={(e) => {
                                    const newAvatar = e.target.files[0];
                                    setAvatar(newAvatar); // Update the avatar state
                                }}
                                style={{
                                    maxWidth: "100%",
                                }}
                                className="form-control"
                            />
                        </div>
                        {successMessage && (
                            <div className="success-message" style={{ color: 'green', marginBottom: '1em' }}>
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="error-message" style={{ color: 'red', marginBottom: '1em' }}>
                                {errorMessage}
                            </div>
                        )}
                        {isLoading ? (
                            <div className="button-container">
                                <PulseLoader color={"#405de6"} /> {/* Use Instagram's primary blue color */}
                            </div>
                        ) : (
                            <div className="button-container">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save Profile
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}

export default ProfileCompletionPage;
