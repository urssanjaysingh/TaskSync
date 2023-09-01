import { store } from '../../app/store'

import { postApiSlice } from '../posts/postApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        store.dispatch(postApiSlice.util.prefetch('getAllPosts', 'ViewPost', { force: true }))
        store.dispatch(postApiSlice.util.prefetch('getAllPosts', 'createPostPage', { force: true }))
    }, [])

    return <Outlet />
}

export default Prefetch
