import React, { useState } from "react";
import { useCreatePostMutation } from "./postApiSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const CreatePostPage = () => {
    useTitle('Create Post')

    const [content, setContent] = useState("");
    const [createPost, { isLoading }] = useCreatePostMutation();
    const [localSuccessMessage, setLocalSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleCreatePost = () => {
        if (content.trim() === "") {
            return; // Don't create a post with empty content
        }

        createPost({
            content,
        })
            .unwrap()
            .then((response) => {
                setLocalSuccessMessage("Post created successfully!");

                // Clear the success message after a delay (e.g., 3 seconds)
                setTimeout(() => {
                    setLocalSuccessMessage("");

                    // Navigate after another delay (e.g., 2 seconds)
                    setTimeout(() => {
                        navigate("/dash/post/all");
                    }, 1000); // Adjust the delay time as needed
                }, 1000);
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle error
            });
    };

    return (
        <main className="dash__main">
            <div className="create-post-form" style={{ width: "100%"}} >
                <div className="form-container">
                    <h1 className="text-center" style={{ color: "black" }}>Create Post</h1>
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post here"
                            rows={10}
                            style={{ maxWidth: "100%" }}
                        />
                    </div>
                    {localSuccessMessage && (
                        <p style={{ color: "green", fontWeight: "bold" }} className="text-center">
                            {localSuccessMessage}
                        </p>
                    )}
                    <div className="button-container">
                        {isLoading ? (
                            <div className="button-container">
                                <PulseLoader color={"#405de6"} /> {/* Use Instagram's primary blue color */}
                            </div>
                        ) : (
                            <button className="btn btn-primary" onClick={handleCreatePost} disabled={isLoading}>
                                Create Post
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreatePostPage;
