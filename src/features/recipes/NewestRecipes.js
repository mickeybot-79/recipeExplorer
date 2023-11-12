import { useEffect, useState } from 'react'
//import { useGetRecipesQuery } from './recipesApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetNewestRecipesMutation } from './recipesApiSlice'
import LoadingIcon from '../../components/LoadingIcon'

const NewestRecipes = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [getNewestRecipes] = useGetNewestRecipesMutation()

    const [newestRecipes, setNewestRecipes] = useState()

    useEffect(() => {
        const fetchNewestRecipes = async () => {
            const recipes = await getNewestRecipes({lng: usrlng})
            setNewestRecipes(() => {
                return recipes.data
            })
        }
        fetchNewestRecipes()
    }, [getNewestRecipes, usrlng])

    var content

    try {

        const newestRecipeElements = [...newestRecipes].sort((a, b) => b.createdOn - a.createdOn)

        content = newestRecipeElements.map(recipe => {

            const listener = () => {
                navigate(`/recipes/${recipe.searchField}`)
            }

            return (
                <div
                    key={recipe._id}
                    className='newest-recipe-container'
                    onClick={listener}
                >
                    <div className='recipe-images-container'>
                        <img src={recipe.pictures[0]} alt='recipe' />
                    </div>
                    <div className='name-likes'>
                        <p className='newest-recipe-name'>{recipe.name}</p>
                        <p className='recipe-likes'>{recipe.likes} Likes</p>
                    </div>
                </div>
            )
        })
    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc='../../Images/favicon-gif.gif'/>
        )
    }

    return (
        <>
            <div id='newest-container'>
                <h1 id='newest-recipes-page-title'>Newest recipes</h1>
                <div id='newest-recipes-container'>
                    {content}
                </div>
            </div>
        </>
    )
}

export default NewestRecipes