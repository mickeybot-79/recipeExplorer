import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import jwtDecode from 'jwt-decode'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetMyFavoriteRecipesMutation } from '../../../features/recipes/recipesApiSlice'
import { useGetUserDataMutation } from '../../../features/users/usersApiSlice'

const MyFavoriteRecipesPage = () => {

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

    const [getMyFavoriteRecipes] = useGetMyFavoriteRecipesMutation()

    const [getUserData] = useGetUserDataMutation()
    
    const [recipes, setRecipes] = useState()

    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const userRecipes = await getMyFavoriteRecipes({userID : userID})
            const foundUser = await getUserData({userID: userName})
            setRecipes(userRecipes.data)
            setCurrentUser(foundUser.data)
        }
        fetchData()
    }, [userID, getMyFavoriteRecipes, getUserData, userName])

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
                <div id='favorites-container'>
                    <h1>Tus recetas favoritas</h1>
                    <div>
                        {content}
                    </div>
                </div>
            </div>
        )
    }

    //const allRecipes = Object.values(recipes.entities)

    // console.log(recipes)
    // console.log(currentUser)

    const favoriteRecipes = []

    for (let i = 0; i < currentUser.favorites.length; i++) {
        favoriteRecipes.push(recipes.filter(recipe => recipe._id === currentUser.favorites[i]))
    }

    content = favoriteRecipes.map(recipe => {

        const listener = () => {
            navigate(`/es/recipes/${recipe[0]?.searchField}`)
        }

        return (
            <div key={recipe[0]?._id} className='favorite-item-container'>
                <img src={`../${recipe[0]?.pictures[0]}`} alt='recipe' />
                <p
                    onClick={listener}
                    className='favorite-item'
                >{`${recipe[0]?.name}`}
                </p>
            </div>
        )
    })
       
    return (
        <div id='favorites-page-container'>
            <div id='favorites-container'>
                <h1 id='favorites-title'>Tus recetas favoritas</h1>
                <div>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default MyFavoriteRecipesPage