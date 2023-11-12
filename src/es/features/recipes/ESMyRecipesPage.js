import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import jwtDecode from 'jwt-decode'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetUserRecipesMutation } from '../../../features/recipes/recipesApiSlice'
import { useGetUserDataMutation } from '../../../features/users/usersApiSlice'

const MyRecipesPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    var userName = token ? jwtDecode(token).UserInfo.username : ''

    const [getUserRecipes] = useGetUserRecipesMutation()

    const [getUserData] = useGetUserDataMutation()
    
    const [recipes, setRecipes] = useState()

    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const userRecipes = await getUserRecipes({userID : userID})
            const foundUser = await getUserData({userID: userName})
            setRecipes(userRecipes.data)
            setCurrentUser(foundUser.data)
        }
        fetchData()
    }, [userID, getUserRecipes, getUserData, userName])

    var content

    if (!recipes || !currentUser) {
        
        content = (
            <div style={{
                width: '100%',
                height: '300px',
                display: 'grid',
                placeContent: 'center'
            }}>
                <img
                    src='../../../Images/favicon-gif.gif'
                    alt='icon'
                    style={{
                        marginTop: '-100px',
                        width: '150px',
                        filter: 'sepia(40%)'
                    }}
                />
            </div>
        )

        return (
            <div id='favorites-page-container'>
            <div id='myrecipes-container'>
                <h1>Tus Recetas</h1>
                <div>
                    {content}
                </div>
            </div>
        </div>
        )
    }

    content = recipes.map(recipe => {

        const listener = () => {
            navigate(`/es/recipes/${recipe.searchField}`)
        }

        return (
            <div key={recipe._id} className='myrecipe-item-container'>
                <img src={`${recipe.pictures}`} alt='recipe' />
                <p
                    onClick={listener}
                    className='myrecipe-item'
                >{`${recipe.name}`}
                </p>
            </div>
        )

        //return (<p key={recipe._id} onClick={listener}>{recipe.name}</p>)
    })
       
    return (
        <div id='myrecipes-page-container'>
            <div id='myrecipes-container'>
                <h1 id='myrecipes-title'>Tus Recetas</h1>
                <div>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default MyRecipesPage