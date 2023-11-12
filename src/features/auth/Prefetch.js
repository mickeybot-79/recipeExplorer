import { store } from '../../app/store'
import { recipesApiSlice } from '../recipes/recipesApiSlice'
//import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(recipesApiSlice.util.prefetch('getRecipes', 'recipesList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch
