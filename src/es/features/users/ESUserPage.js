import { useEffect, useState } from 'react'
import { useGetUserDataMutation } from '../../../features/users/usersApiSlice'
import flags from '../../../config/flags'
import { useGetUserRecipesMutation } from '../../../features/recipes/recipesApiSlice'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import LoadingIcon from '../../../components/LoadingIcon'

const UserPage = () => {

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [getUserData] = useGetUserDataMutation()

    const [getUserRecipes] = useGetUserRecipesMutation()

    const [currentUser, setCurrentUser] = useState()

    const [userRecipes, setUserRecipes] = useState()

    const { id : userID} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            var userData = await getUserData({userID: userID})
            //console.log(userData)
            if (userData.data === null) navigate('/es/user/404')
            setCurrentUser(() => {
                return userData
            })
            var recipes = await getUserRecipes({userID: userData?.data?._id})
            setUserRecipes(() => {
                return recipes
            })
        }
        fetchData()
    }, [getUserData, userID, getUserRecipes, navigate])


    try {

        //console.log(currentUser)

        const recipeElements = userRecipes.data.map(recipe => {

            return (
                <Link to={`/es/recipes/${recipe.searchField}`} key={recipe.searchField}>{recipe.name}</Link>
            )
        })

        var finalImage
        //const avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']
        if (!currentUser.data.image) {
            finalImage = '../../Images/user-icon.png'
        } else if (currentUser.data.image.split('.')[1] === 'png') {
            finalImage = `../../Images/${currentUser.data.image}`
        } else {
            finalImage = currentUser.data.image
        }

        const countryFlag = flags.filter(flag => flag.country === currentUser.data.country)

        return (
            <div id="user-page-container">
                <div id='user-info-container'>
                    <div id='name-image-flag'>
                        <img src={finalImage} alt='user' id='user-page-image' />
                        <h1>{currentUser.data.username}</h1>
                        <img src={countryFlag[0].flag} alt='country' id='country-flag' />
                    </div>
                    <div id='about-user'>
                        <p id='about-title'>Acerca de {currentUser.data.username}:</p>
                        <p>{currentUser.data.about}</p>
                    </div>
                    <div id='user-page-recipes'>
                        <p id='user-page-recipes-label'>Recetas publicadas por {currentUser.data.username}:</p>
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