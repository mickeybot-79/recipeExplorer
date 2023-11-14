import { useEffect, useState } from "react"
import { useGetRecipeMutation } from '../../../features/recipes/recipesApiSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetUserWhoPostedMutation } from '../../../features/users/usersApiSlice'

const Recipe = ({ currentUser }) => {

    const isTemp = window.sessionStorage.getItem('isTemp')

    //const usrlng = window.localStorage.getItem('usrlng')

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
            if (response?.error?.originalStatus === 400 || response?.data === null) navigate('/es/recipe/404')
            window.localStorage.setItem('usrlng', 'es')
            const authorUser = await getUserWhoPosted({ userID: response?.data?.recipe?.createdBy })
            setCurrentRecipe(() => {
                return response.data.recipe
            })
            setRecipeAuthor(() => {
                return authorUser ?? ''
            })
        }
        fetchData()
    }, [id, getUserWhoPosted, getRecipe, navigate])

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
                    if (currentIngredient.unit === 'unidad entera' || !currentIngredient.quantity || currentIngredient.quantity === null) {
                        finalUnit = ''
                    } else if (parseInt(currentIngredient.quantity) === 1 || currentIngredient.unit.split('')[currentIngredient.unit.length - 1] === 's' || currentIngredient.unit !== 'ml' || currentIngredient.unit !== 'g') {
                        finalUnit = `${currentIngredient.unit} de`
                    } else if (parseInt(currentIngredient.quantity) !== 1) {
                        finalUnit = `${currentIngredient.unit}s de`
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
                    if (currentRecipe.ingredients[i].unit === 'cucharada de sopa') {
                        finalIngredient = (numberToConvert * 14.8).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 14.8))
                    } else if (currentRecipe.ingredients[i].unit === 'cucharada de té') {
                        finalIngredient = (numberToConvert * 4.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 4.9))
                    } else if (currentRecipe.ingredients[i].unit === 'onza') {
                        finalIngredient = (numberToConvert * 29.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 29.6))
                    } else if (currentRecipe.ingredients[i].unit === 'onza fluida') {
                        finalIngredient = (numberToConvert * 29.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 29.6))
                    } else if (currentRecipe.ingredients[i].unit === 'taza') {
                        finalIngredient = (numberToConvert * 236.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 236.6))
                    } else if (currentRecipe.ingredients[i].unit === 'cuarto de galón') {
                        finalIngredient = (numberToConvert * 946.3).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 946.3))
                    } else if (currentRecipe.ingredients[i].unit === 'pinta') {
                        finalIngredient = (numberToConvert * 473.2).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 473.2))
                    } else if (currentRecipe.ingredients[i].unit === 'galón') {
                        finalIngredient = (numberToConvert * 3785.4).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 3785.4))
                    } else if (currentRecipe.ingredients[i].unit === 'libra') {
                        finalIngredient = (numberToConvert * 453.6).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'g de' : 'kg de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 453.6))
                    } else if (currentRecipe.ingredients[i].unit === 'pizca') {
                        finalIngredient = (numberToConvert * 0.5).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.5))
                    } else if (currentRecipe.ingredients[i].unit === 'gota') {
                        finalIngredient = (numberToConvert * 0.05).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.05))
                    } else if (currentRecipe.ingredients[i].unit === 'cuchara de sal') {
                        finalIngredient = (numberToConvert * 0.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 0.9))
                    } else if (currentRecipe.ingredients[i].unit === 'cucharada de café') {
                        finalIngredient = (numberToConvert * 1.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 1.9))
                    } else if (currentRecipe.ingredients[i].unit === 'trago') {
                        finalIngredient = (numberToConvert * 3.7).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 3.7))
                    } else if (currentRecipe.ingredients[i].unit === 'cucharada de postre') {
                        finalIngredient = (numberToConvert * 9.9).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 9.9))
                    } else if (currentRecipe.ingredients[i].unit === 'copa de vino') {
                        finalIngredient = (numberToConvert * 59.1).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 59.1))
                    } else if (currentRecipe.ingredients[i].unit === 'cuarto de pinta') {
                        finalIngredient = (numberToConvert * 118.3).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 118.3))
                    } else if (currentRecipe.ingredients[i].unit === 'taza de té') {
                        finalIngredient = (numberToConvert * 118.3).toFixed(1)
                        finalUnit = finalIngredient < 1000 ? 'ml de' : 'l de'
                        if (finalIngredient.toString().split('.')[1] === '0') finalIngredient = Math.floor((numberToConvert * 118.3))
                    } else {
                        if (currentRecipe.ingredients[i].unit === 'unidad entera' || !currentRecipe.ingredients[i].quantity || currentRecipe.ingredients[i].quantity === null) {
                            finalUnit = ''
                        } else if (numberToConvert === 1 || currentRecipe.ingredients[i].unit.split('')[currentRecipe.ingredients[i].unit.length - 1] === 's' || currentRecipe.ingredients[i].unit !== 'ml' || currentRecipe.ingredients[i].unit !== 'g') {
                            finalUnit = `${currentRecipe.ingredients[i].unit} de`
                        } else if (numberToConvert !== 1) {
                            finalUnit = `${currentRecipe.ingredients[i].unit}s de`
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
        navigate(`/es/dash/myrecipes/${currentRecipe.searchField}/edit`)
    }

    try {

        const { name, category, preparation, pictures, cookingTime, servings } = currentRecipe

        var finalPreparation = []

        if (preparation.length > 1) {
            for (let i = 0; i < preparation.length; i++) {
                finalPreparation.push(
                    <div key={i} >
                        <p>{`Paso ${i + 1}:`}</p>
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
            var correctCategory
            switch (category) {
                case 'Desayuno':
                    correctCategory = ['../../../Images/breakfast.png']
                    break
                case 'Almuerzo':
                    correctCategory = ['../../../Images/lunch.png']
                    break
                case 'Cena':
                    correctCategory = ['../../../Images/dinner.png']
                    break
                case 'Aperitivo':
                    correctCategory = ['../../../Images/appetizer.png']
                    break
                case 'Ensalada':
                    correctCategory = ['../../../Images/salad.png']
                    break
                case 'Plato principal':
                    correctCategory = ['../../../Images/main-course.png']
                    break
                case 'Guarnición':
                    correctCategory = ['../../../Images/side-dish.png']
                    break
                case 'Horneados':
                    correctCategory = ['../../../Images/baked-goods.png']
                    break
                case 'Postres':
                    correctCategory = ['../../../Images/dessert.png']
                    break
                case 'Merienda':
                    correctCategory = ['../../../Images/snack.png']
                    break
                case 'Sopa':
                    correctCategory = ['../../../Images/soup.png']
                    break
                case 'Festivo':
                    correctCategory = ['../../../Images/holiday.png']
                    break
                case 'Vegetariano':
                    correctCategory = ['../../../Images/vegetarian.png']
                    break
                default:
                    correctCategory = ['../../../Images/other.png']
                    break
            }
            finalPics = correctCategory
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

        if (recipeAuthor?.data?.isTemporary === false) {
            recipeAuthorElement = (
                <Link to={`/es/user/${recipeAuthor.data.username}`}>{recipeAuthor.data.username}</Link>
            )
        } else {
            recipeAuthorElement = 'Anónimo'
        }

        var linearColor1
        var linearColor2

        switch (category) {
            case 'Desayuno':
                linearColor1 = 'rgba(131, 152, 192, 0.514)'
                linearColor2 = 'rgba(105, 68, 206, 0.514)'
                break
            case 'Almuerzo':
                linearColor1 = 'rgba(165, 223, 172, 0.315)'
                linearColor2 = 'rgba(37, 142, 163, 0.514)'
                break
            case 'Cena':
                linearColor1 = 'rgba(190, 209, 161, 0.315)'
                linearColor2 = 'rgba(126, 34, 187, 0.514)'
                break
            case 'Aperitivo':
                linearColor1 = 'rgba(226, 208, 173, 0.315)'
                linearColor2 = 'rgba(126, 16, 67, 0.514)'
                break
            case 'Ensalada':
                linearColor1 = 'rgba(155, 145, 126, 0.171)'
                linearColor2 = 'rgba(80, 27, 206, 0.514)'
                break
            case 'Plato principal':
                linearColor1 = 'rgba(174, 211, 164, 0.171)'
                linearColor2 = 'rgba(15, 152, 170, 0.514)'
                break
            case 'Guarnición':
                linearColor1 = 'rgba(148, 216, 129, 0.171)'
                linearColor2 = 'rgba(8, 74, 150, 0.514)'
                break
            case 'Horneados':
                linearColor1 = 'rgba(87, 199, 130, 0.377)'
                linearColor2 = 'rgba(76, 17, 143, 0.637)'
                break
            case 'Postres':
                linearColor1 = 'rgba(150, 199, 87, 0.377)'
                linearColor2 = 'rgba(112, 12, 104, 0.637)'
                break
            case 'Merienda':
                linearColor1 = 'rgba(56, 151, 112, 0.377)'
                linearColor2 = 'rgba(17, 15, 160, 0.637)'
                break
            case 'Sopa':
                linearColor1 = 'rgba(103, 75, 116, 0.158)'
                linearColor2 = 'rgba(9, 106, 109, 0.637)'
                break
            case 'Festivo':
                linearColor1 = 'rgba(199, 126, 195, 0.342)'
                linearColor2 = 'rgba(87, 31, 5, 0.637))'
                break
            case 'Vegetariano':
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
                            <p className='recipe-label'>Tiempo de preparación:</p>
                            <p id='cooking-time-label-es'>{cookingTime.length ? cookingTime : '--'}</p>
                        </div>
                        <div id='recipe-servings'>
                            <p className='recipe-label'>Porciones:</p>
                            <p id='serving-label'>{servings ?? '--'}</p>
                        </div>
                    </div>
                    <div id='thumbnails-container'>
                        {pictureElements}
                    </div>
                </div>
                <p className='recipe-label'>{'Ingredientes: '}</p>
                <select defaultValue='traditional' id="ingredient-units-type" onChange={(e) => {
                    setUnitType(() => {
                        return e.target.value
                    })
                }}>
                    <option value='traditional' name='traditional'>Unidades tradicionales</option>
                    <option value='metric' name='metric'>Unidades métricas</option>
                </select>
                <div id='ingredients-container'>
                    {ingredientElements}
                </div>
                <p className='recipe-label'>{'Preparación: '}</p>
                <div id='instructions'>{finalPreparation}</div>
                <p id='author'>Publicado por: {recipeAuthorElement}</p>
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
                    src='../../../Images/favicon-gif.gif'
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