import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetPostsByUserQuery } from '../posts/postApiSlice';
import UpdatePostForm from '../posts/UpdatePostForm'; // Import the UpdatePostForm component
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle';

const UserPostList = () => {
    useTitle('Your Posts')
    const { userId } = useParams();

    const [selectedPostId, setSelectedPostId] = useState(null); // State to track selected post for update

    // Fetch posts by user using useGetPostsByUserQuery
    const { data: postsData, isLoading, isError, error } = useGetPostsByUserQuery(userId);

    if (isLoading) return <PulseLoader color={"#405de6"} />

    if (isError) {
        if (error.status === 404) {
            return <div>Posts not found</div>;
        } else {
            return <div>Error: {error.message}</div>;
        }
    }

    const handleUpdateClick = (postId) => {
        setSelectedPostId(postId);
    };

    const handleUpdateFormClose = () => {
        setSelectedPostId(null);
    };

    return (
        <>
            <section className="public">
                <div className="post-list">
                    {postsData
                        .slice()
                        .reverse()
                        .map(post => (
                            <div className="post-card" key={post.id}>
                                {selectedPostId === post.id ? (
                                    <div className="update-form-container">
                                        <UpdatePostForm
                                            postId={selectedPostId}
                                            initialValues={post}
                                            onUpdateSuccess={handleUpdateFormClose}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <button className="btn btn-link" onClick={() => handleUpdateClick(post.id)}>
                                            Edit
                                        </button>
                                        {post.image && post.image.filename && post.image.path && (
                                            <div className="post-image">
                                                    <img src={`https://flexiblog-api.onrender.com${post.image.path}`} alt={post.image.filename} />
                                            </div>
                                        )}
                                        <div className="post-meta">
                                            <span className="author">Author: {post.author && post.author.profile.name ? post.author.profile.name : 'Unknown'}</span><br />
                                            <span className="tags">Tags: {post.tags.join(', ')}</span><br />
                                            <span className="created-at">
                                                Created at: {new Date(post.createdAt).toLocaleDateString()}
                                            </span>&nbsp;&nbsp;
                                            <span className="updated-at">
                                                Updated at: {new Date(post.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="post-title">{post.title}</h3>
                                        <div className="post-content">
                                            <p style={{ marginBottom: "5px" }}>
                                                {post.content.length > 150
                                                    ? `${post.content.substring(0, 150)}...`
                                                    : post.content}
                                            </p>
                                            <button className="btn btn-link">
                                                <Link to={`/dash/post/user/${userId}/${post.id}`}>
                                                    Read More
                                                </Link>
                                            </button>
                                            <span className="space"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </section>
        </>
    );
};

export default UserPostList;
