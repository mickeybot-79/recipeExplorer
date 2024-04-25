import { useEffect, useState } from "react"
import { useGetRecipeMutation } from './recipesApiSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetUserWhoPostedMutation } from '../users/usersApiSlice'

const Recipe = ({ currentUser }) => {

    const isTemp = window.sessionStorage.getItem('isTemp')

    const usrlng = window.localStorage.getItem('usrlng')

    const [getRecipe] = useGetRecipeMutation()

    const [getUserWhoPosted] = useGetUserWhoPostedMutation()

    const navigate = useNavigate()

    const { id } = useParams()

    const [currentRecipe, setCurrentRecipe] = useState({ ingredients: [] })

    const [recipeAuthor, setRecipeAuthor] = useState()

    const [unitType, setUnitType] = useState('traditional')

    const [ingredientElements, setIngredientElements] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRecipe({ id: id, commentsSlice: 0 })
            if (response?.error?.originalStatus === 400 || response?.data === null) navigate('/recipe/404')
            setCurrentRecipe(() => {
                return response.data.recipe
            })
            const authorUser = await getUserWhoPosted({ userID: response?.data?.recipe?.createdBy })
            setRecipeAuthor(() => {
                return authorUser ?? ''
            })
            console.log("response.data.recipe.language: ", response.data.recipe.language)
            console.log("usrlng: ", usrlng)
            if (response.data.recipe.language !== usrlng) {
                window.localStorage.setItem('usrlng', response.data.recipe.language)
            }
        }
        fetchData()
    }, [id, getRecipe, navigate, getUserWhoPosted])

    useEffect(() => {
        var finalUnit
        var finalIngredient
        var numberToConvert
        var fragmentAmount
        var ingredientQuantity
        setIngredientElements(() => {
            const allIngredientElements = []
            if (unitType === 'traditional') {
                for (let i = 0; i < currentRecipe.ingredients.length; i++) {
                    const currentIngredient = currentRecipe.ingredients[i]
                    if (currentIngredient.unit === 'whole unit' || !currentIngredient.quantity || currentIngredient.quantity === null) {
                        finalUnit = ''
                    } else if (parseInt(currentIngredient.quantity) === 1 || currentIngredient.unit.split('')[currentIngredient.unit.length - 1] === 's') {
                        finalUnit = `${currentIngredient.unit} of`
                    } else if (parseInt(currentIngredient.quantity) !== 1) {
                        finalUnit = `${currentIngredient.unit}s of`
                    }
                    allIngredientElements.push((
                        <p className='ingredient' key={i}><span style={{ color: 'rgb(102, 35, 35)' }}>{`${currentIngredient.quantity ? currentIngredient.quantity : ''}`}</span>{` ${finalUnit} ${currentIngredient.ingredient}`}</p>
                    ))
                }
            } else if (unitType === 'metric') {
                for (let i = 0; i < currentRecipe.ingredients.length; i++) {
                    ingredientQuantity = currentRecipe.ingredients[i].quantity
                    if (ingredientQuantity?.split(' ')?.length === 2) {
                        fragmentAmount = parseFloat(ingredientQuantity.split(' ')[1].split('/')[0] / ingredientQuantity.split(' ')[1].split('/')[1])
                        numberToConvert = parseInt(ingredientQuantity.split(' ')[0]) + fragmentAmount
                    } else if (ingredientQuantity?.split('/').length === 2) {
                        numberToConvert = parseFloat(ingredientQuantity.split('/')[0] / ingredientQuantity.split('/')[1])
                    } else {
                        numberToConvert = parseInt(ingredientQuantity)
                    }
                    if (currentRecipe.ingredients[i].unit === 'tablespoon') {
                        finalIngredient = (numberToConvert * 14.8).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 14.8))
                    } else if (currentRecipe.ingredients[i].unit === 'teaspoon') {
                        finalIngredient = (numberToConvert * 4.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 4.9))
                    } else if (currentRecipe.ingredients[i].unit === 'ounce') {
                        finalIngredient = (numberToConvert * 29.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 29.6))
                    } else if (currentRecipe.ingredients[i].unit === 'fluid ounce') {
                        finalIngredient = (numberToConvert * 29.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 29.6))
                    } else if (currentRecipe.ingredients[i].unit === 'cup') {
                        finalIngredient = (numberToConvert * 236.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 236.6))
                    } else if (currentRecipe.ingredients[i].unit === 'quart') {
                        finalIngredient = (numberToConvert * 946.3).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 946.3))
                    } else if (currentRecipe.ingredients[i].unit === 'pint') {
                        finalIngredient = (numberToConvert * 473.2).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 473.2))
                    } else if (currentRecipe.ingredients[i].unit === 'gallon') {
                        finalIngredient = (numberToConvert * 3785.4).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 3785.4))
                    } else if (currentRecipe.ingredients[i].unit === 'pound') {
                        finalIngredient = (numberToConvert * 453.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'g of' : 'kg of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 453.6))
                    } else if (currentRecipe.ingredients[i].unit === 'dash') {
                        finalIngredient = (numberToConvert * 0.5).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.5))
                    } else if (currentRecipe.ingredients[i].unit === 'drop') {
                        finalIngredient = (numberToConvert * 0.05).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.05))
                    } else if (currentRecipe.ingredients[i].unit === 'smidgen') {
                        finalIngredient = (numberToConvert * 0.12).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.12))
                    } else if (currentRecipe.ingredients[i].unit === 'pinch') {
                        finalIngredient = (numberToConvert * 0.2).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.2))
                    } else if (currentRecipe.ingredients[i].unit === 'saltspoon') {
                        finalIngredient = (numberToConvert * 0.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.9))
                    } else if (currentRecipe.ingredients[i].unit === 'scruple') {
                        finalIngredient = (numberToConvert * 0.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.9))
                    } else if (currentRecipe.ingredients[i].unit === 'coffeespoon') {
                        finalIngredient = (numberToConvert * 1.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 1.9))
                    } else if (currentRecipe.ingredients[i].unit === 'fluid dram') {
                        finalIngredient = (numberToConvert * 3.7).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 3.7))
                    } else if (currentRecipe.ingredients[i].unit === 'dessertspoon') {
                        finalIngredient = (numberToConvert * 9.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 9.9))
                    } else if (currentRecipe.ingredients[i].unit === 'wineglass') {
                        finalIngredient = (numberToConvert * 59.1).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 59.1))
                    } else if (currentRecipe.ingredients[i].unit === 'gill') {
                        finalIngredient = (numberToConvert * 118.3).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 118.3))
                    } else if (currentRecipe.ingredients[i].unit === 'teacup') {
                        finalIngredient = (numberToConvert * 118.3).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml of' : 'l of'
                        if (finalIngredient > 1000) finalIngredient = (finalIngredient / 1000).toFixed(1)
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 118.3))
                    } else {
                        if (currentRecipe.ingredients[i].unit === 'whole unit' || !currentRecipe.ingredients[i].quantity || currentRecipe.ingredients[i].quantity === null) {
                            finalUnit = ''
                        } else if (numberToConvert === 1 || currentRecipe.ingredients[i].unit.split('')[currentRecipe.ingredients[i].unit.length - 1] === 's') {
                            finalUnit = `${currentRecipe.ingredients[i].unit} of`
                        } else if (numberToConvert !== 1) {
                            finalUnit = `${currentRecipe.ingredients[i].unit}s of`
                        }
                        finalIngredient = currentRecipe.ingredients[i].quantity ? currentRecipe.ingredients[i].quantity : ''
                    }
                    allIngredientElements.push((
                        <p className='ingredient' key={i}><span style={{ color: 'rgb(102, 35, 35)' }}>{finalIngredient}</span> {finalUnit} {currentRecipe.ingredients[i].ingredient}</p>
                    ))
                }
            }
            return allIngredientElements
        })
    }, [currentRecipe, unitType])

    const handleEditRecipe = () => {
        navigate(`/dash/myrecipes/${currentRecipe.searchField}/edit`)
    }

    try {

        const { name, category, preparation, pictures, cookingTime, servings } = currentRecipe

        var finalPreparation = []

        if (preparation.length > 1) {
            for (let i = 0; i < preparation.length; i++) {
                finalPreparation.push(
                    <div key={i} >
                        <p>{`Step ${i + 1}:`}</p>
                        <p>{preparation[i]}</p>
                    </div>
                )
            }
        } else {
            for (let i = 0; i < preparation[0].split('\n').length; i++) {
                finalPreparation.push(<p key={i}>{preparation[0].split('\n')[i]}</p>)
            }
        }

        var finalPics

        if (!pictures.length) {
            finalPics = [`../../Images/${category.toLowerCase()}.png`]
        } else {
            finalPics = pictures
        }

        const pictureElements = []

        for (let i = 0; i < finalPics.length; i++) {
            pictureElements.push((
                <div className="recipe-thumbnail" key={i}>
                    <img
                        key={i}
                        src={finalPics[i]}
                        alt=''
                    />
                </div>
            ))
        }

        var recipeAuthorElement

        //console.log(recipeAuthor)

        if (recipeAuthor?.data?.isTemporary === false) {
            recipeAuthorElement = (
                <Link to={`/user/${recipeAuthor.data.username}`}>{recipeAuthor.data.username}</Link>
            )
        } else {
            recipeAuthorElement = 'Anonymous'
        }

        var linearColor1
        var linearColor2

        switch (category) {
            case 'Breakfast':
                linearColor1 = 'rgba(131, 152, 192, 0.514)'
                linearColor2 = 'rgba(105, 68, 206, 0.514)'
                break
            case 'Lunch':
                linearColor1 = 'rgba(165, 223, 172, 0.315)'
                linearColor2 = 'rgba(37, 142, 163, 0.514)'
                break
            case 'Dinner':
                linearColor1 = 'rgba(190, 209, 161, 0.315)'
                linearColor2 = 'rgba(126, 34, 187, 0.514)'
                break
            case 'Appetizer':
                linearColor1 = 'rgba(226, 208, 173, 0.315)'
                linearColor2 = 'rgba(126, 16, 67, 0.514)'
                break
            case 'Salad':
                linearColor1 = 'rgba(155, 145, 126, 0.171)'
                linearColor2 = 'rgba(80, 27, 206, 0.514)'
                break
            case 'Main-course':
                linearColor1 = 'rgba(174, 211, 164, 0.171)'
                linearColor2 = 'rgba(15, 152, 170, 0.514)'
                break
            case 'Side-dish':
                linearColor1 = 'rgba(148, 216, 129, 0.171)'
                linearColor2 = 'rgba(8, 74, 150, 0.514)'
                break
            case 'Baked-goods':
                linearColor1 = 'rgba(87, 199, 130, 0.377)'
                linearColor2 = 'rgba(76, 17, 143, 0.637)'
                break
            case 'Dessert':
                linearColor1 = 'rgba(150, 199, 87, 0.377)'
                linearColor2 = 'rgba(112, 12, 104, 0.637)'
                break
            case 'Snack':
                linearColor1 = 'rgba(56, 151, 112, 0.377)'
                linearColor2 = 'rgba(17, 15, 160, 0.637)'
                break
            case 'Soup':
                linearColor1 = 'rgba(103, 75, 116, 0.158)'
                linearColor2 = 'rgba(9, 106, 109, 0.637)'
                break
            case 'Holiday':
                linearColor1 = 'rgba(199, 126, 195, 0.342)'
                linearColor2 = 'rgba(87, 31, 5, 0.637))'
                break
            case 'Vegetarian':
                linearColor1 = 'rgba(219, 136, 214, 0.342)'
                linearColor2 = 'rgba(58, 3, 3, 0.705)'
                break
            default:
                linearColor1 = 'rgba(179, 132, 132, 0.342)'
                linearColor2 = 'rgba(3, 85, 74, 0.705)'
                break
        }

        return (
            <div id="recipe-container" style={{ background: `linear-gradient(180deg, ${linearColor1}, ${linearColor2})` }}>
                <div id='name-edit'>
                    <h1 id='recipe-title'>{name}</h1>
                    <img
                        src='../../Images/pencil.png'
                        alt='pencil'
                        id='pencil-icon'
                        style={{ display: currentRecipe.createdBy === currentUser.data._id && isTemp === 'n' ? 'inline' : 'none' }}
                        onClick={handleEditRecipe}
                    />
                </div>
                <p id="recipe-category">{category}</p>
                <div id="time-servings-picture">
                    <div id='time-servings'>
                        <div id='recipe-cooking-time'>
                            <p className='recipe-label'>Cooking Time:</p>
                            <p id='cooking-time-label'>{cookingTime.length ? cookingTime : '--'}</p>
                        </div>
                        <div id='recipe-servings'>
                            <p className='recipe-label'>Servings:</p>
                            <p id='serving-label'>{servings ?? '--'}</p>
                        </div>
                    </div>
                    <div id='thumbnails-container'>
                        {pictureElements}
                    </div>
                </div>
                <p className='recipe-label'>{'Ingredients: '}</p>
                <select defaultValue='traditional' id="ingredient-units-type" onChange={(e) => {
                    setUnitType(() => {
                        return e.target.value
                    })
                }}>
                    <option value='traditional' name='traditional'>Traditional units</option>
                    <option value='metric' name='metric'>Metric units</option>
                </select>
                <div id='ingredients-container'>
                    {ingredientElements}
                </div>
                <p className='recipe-label'>{'Preparation: '}</p>
                <div id='instructions'>{finalPreparation}</div>
                <p id='author'>Posted by: {recipeAuthorElement}</p>
            </div>
        )

    } catch (err) {
        //console.log(err)
        return (
            <div style={{
                width: '100%',
                height: '1500px',
                display: 'grid',
                placeContent: 'center'
            }}>
                <img
                    src='../Images/favicon-gif.gif'
                    alt='icon'
                    style={{
                        marginTop: '-500px',
                        width: '200px',
                        filter: 'sepia(40%)'
                    }}
                />
            </div>
        )
    }
}

export default Recipe
