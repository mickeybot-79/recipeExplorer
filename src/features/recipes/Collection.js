import { useEffect, useRef, useState } from "react"
//import { useGetRecipesDataMutation } from '../recipes/recipesApiSlice'
import { useNavigate } from "react-router-dom"
import { useRemoveFromCollectionMutation, useDeleteCollectionMutation, useUpdateCollectionMutation } from '../users/usersApiSlice'

const Collection = ({ selectedCollection, setSelectedCollection, shrinkAnimation, closeCollection, userID }) => {

    const imageRef = useRef()

    const navigate = useNavigate()

    const [removeFromCollection] = useRemoveFromCollectionMutation()

    const [deleteCollection] = useDeleteCollectionMutation()

    const [updateCollection] = useUpdateCollectionMutation()

    const [recipesToRemove, setRecipesToRemove] = useState([])

    const [displayRemoveConfirm, setDisplayRemoveConfirm] = useState('none')

    const [displayCollectionEdit, setDisplayCollectionEdit] = useState('none')

    const [editCollectionData, setEditCollectionData] = useState({
        name: '',
        image: ''
    })

    const [displayLimit, setDisplayLimit] = useState({
        display: 'none',
        animation: '',
        message: ''
    })

    const [editAnimation, setEditAnimation] = useState()

    const [displayConfirmDelete, setDisplayConfirmDelete] = useState({
        display: 'none',
        animation: ''
    })

    const [recipeElements, setRecipeElements] = useState()

    const [edited, setEdited] = useState(false)

    useEffect(() => {
        //console.log(selectedCollection)
        if (selectedCollection?.recipes?.data?.length && edited === false) {
            setRecipeElements(() => {
                const allElements = selectedCollection.recipes.data.map(recipe => {
    
                    return (
                        <div className="collection-recipe" key={recipe._id}>
                            <img src={`${recipe.pictures[0]}`} alt="" className="collection-recipe-image" />
                            <div className="collection-recipe-name-view">
                                <h5>{recipe.name}</h5>
                                <p onClick={() => navigate(`/recipes/${recipe.searchField}`)}>View Recipe ➜</p>
                            </div>
                            <p onClick={(e) => {
                                if (e.target.parentElement.classList.contains('remove-recipe')) {
                                    e.target.parentElement.classList.remove('remove-recipe')
                                } else {
                                    e.target.parentElement.classList.add('remove-recipe')
                                }
                                if (!recipesToRemove.includes(recipe._id)) {
                                    setRecipesToRemove((prevState) => {
                                        const updatedArray = [...prevState, recipe._id]
                                        return updatedArray
                                    })
                                } else {
                                    if (recipesToRemove.length === 1) {
                                        setRecipesToRemove(() => {
                                            return []
                                        })
                                    } else {
                                        setRecipesToRemove((prevState) => {
                                            let updatedArray = [...prevState]
                                            const recipeIndex = updatedArray.indexOf(recipe._id)
                                            updatedArray.splice(recipeIndex, 1)
                                            return updatedArray
                                        })
                                    }
                                }
                            }} className="collection-recipe-remove">Remove recipe</p>
                        </div>
                    )
                })
                return allElements
            })
            setEdited(true) 
        }
    }, [selectedCollection, navigate, recipesToRemove, edited])

    useEffect(() => {
        //console.log(selectedCollection)
        setEditCollectionData(() => {
            return {
                name: selectedCollection.name,
                image: selectedCollection.image
            }
        })
    }, [selectedCollection])

    const handleSaveCollection = () => {
        setDisplayRemoveConfirm(() => {
            const newDisplay = recipesToRemove.length ? 'grid' : 'none'
            return newDisplay
        })
        if (!recipesToRemove.length) closeCollection()
    }

    const handleChange = (e) => {
        setEditCollectionData((prevState) => {
            return {
                ...prevState,
                name: e.target.value
            }
        })
    }

    const handleDeleteCollection = async () => {
        await deleteCollection({ userID: userID, collectionIndex: selectedCollection.collectionIndex })
    }

    const handleUpdateCollection = async () => {
        if (!editCollectionData.name) {
            setDisplayLimit(() => {
                return {
                    display: 'grid',
                    animation: 'new-collection-in 0.2s linear 1',
                    message: 'Collection name is needed'
                }
            })
        } else {
            await updateCollection({ userID: userID, collectionIndex: selectedCollection.collectionIndex, name: editCollectionData.name, image: editCollectionData.image })
            setEditAnimation(() => {
                return 'new-collection-out 0.2s linear 1'
            })
            setTimeout(() => {
                setDisplayCollectionEdit(() => {
                    return 'none'
                })
                closeCollection()
            }, 150)
        }
    }

    const handleNewImage = (e) => {
        imageRef.current.classList.remove('selected-image')
        imageRef.current = e.target
        e.target.classList.add('selected-image')
        setEditCollectionData((prevState) => {
            return {
                ...prevState,
                image: `${e.target.name}.png`
            }
        })
    }

    const handleDoRemove = () => {
        removeFromCollection({ recipes: recipesToRemove, userID: userID, collectionIndex: selectedCollection.collectionIndex })
        setRecipeElements((prevState) => {
            const updatedRecipeElements = []
            for (let i = 0; i < prevState.length; i++) {
                if (!recipesToRemove.includes(prevState[i].key)) {
                    updatedRecipeElements.push(prevState[i])
                }
            }
            return updatedRecipeElements
        })
        setSelectedCollection((prevState) => {
            const updatedRecipes = []
            for (let i = 0; i < prevState.recipes.length; i++) {
                if (!recipesToRemove.includes(prevState.recipes[i]._id)) {
                    updatedRecipes.push(prevState.recipes[i])
                }
            }
            return {
                ...prevState,
                recipes: updatedRecipes
            }
        })
        setRecipesToRemove([])
        setDisplayRemoveConfirm('none')
    }

    try {

        return (
            <>
                <div
                    id="collection-displayer"
                    style={{ display: selectedCollection.display }}
                >
                    <div id="container-collection" style={{ animation: shrinkAnimation }}>
                        <p id='edit-collection-option' onClick={() => {
                            setDisplayCollectionEdit(() => {
                                return 'grid'
                            })
                            setEditAnimation(() => {
                                return 'new-collection-in 0.2s linear 1'
                            })
                        }
                        }>Edit collection</p>
                        <div id="options-container-collection">
                            <p id='close-container-collection' onClick={() => {
                                const selectedCollections = document.getElementsByClassName('collection-recipe')
                                for (let i = 0; i < selectedCollections.length; i++) {
                                    if (selectedCollections[i].classList.contains('remove-recipe')) {
                                        selectedCollections[i].classList.remove('remove-recipe')
                                    }
                                }
                                setRecipesToRemove(() => {
                                    return []
                                })
                                closeCollection()
                            }
                            }>✖</p>
                            <p id='save-container-collection' onClick={handleSaveCollection}>✓</p>
                        </div>
                        <h4 id="container-collection-title">Recipes in this collection</h4>
                        <div id="collection-recipes-container">
                            {recipeElements}
                        </div>
                    </div>
                </div>
                <div id="collection-confirmation-container" style={{ display: displayRemoveConfirm }}>
                    <div id='collection-recipes-confirm-delete'>
                        <p>Remove selected recipes?</p>
                        <div id='collection-confirm-delete-buttons'>
                            <button type='button' id='collection-cancel-delete' onClick={() => setDisplayRemoveConfirm(() => {
                                return 'none'
                            })}>Cancel</button>
                            <button type='button' id='collection-do-delete' onClick={handleDoRemove}>Remove</button>
                        </div>
                    </div>
                </div>
                <div id="edit-collection-container" style={{ display: displayCollectionEdit }} >
                    <div id="edit-collection-div" style={{ animation: editAnimation }}>
                        <div id="edit-collection-title">
                            <label className="edit-collection-label">Collection name:</label>
                            <input
                                type='text'
                                onChange={(e) => handleChange(e)}
                                name='name'
                                value={editCollectionData.name}
                                id="edit-collection-name"
                                placeholder="Collection name"
                            />
                        </div>
                        <div id="edit-image-container">
                            <label className="edit-collection-label">Choose a new image:</label>
                            <div id="collection-image-options">
                                <img ref={imageRef} src="../../Images/collections1.png" alt="collection" className="collection-image-option" name='collections1' onClick={handleNewImage} />
                                <img src="../../Images/collections2.png" alt="collection" className="collection-image-option" name='collections2' onClick={handleNewImage} />
                                <img src="../../Images/collections3.png" alt="collection" className="collection-image-option" name='collections3' onClick={handleNewImage} />
                                <img src="../../Images/collections4.png" alt="collection" className="collection-image-option" name='collections4' onClick={handleNewImage} />
                            </div>
                        </div>
                        <div id="edit-buttons-container">
                            <div id="save-cancel-buttons">
                                <button type="button" id="edit-collection-cancel" onClick={() => {
                                    setEditAnimation(() => {
                                        return 'new-collection-out 0.2s linear 1'
                                    })
                                    setTimeout(() => {
                                        setDisplayCollectionEdit(() => {
                                            return 'none'
                                        })
                                    }, 150)
                                }}>Cancel</button>
                                <button type="button" id="edit-collection-save" onClick={handleUpdateCollection}>Save</button>
                            </div>
                            <button type="button" id="edit-collection-delete" onClick={() => {
                                setDisplayConfirmDelete(() => {
                                    return {
                                        display: 'grid',
                                        animation: 'collections 0.2s linear 1'
                                    }
                                })
                            }}>✖ Delete collection</button>
                        </div>
                    </div>
                </div>
                <div id='confirm-delete-collection' style={{ display: displayConfirmDelete.display }}>
                    <div id='collection-confirm-delete' style={{ animation: displayConfirmDelete.animation }}>
                        <p>Delete collection?</p>
                        <p>This action cannot be reversed</p>
                        <div id='collection-delete-buttons'>
                            <button type='button' className='collection-cancel-delete' onClick={() => {
                                setDisplayConfirmDelete((prevState) => {
                                    return {
                                        ...prevState,
                                        animation: 'shrink-animation 0.2s linear 1'
                                    }
                                })
                                setTimeout(() => {
                                    setDisplayConfirmDelete((prevState) => {
                                        return {
                                            ...prevState,
                                            display: 'none'
                                        }
                                    })
                                }, 150)
                            }}>Cancel</button>
                            <button type='button' className='collection-do-delete' onClick={() => {
                                handleDeleteCollection()
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
                <div id='display-limit-container' style={{ display: displayLimit.display }}>
                    <div id='display-limit' style={{ animation: displayLimit.animation }}>
                        <p>{displayLimit.message}</p>
                        <button type='button' onClick={() => {
                            setDisplayLimit((prevState) => {
                                return {
                                    ...prevState,
                                    animation: 'new-collection-out 0.2s linear 1'
                                }
                            })
                            setTimeout(() => {
                                setDisplayLimit((prevState) => {
                                    return {
                                        ...prevState,
                                        display: 'none'
                                    }
                                })
                            }, 150)
                        }}>Ok</button>
                    </div>
                </div>
            </>
        )

    } catch (err) {
        console.log(err)
        return (
            <></>
        )
    }
}

export default Collection