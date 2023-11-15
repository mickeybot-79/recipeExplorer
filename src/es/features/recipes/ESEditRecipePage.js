import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import jwtDecode from 'jwt-decode'
import { useUpdateRecipeDataMutation, useGetRecipeMutation, useDeleteRecipeMutation } from '../../../features/recipes/recipesApiSlice'
import { useRemoveUserRecipeMutation } from '../../../features/users/usersApiSlice'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Prompt } from '../../../hooks/useOnUnsaved'
import { useRemoveRecipeLogsMutation } from '../../../features/logs/logsApiSlice'
import LoadingIcon from "../../../components/LoadingIcon"

const EditRecipePage = () => {

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
    var userName = token ? jwtDecode(token).UserInfo.username : window.localStorage.getItem('temp-id')

    const userID = token ? jwtDecode(token).UserInfo.id : ''

    const [updateRecipeData, {
        data: recipe,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateRecipeDataMutation()

    const [getRecipe] = useGetRecipeMutation()

    const [deleteRecipe] = useDeleteRecipeMutation()

    const [removeUserRecipe] = useRemoveUserRecipeMutation()

    const [removeRecipeLogs] = useRemoveRecipeLogsMutation()

    let [isBlocking, setIsBlocking] = useState(false)

    const [recipeData, setRecipeData] = useState({
        name: '',
        category: '',
        ingredients: [],
        preparation: '',
        cookingTime: '',
        servings: '',
        id: ''
    })

    const [pictures, setPictures] = useState([])

    const [preparationStyle, setPreparationStyle] = useState('')

    const [stepByStep, setStepByStep] = useState([])

    const [displayDelete, setDisplayDelete] = useState('none')

    const [displayMissing, setDisplayMissing] = useState('none')

    const [missingMessage, setMissingMessage] = useState()

    const { id } = useParams()

    useEffect(() => {
        const fetchRecipe = async () => {
            const currentRecipe = await getRecipe({ id: id, commentsSlice: 10 })
            //console.log(currentRecipe.data.recipe._id)
            const isTemp = window.sessionStorage.getItem('isTemp')
            if (currentRecipe.data.recipe.createdBy !== userID) { // blocks non-owners from editing recipe.
                if (isTemp === 'n') {
                    navigate('/es/dash')
                } else {
                    navigate('/es/login')
                }
            } else {
                setRecipeData(() => {
                    return {
                        name: currentRecipe.data.recipe.name,
                        category: currentRecipe.data.recipe.category,
                        ingredients: currentRecipe.data.recipe.ingredients,
                        preparation: currentRecipe.data.recipe.preparation,
                        cookingTime: currentRecipe.data.recipe.cookingTime,
                        servings: currentRecipe.data.recipe.servings,
                        id: currentRecipe.data.recipe._id
                    }
                })
                setPictures(() => {
                    return currentRecipe.data.recipe.pictures
                })
                setPreparationStyle(() => {
                    const prepStyle = currentRecipe.data.recipe.preparation.length > 1 ? 'step-by-step' : 'free-writing'
                    return prepStyle
                })
                setStepByStep(() => {
                    const finalSteps = []
                    for (let i = 0; i < currentRecipe.data.recipe.preparation.length; i++) {
                        finalSteps.push({ Step: i + 1, value: currentRecipe.data.recipe.preparation[i] })
                    }
                    return finalSteps
                })
            }
        }
        fetchRecipe()
    }, [getRecipe, id, userID, navigate])

    useEffect(() => {
        if (isSuccess) {
            setRecipeData({
                name: '',
                category: '',
                ingredients: [],
                preparation: ''
            })
            navigate(`/es/recipes/${recipe.searchField}`)
        }
    }, [isSuccess, navigate, recipe])

    // Listeners

    function handleChange(event) {
        const { name, value } = event.target
        setRecipeData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
        if (value !== '') {
            setIsBlocking(true)
        } else {
            setIsBlocking(false)
        }
    }

    function handleNewPicture(e) {
        if (pictures.length < 1) {
            var reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                const updatedPictures = pictures
                updatedPictures.push(reader.result)
                setPictures(() => {
                    return [...updatedPictures]
                })
            }
            reader.onerror = (error) => {
                console.log('Error: ', error)
            }
            setIsBlocking(true)
        }
    }

    const handleIngredient = (e, ingredientIndex) => {
        const updatedIngredients = [...recipeData.ingredients]
        if (e.target.name === 'ingredient') {
            const updatedIngredient = {
                ingredient: e.target.value,
                quantity: updatedIngredients[ingredientIndex].quantity,
                unit: updatedIngredients[ingredientIndex].unit
            }
            updatedIngredients.splice(ingredientIndex, 1, updatedIngredient)
        } else if (e.target.name === 'quantity') {
            const updatedQuantity = {
                ingredient: updatedIngredients[ingredientIndex].ingredient,
                quantity: e.target.value,
                unit: updatedIngredients[ingredientIndex].unit
            }
            updatedIngredients.splice(ingredientIndex, 1, updatedQuantity)
        } else {
            const updatedUnit = {
                ingredient: updatedIngredients[ingredientIndex].ingredient,
                quantity: updatedIngredients[ingredientIndex].quantity,
                unit: e.target.value
            }
            updatedIngredients.splice(ingredientIndex, 1, updatedUnit)
        }
        setRecipeData((prevRecipeData) => {
            return {
                ...prevRecipeData,
                ingredients: updatedIngredients
            }
        })
    }

    const removeIngredient = (ingredientIndex) => {
        setRecipeData((prevState) => {
            const updatedIngredients = [...prevState.ingredients]
            updatedIngredients.splice(ingredientIndex, 1)
            return {
                ...prevState,
                ingredients: updatedIngredients
            }
        })
    }

    const addIngredient = () => {
        setRecipeData((prevRecipeData) => {
            const updatedIngredients = [...prevRecipeData.ingredients]
            updatedIngredients.push({
                ingredient: '',
                quantity: '',
                unit: ''
            })
            return {
                ...prevRecipeData,
                ingredients: updatedIngredients
            }
        })
    }

    const handlePreparationStyle = (e) => {
        setPreparationStyle(() => {
            return e.target.value
        })
    }

    const handlePreparationChange = (e, stepIndex) => {
        if (preparationStyle === 'step-by-step') {
            setStepByStep((prevState) => {
                const updatedPreparation = [...prevState]
                updatedPreparation[stepIndex].value = e.target.value
                return updatedPreparation
            })
        } else {
            setRecipeData((prevState) => {
                return {
                    ...prevState,
                    preparation: e.target.value
                }
            })
        }
    }

    const addPreparationStep = () => {
        setStepByStep((prevState) => {
            const updatedSteps = [...prevState]
            updatedSteps.push({
                Step: updatedSteps.length + 1,
                value: ''
            })
            return updatedSteps
        })
    }

    const removeStep = (stepIndex) => {
        setStepByStep(() => {
            const updatedSteps = [...stepByStep]
            updatedSteps.splice(stepIndex, 1)
            return updatedSteps
        })
    }

    const handleCancel = () => {
        navigate(`/es/recipes/${id}`)
    }

    const handleDeleteRecipe = async () => {
        await deleteRecipe({ id: recipeData.id, userID: userID })
        await removeUserRecipe({ recipeID: recipeData.id, userID: userName })
        await removeRecipeLogs({ recipeID: recipeData.id })
        window.sessionStorage.setItem('deleted', 'y')
        navigate('/es/dash/myrecipes/deleted')
        //navigate to confirmation screen
    }

    async function handleSubmit(event) {
        setIsBlocking(false)
        event.preventDefault()

        var finalPreparation = []

        if (preparationStyle === 'step-by-step') {
            let preparationArray = []
            for (let i = 0; i < stepByStep.length; i++) {
                if (stepByStep[i].value !== '') {
                    preparationArray.push(stepByStep[i].value)
                }
            }
            finalPreparation = preparationArray
        } else {
            finalPreparation = recipeData.preparation
        }

        var finalPictures

        if (pictures.length) {
            finalPictures = [...pictures]
        } else {
            var correctCategory
            switch (recipeData.category) {
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
            finalPictures = correctCategory
        }

        const finalData = {
            id: recipeData.id,
            name: recipeData.name,
            category: recipeData.category,
            cookingTime: recipeData.cookingTime,
            servings: recipeData.servings,
            ingredients: recipeData.ingredients,
            preparation: finalPreparation,
            pictures: finalPictures
        }

        const canSave = [recipeData.name, recipeData.category, recipeData.ingredients[0].ingredient, finalPreparation[0].length].every(Boolean) && !isLoading

        if (canSave) {
            try {
                await updateRecipeData(finalData)
            } catch (err) {
                console.error(err)
                setIsBlocking(true)
            }
        } else if (!recipeData.name) {
            setMissingMessage(() => {
                return 'La receta necesita un nombre'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (!recipeData.category) {
            setMissingMessage(() => {
                return 'Selecciona una categoría'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (recipeData.ingredients[0].ingredient === '') {
            setMissingMessage(() => {
                return 'Agrega al menos un ingrediente'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (finalPreparation[0].length === 0) {
            setMissingMessage(() => {
                return 'La receta necesita preparación'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        }
    }

    //console.log(recipeData)

    try {

        // Elements

        const categories = [
            'Desayuno',
            'Almuerzo',
            'Cena',
            'Aperitivo',
            'Ensalada',
            'Plato principal',
            'Guarnición',
            'Horneados',
            'Postres',
            'Merienda',
            'Sopa',
            'Festivo',
            'Vegetariano',
            'Otros'
        ]

        const options = categories.map(category => {
            return (
                <option
                    key={category}
                    value={category}
                >{category}
                </option >
            )
        })

        const pictureElements = []

        for (let i = 0; i < pictures.length; i++) {

            const listener = () => {
                setPictures((prevPictures) => {
                    const newPictures = []
                    for (let j = 0; j < prevPictures.length; j++) {
                        if (prevPictures[j] !== pictures[i]) {
                            newPictures.push(prevPictures[j])
                        }
                    }
                    return [...newPictures]
                })
            }

            pictureElements.push((
                <div className="image-thumbnail" key={i}>
                    <img
                        key={i}
                        src={pictures[i]}
                        alt=''
                    />
                    <div className="X-container">
                        <p
                            key={i + 1}
                            onClick={listener}
                        >✖</p>
                    </div>
                </div>
            ))
        }

        const units = [
            'unidad entera',
            'cucharada de sopa',
            'cucharada de té',
            'onza',
            'onza fluida',
            'taza',
            'cuarto de galón',
            'pinta',
            'galón',
            'libra',
            'pizca',
            'gota',
            'cuchara de sal',
            'cucharada de café',
            'chorro',
            'cucharada de postre',
            'copa de vino',
            'cuarto de pinta',
            'taza de té',
            'mililitro',
            'gramo',
            'kilogramo',
            'litro'
        ]

        const UnitOptions = units.map(unit => {
            return (
                <option
                    key={unit}
                    value={unit}
                >{unit}
                </option >
            )
        })

        const ingredientElements = recipeData.ingredients.map(ingredient => {

            const ingredientIndex = recipeData.ingredients.indexOf(ingredient)

            var excludeElement

            if (ingredientIndex > 0) {
                excludeElement = (
                    <p
                        className="exclude-ingredient"
                        onClick={() => removeIngredient(ingredientIndex)}
                    >✖</p>
                )
            }

            return (
                <div key={recipeData.ingredients.indexOf(ingredient)} className="ingredient-container">
                    <input
                        type='text'
                        placeholder={`Ingrediente ${recipeData.ingredients.indexOf(ingredient) + 1}`}
                        onChange={(e) => handleIngredient(e, recipeData.ingredients.indexOf(ingredient))}
                        name='ingredient'
                        value={ingredient.ingredient}
                        className="new-recipe-ingredient"
                    />
                    <input
                        type='text'
                        placeholder="Cantidad"
                        onChange={(e) => handleIngredient(e, recipeData.ingredients.indexOf(ingredient))}
                        name='quantity'
                        value={ingredient.quantity}
                        className="quantity"
                    />
                    <label>Unid.:</label>
                    <select
                        className="ingredient-unit"
                        value={ingredient.unit}
                        name='unit'
                        onChange={(e) => handleIngredient(e, recipeData.ingredients.indexOf(ingredient))}
                    >
                        <option value="" disabled hidden id='hidden' readOnly>Selecciona una opción</option>
                        {UnitOptions}
                    </select>
                    {excludeElement}
                </div>
            )
        })

        var preparationElements

        if (preparationStyle === 'step-by-step') {

            preparationElements = stepByStep.map(step => {

                const stepIndex = stepByStep.indexOf(step)

                var excludeStep

                if (stepIndex > 0) {
                    excludeStep = (
                        <p
                            className="exclude-step"
                            onClick={() => removeStep(stepIndex)}
                        >✖</p>
                    )
                }


                return (
                    <div className="step-container" key={step.Step}>
                        <label>{`Paso ${stepByStep.indexOf(step) + 1}:`}</label>
                        <textarea
                            placeholder={`Paso ${stepByStep.indexOf(step) + 1} aquí`}
                            onChange={(e) => handlePreparationChange(e, stepByStep.indexOf(step))}
                            name={`step-${stepByStep.indexOf(step) + 1}`}
                            value={step.value}
                            className="step"
                        />
                        {excludeStep}
                    </div>
                )
            })
        }

        const errClass = isError ? "errmsg" : "offscreen"

        return (
            <>
                <div id="new-recipe-container">
                    <h1 id="new-recipe-title">Editar Receta</h1>
                    <p className={errClass}>{error?.data?.message}</p>
                    <form onSubmit={handleSubmit} id="new-recipe-form">
                        <label className="new-recipe-form-input">Nombre de la receta:</label>
                        <input
                            type='text'
                            placeholder="Nombre de tu receta"
                            onChange={handleChange}
                            name='name'
                            value={recipeData.name}
                            id="new-recipe-name"
                        />
                        <div id="category-time-container">
                            <div id="category-container">
                                <label className="new-recipe-form-input" id="categoria">Categoría:</label>
                                <select
                                    id='new-recipe-category'
                                    value={recipeData.category}
                                    name='category'
                                    onChange={handleChange}
                                >
                                    <option value="" disabled hidden id='hidden' readOnly>Selecciona una opción</option>
                                    {options}
                                </select>
                            </div>
                            <div id="cooking-time-container">
                                <label className="new-recipe-form-input" id="cooking-time-es">Tiempo de preparación:</label>
                                <input
                                    type="text"
                                    id="cooking-time-input-es"
                                    name="cookingTime"
                                    onChange={handleChange}
                                    placeholder="ej.: 1 hora"
                                    value={recipeData.cookingTime}
                                />
                            </div>
                            <div id="servings-container">
                                <label className="new-recipe-form-input" id="porciones">Porciones:</label>
                                <input
                                    type="text"
                                    id="servings"
                                    name="servings"
                                    onChange={handleChange}
                                    placeholder="Servings"
                                    value={recipeData.servings}
                                />
                            </div>
                        </div>
                        <label className="new-recipe-form-input">Ingredientes:</label>
                        <div id="new-ingredients-container">
                            {ingredientElements}
                        </div>
                        <button type="button" onClick={addIngredient} id="add-ingredient">Agregar ingrediente</button>
                        <label className="new-recipe-form-input">Preparación:</label>
                        <select
                            id='new-recipe-preparation-style'
                            value={preparationStyle}
                            name='category'
                            onChange={(e) => handlePreparationStyle(e)}
                        >
                            <option
                                value='step-by-step'
                            >Paso a paso
                            </option >
                            <option
                                value='free-writing'
                            >Escritura libre
                            </option >
                        </select>

                        <textarea
                            placeholder='Preparación'
                            onChange={handlePreparationChange}
                            name='preparation'
                            value={recipeData.preparation}
                            id="new-recipe-preparation"
                            style={{ display: preparationStyle === 'free-writing' ? 'block' : 'none' }}
                        />

                        <div id="step-by-step-container" style={{ display: preparationStyle === 'step-by-step' ? 'grid' : 'none' }}>
                            {preparationElements}
                            <button type="button" onClick={addPreparationStep} id="add-step">Agregar paso</button>
                        </div>

                        <div id="pictures-container">
                            <div id="pictures-input">
                                <label className="new-recipe-form-input">Sube una imagen:</label>
                                <input
                                    type="file"
                                    onChange={handleNewPicture}
                                    id="new-recipe-pictures"
                                />
                            </div>
                            <div id="pictures-preview">
                                {pictureElements}
                            </div>
                        </div>
                        <div id="edit-recipe-buttons">
                            <div id="new-recipe-cancel-es" onClick={handleCancel}>Cancelar</div>
                            <div id="new-recipe-delete-es" onClick={() => setDisplayDelete(() => {
                                return 'grid'
                            })}>Eliminar Receta</div>
                            <button id="new-recipe-submit">Actualizar receta</button>
                        </div>
                    </form>
                    <div id='recipe-delete-confirmation' style={{ display: displayDelete }}>
                        <div id='recipe-delete-container'>
                            <p>¿Eliminar receta?</p>
                            <p>Esta acción no puede revertirse</p>
                            <div id='delete-recipe-buttons'>
                                <button type='button' id='cancel-recipe' onClick={() => setDisplayDelete(() => {
                                    return 'none'
                                })}>Cancelar</button>
                                <button type='button' id='delete-recipe' onClick={handleDeleteRecipe}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                    <div id='missing-recipe-data' style={{ display: displayMissing }}>
                        <div id='missing-data-container'>
                            <p id="missing-message">{missingMessage}</p>
                            <button type='button' id='ok-missing' onClick={() => setDisplayMissing(() => {
                                return 'none'
                            })}>Ok</button>
                        </div>
                    </div>
                </div>
                <Prompt
                    when={isBlocking}
                    message="¿Deseas salir sin guardar?"
                    beforeUnload={true}
                />
            </>
        )

    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc='../../Images/favicon-gif.gif'/>
        )
    }
}

export default EditRecipePage