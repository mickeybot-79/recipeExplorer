import { useState } from 'react'
import NewCollection from './NewCollection'
import { useNavigate } from 'react-router-dom'

const Collections = ({ currentRecipe, currentUser, setShrinkAnimation, addToACollection, setDisplayCollections, displayCollections, shrinkAnimation, setDisplayRecipeConfirmation }) => {

    const isTemp = window.sessionStorage.getItem('isTemp')

    const navigate = useNavigate()

    const [displayNewCollection, setDisplayNewCollection] = useState('none')

    const [newCollectionAnimation, setNewCollectionAnimation] = useState('')

    const [displayLogin, setDisplayLogin] = useState('none')

    const [selectedCol, setSelectedCol] = useState([])

    const handleCancel = () => {
        setNewCollectionAnimation(() => {
            return 'new-collection-out 0.2s linear 1'
        })
        setTimeout(() => {
            setDisplayLogin(() => {
                return 'none'
            })
        }, 150)
    }

    try {

        var collectionElements = []

        if (currentUser.data.collections.length) {
            collectionElements = currentUser.data.collections.map(collection => {

                const collectionIndex = currentUser.data.collections.indexOf(collection)
    
                return (
                    <div
                        className='collection-container'
                        key={collectionIndex}
                        onClick={() => {
                            addToACollection(collectionIndex)
                            setDisplayRecipeConfirmation(() => {
                                return {
                                    display: 'grid',
                                    animation: 'new-collection-in 0.4s linear 1',
                                    collection: collection.name
                                }
                            })
                            setTimeout(() => {
                                setDisplayRecipeConfirmation((prevState) => {
                                    return {
                                        ...prevState,
                                        animation: 'new-collection-out 0.4s linear 1'
                                    }
                                })
                                setTimeout(() => {
                                    setDisplayRecipeConfirmation((prevState) => {
                                        return {
                                            ...prevState,
                                            display: 'none'
                                        }
                                    })
                                }, 150)
                            }, 3000)
                            setSelectedCol((prevState) => {
                                const updatedArray = [...prevState]
                                updatedArray.push(collection)
                                return updatedArray
                            })
                        }}
                        style={{border: collection.recipes.includes(currentRecipe._id) || selectedCol.includes(collection) ? '5px solid red' : ''}}
                    >
                        <h3>{collection.name}</h3>
                        <img src={`../../Images/${collection.image}`} alt='collection' />
                    </div>
                )
            })
        } else {
            collectionElements = (
                <h3 id="no-collections-message">You have no collections yet.</h3>
            )
        }

        return (
            <div id='recipe-collections-container' style={{ display: displayCollections }}>
                <div id='collections-container' style={{ animation: shrinkAnimation }}>
                    <h4>Add to a collection</h4>
                    <p id='close-collections' onClick={() => {
                        setShrinkAnimation(() => {
                            return 'shrink-animation 0.2s linear 1'
                        })
                        setTimeout(() => {
                            setDisplayCollections(() => 'none')
                        }, 140)
                    }}>✖</p>
                    <div id='collection-elements'>
                        {collectionElements}
                    </div>
                    <button type='button' id='new-collection' onClick={() => {
                        if (isTemp === 'n') {
                            setDisplayNewCollection(() => {
                                return 'grid'
                            })
                            setNewCollectionAnimation(() => {
                                return 'new-collection-in 0.2s linear 1'
                            })
                        } else {
                            setDisplayLogin(() => {
                                return 'grid'
                            })
                            setNewCollectionAnimation(() => {
                                return 'new-collection-in 0.2s linear 1'
                            })
                        }
                    }}><span style={{ fontSize: '22px' }}>+</span> New Collection</button>
                    <button id='manage-collections' onClick={() => navigate('/dash/collections')}>Manage Your Collections</button>
                </div>
                <NewCollection
                    displayNewCollection={displayNewCollection}
                    setDisplayNewCollection={setDisplayNewCollection}
                    newCollectionAnimation={newCollectionAnimation}
                    setNewCollectionAnimation={setNewCollectionAnimation}
                />
                <div id='recipe-login-option' style={{display: displayLogin}}>
                    <div id='recipe-login-container' style={{animation: newCollectionAnimation}}>
                        <p id='recipe-login-prompt' onClick={() => navigate('/login')}>Please login to create a collection ➜</p>
                        <button type='button' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        )

    } catch (err) {
        //console.log(err)
        return (
            <></>
        )
    }
}

export default Collections