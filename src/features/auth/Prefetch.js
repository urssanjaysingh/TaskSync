import { store } from '../../app/store'
import { userApiSlice } from '../users/userApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        store.dispatch(userApiSlice.util.prefetch('getUsers', 'UserProfile', { force: true }))
    }, [])

    return <Outlet />
}

export default Prefetch
