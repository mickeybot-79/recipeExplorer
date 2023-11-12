import { useRef, useState } from "react"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../../../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
import { useCreateCollectionMutation } from '../../../features/users/usersApiSlice'

const NewCollection = (
    {
        displayNewCollection,
        setDisplayNewCollection,
        newCollectionAnimation,
        setNewCollectionAnimation
    }) => {

    const imageRef = useRef()

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    const [createCollection] =  useCreateCollectionMutation()

    const [collectionData, setCollectionData] = useState({
        name: '',
        image: ''
    })

    const [displayLimit, setDisplayLimit] = useState({
        display: 'none',
        animation: '',
        message: ''
    })

    const [displayPicture, setDisplayPicture] = useState('none')

    const handleChange = (e) => {
        setCollectionData((prevState) => {
            return {
                ...prevState,
                name: e.target.value
            }
        })
    }

    const handleCancel = () => {
        setNewCollectionAnimation(() => {
            return 'new-collection-out 0.2s linear 1'
        })
        setTimeout(() => {
            setDisplayNewCollection(() => {
                return 'none'
            })
        }, 150)
        setCollectionData(() => {
            return {
                name: '',
                image: ''
            }
        })
        imageRef.current.classList.remove('selected-image')
    }

    const listener = () => {
        setCollectionData((prevState) => {
            return {
                ...prevState,
                image: ''
            }
        })
        setDisplayPicture(() => {
            return 'none'
        })
    }

    const handleNewImage = (e) => {
        imageRef.current.classList.remove('selected-image')
        imageRef.current = e.target
        e.target.classList.add('selected-image')
        setCollectionData((prevState) => {
            return {
                ...prevState,
                image: `${e.target.name}.png`
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!collectionData.name) {
            setDisplayLimit(() => {
                return {
                    display: 'grid',
                    animation: 'new-collection-in 0.2s linear 1',
                    message: 'La colección necesita un nombre'
                }
            })
        } else {
            console.log('true')
            const result = await createCollection({userID: userID, name: collectionData.name, image: collectionData.image})
            console.log(result)
            if (result?.data?.error === 'limit reached') {
                setDisplayLimit(() => {
                    return {
                        display: 'grid',
                        animation: 'new-collection-in 0.2s linear 1',
                        message: 'Has alcanzado el número máximo de colecciones.'
                    }
                })
            } else {
                window.location.reload()
            }
        }
    }

    const pictureElement = (
        <div style={{ display: displayPicture }}>
            <img src={collectionData.image} alt="collection" />
            <div className="collection-X-container">
                <p
                    onClick={listener}
                >✖</p>
            </div>
        </div>
    )

    return (
        <div id="new-collection-container" style={{display: displayNewCollection}}>
            <div id="new-collection-div" style={{animation: newCollectionAnimation}}>
                <form onSubmit={handleSubmit} id="new-collection-form">
                    <label className="new-collection-form-input">Nombre de la colección:</label>
                    <input
                        type='text'
                        placeholder="Nombre de tu colección"
                        onChange={(e) => handleChange(e)}
                        name='name'
                        value={collectionData.name}
                        id="new-collection-name"
                    />
                    <div id="collection-pictures-container">
                        <div id="collection-pictures-input">
                            <label className="new-collection-form-input">Elige una imagen:</label>
                            <div id="image-options">
                                <img ref={imageRef} src="../../Images/collections1.png" alt="collection" className="collection-image" name='collections1' onClick={handleNewImage}/>
                                <img src="../../Images/collections2.png" alt="collection" className="collection-image" name='collections2' onClick={handleNewImage}/>
                                <img src="../../Images/collections3.png" alt="collection" className="collection-image" name='collections3' onClick={handleNewImage}/>
                                <img src="../../Images/collections4.png" alt="collection" className="collection-image" name='collections4' onClick={handleNewImage}/>
                            </div>
                        </div>
                        <div id="collection-pictures-preview">
                            {pictureElement}
                        </div>
                    </div>
                    <div id="new-collection-buttons">
                        <div id="new-collection-cancel" onClick={handleCancel}>Cancelar</div>
                        <button id="new-collection-submit">Guardar</button>
                    </div>
                </form>
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
        </div>
    )
}

export default NewCollection