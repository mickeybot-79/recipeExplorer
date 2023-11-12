import { useState } from 'react'
import NewCollection from './ESNewCollection'
import { useNavigate } from 'react-router-dom'

const Collections = ({ currentRecipe, currentUser, setShrinkAnimation, addToACollection, setDisplayCollections, displayCollections, shrinkAnimation, setDisplayRecipeConfirmation }) => {

    const isTemp = window.sessionStorage.getItem('isTemp')

    const navigate = useNavigate()

    const [displayNewCollection, setDisplayNewCollection] = useState('none')

    const [newCollectionAnimation, setNewCollectionAnimation] = useState('')

    const [displayLogin, setDisplayLogin] = useState('none')

    const [selectedCol, setSelectedCol] = useState([])

    //const [displayLoginAnimation, setDisplayLoginAnimation] = useState('')

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
                        <img src={`../../../Images/${collection.image}`} alt='collection' />
                    </div>
                )
            })
        } else {
            collectionElements = (
                <h3 id="no-collections-message">Aún no tienes colecciones.</h3>
            )
        }

        return (
            <div id='recipe-collections-container' style={{ display: displayCollections }}>
                <div id='collections-container' style={{ animation: shrinkAnimation }}>
                    <h4>Agregar a una colección</h4>
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
                    <button type='button' id='new-collection-es' onClick={() => {
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
                    }}><span style={{ fontSize: '22px' }}>+</span> Nueva Colección</button>
                    <button id='manage-collections' onClick={() => navigate('/es/dash/collections')}>Administrar colecciones</button>
                </div>
                <NewCollection
                    displayNewCollection={displayNewCollection}
                    setDisplayNewCollection={setDisplayNewCollection}
                    newCollectionAnimation={newCollectionAnimation}
                    setNewCollectionAnimation={setNewCollectionAnimation}
                />
                <div id='recipe-login-option' style={{display: displayLogin}}>
                    <div id='recipe-login-container' style={{animation: newCollectionAnimation}}>
                        <p id='recipe-login-prompt' onClick={() => navigate('/es/login')}>Por favor, inicia sesión para crear una colección ➜</p>
                        <button type='button' onClick={handleCancel}>Cancelar</button>
                    </div>
                </div>
            </div>
        )

    } catch (err) {
        //console.log(err)
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeContent: 'center'
            }}>
                <img
                    src='../../../Images/favicon-gif.gif'
                    alt='icon'
                    style={{
                        marginTop: '200px',
                        width: '200px',
                        filter: 'sepia(40%)'
                    }}
                />
            </div>
        )
    }
}

export default Collections