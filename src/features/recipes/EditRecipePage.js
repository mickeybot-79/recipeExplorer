import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'
import { useUpdateRecipeDataMutation, useGetRecipeMutation, useDeleteRecipeMutation } from "./recipesApiSlice"
import { useRemoveUserRecipeMutation } from '../users/usersApiSlice'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Prompt } from '../../hooks/useOnUnsaved'
import { useRemoveRecipeLogsMutation } from '../logs/logsApiSlice'
import LoadingIcon from "../../components/LoadingIcon"

const EditRecipePage = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng')

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
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

    const [displayLoading, setDisplayLoading] = useState('none')

    const { id } = useParams()

    useEffect(() => {
        const fetchRecipe = async () => {
            const currentRecipe = await getRecipe({ id: id, commentsSlice: 10 })
            if (currentRecipe.data.recipe.createdBy !== userID) { // blocks non-owners from editing recipe.
                navigate('/login')
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
    }, [getRecipe, id, userName, navigate, userID])

    useEffect(() => {
        if (isSuccess) {
            setRecipeData({
                name: '',
                category: '',
                ingredients: [],
                preparation: ''
            })
            navigate(`/recipes/${recipe.searchField}`)
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
        navigate(`/recipes/${id}`)
    }

    const handleDeleteRecipe = async () => {
        setDisplayLoading('grid')
        await deleteRecipe({ id: recipeData.id, userID: userID })
        await removeUserRecipe({ recipeID: recipeData.id, userID: userName })
        await removeRecipeLogs({ recipeID: recipeData.id })
        window.sessionStorage.setItem('deleted', 'y')
        setDisplayLoading('none')
        navigate('/dash/myrecipes/deleted')
    }

    async function handleSubmit(event) {
        setIsBlocking(false)
        setDisplayLoading('grid')
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
            finalPictures = [`../../Images/${recipeData.category}.png`]
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
                return 'Recipe name is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (!recipeData.category) {
            setMissingMessage(() => {
                return 'Category is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (recipeData.ingredients[0].ingredient === '') {
            setMissingMessage(() => {
                return 'At least one ingredient is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (finalPreparation[0].length === 0) {
            setMissingMessage(() => {
                return 'Preparation is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        }
        setDisplayLoading('none')
    }

    //console.log(recipeData)

    try {

        // Elements

        const categories = [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Appetizer',
            'Salad',
            'Main-course',
            'Side-dish',
            'Baked-goods',
            'Dessert',
            'Snack',
            'Soup',
            'Holiday',
            'Vegetarian',
            'Other'
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

            const recipeImg = pictures[i].split('/')[0] === '..' ? `../../../${pictures[i]}` : pictures[i]

            pictureElements.push((
                <div className="image-thumbnail" key={i}>
                    <img
                        src={recipeImg}
                        //src='../../../../../../Images/Recipes/banana cake.jpg'
                        alt=''
                    />
                    <div className="X-container">
                        <p onClick={listener}>✖</p>
                    </div>
                </div>
            ))
        }

        const units = [
            'whole unit',
            'tablespoon',
            'teaspoon',
            'ounce',
            'fluid ounce',
            'cup',
            'quart',
            'pint',
            'gallon',
            'pound',
            'dash',
            'drop',
            'smidgen',
            'pinch',
            'saltspoon',
            'scruple',
            'coffeespoon',
            'fluid dram',
            'dessertspoon',
            'wineglass',
            'gill',
            'teacup',
            'milliliter',
            'grams',
            'kilogram',
            'liter'
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
                        placeholder={`Ingredient ${recipeData.ingredients.indexOf(ingredient) + 1}`}
                        onChange={(e) => handleIngredient(e, recipeData.ingredients.indexOf(ingredient))}
                        name='ingredient'
                        value={ingredient.ingredient}
                        className="new-recipe-ingredient"
                    />
                    <input
                        type='text'
                        placeholder="Amount"
                        onChange={(e) => handleIngredient(e, recipeData.ingredients.indexOf(ingredient))}
                        name='quantity'
                        value={ingredient.quantity}
                        className="quantity"
                    />
                    <label>Unit:</label>
                    <select
                        className="ingredient-unit"
                        value={ingredient.unit}
                        name='unit'
                        onChange={(e) => handleIngredient(e, recipeData.ingredients.indexOf(ingredient))}
                    >
                        <option value="" disabled hidden id='hidden' readOnly>Please select</option>
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
                        <label>{`Step ${stepByStep.indexOf(step) + 1}:`}</label>
                        <textarea
                            placeholder={`Step ${stepByStep.indexOf(step) + 1} here`}
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
                    <h1 id="new-recipe-title">Edit Recipe</h1>
                    <p className={errClass}>{error?.data?.message}</p>
                    <form onSubmit={handleSubmit} id="new-recipe-form">
                        <label className="new-recipe-form-input">Recipe's name:</label>
                        <input
                            type='text'
                            placeholder="Your recipe's name"
                            onChange={handleChange}
                            name='name'
                            value={recipeData.name}
                            id="new-recipe-name"
                        />
                        <div id="category-time-container">
                            <div id="category-container">
                                <label className="new-recipe-form-input">Category:</label>
                                <select
                                    id='new-recipe-category'
                                    value={recipeData.category}
                                    name='category'
                                    onChange={handleChange}
                                >
                                    <option value="" disabled hidden id='hidden' readOnly>Please select</option>
                                    {options}
                                </select>
                            </div>
                            <div id="cooking-time-container">
                                <label className="new-recipe-form-input">Cooking time:</label>
                                <input
                                    type="text"
                                    id="cooking-time"
                                    name="cookingTime"
                                    onChange={handleChange}
                                    placeholder="eg: 1 hour"
                                    value={recipeData.cookingTime}
                                />
                            </div>
                            <div id="servings-container">
                                <label className="new-recipe-form-input">Servings:</label>
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
                        <label className="new-recipe-form-input">Ingredients:</label>
                        <div id="new-ingredients-container">
                            {ingredientElements}
                        </div>
                        <button type="button" onClick={addIngredient} id="add-ingredient">Add ingredient</button>
                        <label className="new-recipe-form-input">Preparation:</label>
                        <select
                            id='new-recipe-preparation-style'
                            value={preparationStyle}
                            name='category'
                            onChange={(e) => handlePreparationStyle(e)}
                        >
                            <option
                                value='step-by-step'
                            >Step by step
                            </option >
                            <option
                                value='free-writing'
                            >Free writing
                            </option >
                        </select>

                        <textarea
                            placeholder='Preparation'
                            onChange={handlePreparationChange}
                            name='preparation'
                            value={recipeData.preparation}
                            id="new-recipe-preparation"
                            style={{ display: preparationStyle === 'free-writing' ? 'block' : 'none' }}
                        />

                        <div id="step-by-step-container" style={{ display: preparationStyle === 'step-by-step' ? 'grid' : 'none' }}>
                            {preparationElements}
                            <button type="button" onClick={addPreparationStep} id="add-step">Add step</button>
                        </div>

                        <div id="pictures-container">
                            <div id="pictures-input">
                                <label className="new-recipe-form-input">Upload a picture:</label>
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
                            <div id="new-recipe-cancel" onClick={handleCancel}>Cancel</div>
                            <div id="new-recipe-delete" onClick={() => setDisplayDelete(() => {
                                return 'grid'
                            })}>Delete Recipe</div>
                            <button id="new-recipe-submit">Update recipe</button>
                        </div>
                    </form>
                    <div id='recipe-delete-confirmation' style={{ display: displayDelete }}>
                        <div id='recipe-delete-container'>
                            <p>Delete recipe?</p>
                            <p>This action cannot be reversed</p>
                            <div id='delete-recipe-buttons'>
                                <button type='button' id='cancel-recipe' onClick={() => setDisplayDelete(() => {
                                    return 'none'
                                })}>Cancel</button>
                                <button type='button' id='delete-recipe' onClick={handleDeleteRecipe}>Delete</button>
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
                    <div id='edit-recipe-loading' style={{ display: displayLoading }}>
                        <div className="lds-dual-ring" style={{padding: '100px', width: '300px', height: '300px'}}></div>
                    </div>
                </div>
                <Prompt
                    when={isBlocking}
                    message="Would you like to exit without saving?"
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