import { useState, useEffect } from "react"
import { useAddNewRecipeMutation } from "./recipesApiSlice"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'
import { Prompt } from '../../hooks/useOnUnsaved'
import { useLogEntryMutation } from '../logs/logsApiSlice'
import { useAddUserRecipeMutation } from '../users/usersApiSlice'

const NewRecipePage = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const isTemp = window.sessionStorage.getItem('isTemp')

    const usrLng = window.localStorage.getItem('usrlng')

    const lgoff = window.localStorage.getItem('lgoff')

    const [logEntry] = useLogEntryMutation()

    const [addUserRecipe] = useAddUserRecipeMutation()

    let [isBlocking, setIsBlocking] = useState(false)

    const [recipeData, setRecipeData] = useState({
        name: '',
        category: '',
        ingredients: [
            {
                ingredient: '',
                quantity: '',
                unit: ''
            },
            {
                ingredient: '',
                quantity: '',
                unit: ''
            },
            {
                ingredient: '',
                quantity: '',
                unit: ''
            }
        ],
        preparation: '',
        cookingTime: '',
        servings: ''
    })

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    const [pictures, setPictures] = useState([])

    const [preparationStyle, setPreparationStyle] = useState('step-by-step')

    const [stepByStep, setStepByStep] = useState([
        {
            Step: 1,
            value: ''
        },
        {
            Step: 2,
            value: ''
        },
        {
            Step: 3,
            value: ''
        }
    ])

    const [displayMissing, setDisplayMissing] = useState('none')

    const [missingMessage, setMissingMessage] = useState()

    const [addNewRecipe, {
        data: recipe,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewRecipeMutation()

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
        setRecipeData((prevRecipeData) => {
            const updatedIngredients = [...prevRecipeData.ingredients]
            if (e.target.name === 'ingredient') {
                updatedIngredients[ingredientIndex].ingredient = e.target.value
            } else if (e.target.name === 'quantity') {
                updatedIngredients[ingredientIndex].quantity = e.target.value
            } else {
                updatedIngredients[ingredientIndex].unit = e.target.value
            }
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
        setIsBlocking(true)
        navigate('/')
    }

    //var username = token && !jwtDecode(token).UserInfo.isTemporary ? jwtDecode(token).UserInfo.username : ''

    async function handleSubmit(event) {
        setIsBlocking(false)
        event.preventDefault()
        //console.log(recipeData)

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
            finalPreparation[0] = recipeData.preparation
        }

        var finalIngredients = []

        for (let i = 0; i < recipeData.ingredients.length; i++) {
            if (recipeData.ingredients[i].ingredient !== '') {
                finalIngredients.push(recipeData.ingredients[i])
            }
        }

        var finalPictures

        if (pictures.length) {
            finalPictures = [...pictures]
        } else {
            finalPictures = [`../../Images/${recipeData.category.toLowerCase()}.png`]
        }

        const finalData = {
            name: recipeData.name,
            category: recipeData.category,
            cookingTime: recipeData.cookingTime,
            servings: recipeData.servings,
            ingredients: finalIngredients,
            preparation: finalPreparation,
            pictures: finalPictures,
            user: userID,
            lng: usrLng,
            searchField: recipeData.name.toLowerCase().replace(' ', '-')
        }

        const canSave = [recipeData.name, recipeData.category, recipeData.ingredients[0].ingredient, finalPreparation.length].every(Boolean) && !isLoading

        if (canSave) {
            try {
                const result = await addNewRecipe(finalData)
                if (isTemp === 'n' && lgoff === 'n') logEntry({ activity: 'newRecipe', recipeID: result.data._id, userID: userID })
                await addUserRecipe({userID: userID, recipeID: result.data._id})
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
        } else if (finalPreparation.length === 0) {
            setMissingMessage(() => {
                return 'Preparation is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        }
    }

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

            if (stepIndex > 2) {
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
                <h1 id="new-recipe-title">New Recipe</h1>
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
                            <label className="new-recipe-form-input">Upload a picture <span style={{fontSize: '20px'}}>(optional)</span>:</label>
                            <input
                                type="file"
                                onChange={handleNewPicture}
                                id="new-recipe-pictures"
                                value={''}
                            />
                        </div>
                        <div id="pictures-preview">
                            {pictureElements}
                        </div>
                    </div>
                    <div id="new-recipe-buttons">
                        <div id="post-recipe-cancel" onClick={handleCancel}>Cancel</div>
                        <button id="post-recipe-submit">Publish recipe</button>
                    </div>
                </form>
                <div id='missing-recipe-data' style={{ display: displayMissing }}>
                    <div id='missing-data-container'>
                        <p id="missing-message">{missingMessage}</p>
                        <button type='button' id='ok-missing' onClick={() => setDisplayMissing(() => {
                            setIsBlocking(true)
                            return 'none'
                        })}>Ok</button>
                    </div>
                </div>
            </div>
            <Prompt
                when={isBlocking}
                message="Would you like to exit without saving?"
                beforeUnload={true}
            />
        </>
    )
}

export default NewRecipePage