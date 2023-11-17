import { useEffect, useState } from 'react'
import { useGetUserPageDataMutation } from './usersApiSlice'
import flags from '../../config/flags'
import ESflags from '../../config/ESflags'
import { useGetUserRecipesMutation } from '../recipes/recipesApiSlice'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import LoadingIcon from '../../components/LoadingIcon'

const UserPage = () => {

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [getUserPageData] = useGetUserPageDataMutation()

    const [getUserRecipes] = useGetUserRecipesMutation()

    const [currentUser, setCurrentUser] = useState()

    const [userRecipes, setUserRecipes] = useState()

    const { id : userID} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            var userData = await getUserPageData({userID: userID})
            //console.log(userData)
            if (userData.data === null) navigate('/user/404')
            setCurrentUser(() => {
                return userData
            })
            var recipes = await getUserRecipes({userID: userData?.data?.id})
            setUserRecipes(() => {
                return recipes
            })
        }
        fetchData()
    }, [getUserPageData, userID, getUserRecipes, navigate])

    try {

        const recipeElements = userRecipes.data.map(recipe => {

            return (
                <Link to={`/recipes/${recipe.searchField}`} key={recipe.searchField}>{recipe.name}</Link>
            )
        })

        var finalImage
        if (!currentUser.data.image) {
            finalImage = '../../Images/user-icon.png'
        } else if (currentUser.data.image.split('.')[1] === 'png') {
            finalImage = `../../Images/${currentUser.data.image}`
        } else {
            finalImage = currentUser.data.image
        }

        var countryFlag = flags.filter(flag => flag.country === currentUser.data.country)
        if (!countryFlag[0]) countryFlag = ESflags.filter(flag => flag.country === currentUser.data.country)

        return (
            <div id="user-page-container">
                <div id='user-info-container'>
                    <div id='name-image-flag'>
                        <img src={finalImage} alt='user' id='user-page-image' />
                        <h1>{userID}</h1>
                        <img src={countryFlag[0].flag} alt='country' id='country-flag' />
                    </div>
                    <div id='about-user'>
                        <p id='about-title'>About {userID}:</p>
                        <p>{currentUser.data.about}</p>
                    </div>
                    <div id='user-page-recipes'>
                        <p id='user-page-recipes-label'>Recipes posted by {currentUser.data.username}:</p>
                        <div id='user-recipes-container'>
                            {recipeElements}
                        </div>
                    </div>
                </div>
            </div>
        )

    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc='../../Images/favicon-gif.gif'/>
        )
    }
}

export default UserPage