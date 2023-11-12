import { useEffect, useState } from 'react'
//import { useGetRecipesQuery } from './recipesApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetBestRecipesMutation } from './recipesApiSlice'
import LoadingIcon from '../../components/LoadingIcon'

const BestRecipes = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [getBestRecipes] = useGetBestRecipesMutation()

    const [bestRecipes, setBestRecipes] = useState()

    useEffect(() => {
        const fetchBestRecipes = async () => {
            const recipes = await getBestRecipes({lng: usrlng})
            setBestRecipes(() => {
                return recipes.data
            })
        }
        fetchBestRecipes()
    }, [getBestRecipes, usrlng])

    var content
    
    try {

        const bestRecipeElements = [...bestRecipes].sort((a, b) => b.likes - a.likes)

        content = bestRecipeElements.map(recipe => {

            const listener = () => {
                navigate(`/recipes/${recipe.searchField}`)
            }

            return (
                <div
                    key={recipe._id}
                    className='best-recipe-container'
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
                <h1 id='best-recipes-page-title'>Most popular recipes</h1>
                <div id='newest-recipes-container'>
                    {content}
                </div>
            </div>
        </>
    )
}

export default BestRecipes