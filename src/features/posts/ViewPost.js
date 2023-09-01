import PulseLoader from 'react-spinners/PulseLoader';
import { faHeart, faComment, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
    useToggleLikeMutation,
    useGetAllPostsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useDeletePostMutation,
} from './postApiSlice';

const ViewPost = () => {
    const userId = Cookies.get('userId');

    const { data: allPosts, isLoading } = useGetAllPostsQuery(null, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const [toggleLike] = useToggleLikeMutation();
    const [createComment] = useCreateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [deletePost] = useDeletePostMutation();

    const [userPosts, setUserPosts] = useState([]);
    const [activePostId, setActivePostId] = useState(null);
    const [comments, setComments] = useState({});

    useEffect(() => {
        console.log('Fetching all posts...');
        if (allPosts) {
            console.log('Received all posts:', allPosts);
            setUserPosts(allPosts);
        }
    }, [allPosts]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <PulseLoader color={"#405de6"} />
            </div>
        );
    }

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId);
            // Filter out the deleted post from the local state
            const updatedPosts = userPosts.filter((post) => post._id !== postId);
            setUserPosts(updatedPosts);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleToggleLike = async (postId) => {
        try {
            const updatedPosts = userPosts.map(post => {
                if (post._id === postId) {
                    const updatedLikes = post.likes.includes(userId)
                        ? post.likes.filter(id => id !== userId)
                        : [...post.likes, userId];
                    return { ...post, likes: updatedLikes };
                }
                return post;
            });

            setUserPosts(updatedPosts);

            await toggleLike(postId);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCreateComment = (postId) => {
        setActivePostId(postId);
    };

    const handleCommentSubmit = async (postId, commentContent) => {
        try {
            const newComment = {
                _id: new Date().getTime(),
                content: commentContent,
                author: userId,
            };

            const updatedComments = {
                ...comments,
                [postId]: [...(comments[postId] || []), newComment],
            };

            setComments(updatedComments);

            const { data } = await createComment({
                postId,
                commentData: {
                    content: commentContent,
                    author: userId
                }
            });

            const newUpdatedComments = {
                ...comments,
                [postId]: [...(comments[postId] || []), { ...data, author: userId }],
            };

            setComments(newUpdatedComments);

            const updatedUserPosts = userPosts.map(post => {
                if (post._id === postId) {
                    const updatedPost = { ...post, comments: data.comments };
                    return updatedPost;
                }
                return post;
            });

            setUserPosts(updatedUserPosts);

            setActivePostId(null);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await deleteComment({ postId, commentId });

            const updatedPosts = userPosts.map(post => {
                if (post._id === postId) {
                    const updatedComments = post.comments.filter(comment => comment._id !== commentId);
                    return { ...post, comments: updatedComments };
                }
                return post;
            });

            setUserPosts(updatedPosts);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <main className="dash__main">
            <div className="view-post">
                <div className="post-list">
                    {userPosts.map((post) => (
                        <div className="post" key={post._id}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img
                                    src={post.authorAvatar}
                                    alt=''
                                    style={{ width: "30px", height: "30px", marginRight: "8px" }} // Adjust the width and height as needed
                                />
                                <div className="comment-author">{post.authorUsername}</div>
                            </div>
                            <p className='post-content' dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
                            <div className="post-actions">
                                <button
                                    className="like-button"
                                    onClick={() => handleToggleLike(post._id)}
                                >
                                    <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                                    {post.likes.includes(userId) ? 'Unlike' : 'Like'} ({post.likes.length})
                                </button>
                                <button
                                    className="comment-button"
                                    onClick={() => handleCreateComment(post._id)}
                                >
                                    <FontAwesomeIcon icon={faComment} className="comment-icon" />
                                    Comment
                                </button>
                            </div>
                            {post.comments.map((comment) => (
                                <div className="comment" key={comment._id}>
                                    <div className="comment-content">
                                        <p className="comment-author">{comment.authorUsername}</p>
                                        <p>{comment.content}</p>
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="delete-comment-button"
                                        onClick={() => handleDeleteComment(post._id, comment._id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            ))}
                            {activePostId === post._id && (
                                <CommentForm
                                    postId={post._id}
                                    onSubmit={handleCommentSubmit}
                                    onCancel={() => setActivePostId(null)}
                                />
                            )}
                            <div className="button-container">
                                <button
                                    className="delete-post-button"
                                    onClick={() => handleDeletePost(post._id)}
                                >
                                    Delete Post
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

const CommentForm = ({ postId, onSubmit, onCancel }) => {
    const [commentContent, setCommentContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(postId, commentContent);
        setCommentContent('');
    };

    return (
        <div className="create-post-form" style={{ width: "400px" }}>
            <div className="form-container">
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write your comment here"
                        rows="2"
                        required
                    />
                </div>
                <div style={{ marginTop: "0px" }} className="button-container">
                    <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
                        Submit Comment
                    </button>
                    <span className="space"></span>
                    <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ViewPost;
