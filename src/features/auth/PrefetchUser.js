import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const PrefetchUser = () => {

    useEffect(() => {
        store.dispatch(usersApiSlice.util.prefetch('getUser', 'usersList', { force: true }))
    }, [])

    return <Outlet />
}
export default PrefetchUser