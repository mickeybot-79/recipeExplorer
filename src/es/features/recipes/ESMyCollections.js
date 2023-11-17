import { useEffect, useState } from "react"
import { useGetCollectionsMutation } from '../../../features/users/usersApiSlice'
import { useGetCollectionRecipesDataMutation } from '../../../features/recipes/recipesApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../../../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
import ESCollection from './ESCollection'
import ESNewCollection from './ESNewCollection'
import { useNavigate, useLocation } from "react-router-dom"
import LoadingIcon from "../../../components/LoadingIcon"

const MyCollections = () => {

    const usrlng = window.localStorage.getItem('usrlng')

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    const [getCollections] = useGetCollectionsMutation()

    const [getCollectionRecipesData] = useGetCollectionRecipesDataMutation()

    const [collections, setCollections] = useState([])

    const [selectedCollection, setSelectedCollection] = useState({
        name: '',
        image: '',
        collectionIndex: 0,
        recipes: [],
        display: 'none'
    })

    const [shrinkAnimation, setShrinkAnimation] = useState('')

    const [displayNewCollection, setDisplayNewCollection] = useState('none')

    const [newCollectionAnimation, setNewCollectionAnimation] = useState('')

    const [displayLoading, setDisplayLoading] = useState('none')

    useEffect(() => {
        const fetchCollections = async () => {
            setDisplayLoading('grid')
            const userCollections = await getCollections({ userID: userID })
            const allCollections = []
            for (let i = 0; i < userCollections.data.userCollections.length; i++) {
                const currentCollectionRecipes = await getCollectionRecipesData({recipes: userCollections.data.userCollections[i].recipes})
                allCollections.push({
                    name: userCollections.data.userCollections[i].name,
                    image: userCollections.data.userCollections[i].image,
                    recipes: currentCollectionRecipes
                })
            }
            setCollections(() => {
                return allCollections
            })
            setDisplayLoading('none')
        }
        fetchCollections()
    }, [userID, getCollections,getCollectionRecipesData])

    const selectCollection = (collection, currentCollectionIndex) => {
        setSelectedCollection(() => {
            return {
                name: collection.name,
                image: collection.image,
                collectionIndex: currentCollectionIndex,
                recipes: collection.recipes,
                display: 'grid'
            }
        })
        setShrinkAnimation(() => {
            return 'collections 0.25s linear 1'
        })
    }

    const closeCollection = () => {
        setShrinkAnimation(() => {
            return 'shrink-animation 0.25s linear 1'
        })
        setTimeout(() => {
            setSelectedCollection((prevState) => {
                return {
                    ...prevState,
                    display: 'none'
                }
            })
        }, 180)
    }

    try {

        const collectionElements = collections.map(collection => {

            const currentCollectionIndex = collections.indexOf(collection)

            return (
                <div
                    className="user-collection-container"
                    key={currentCollectionIndex}
                    onClick={() => selectCollection(collection, currentCollectionIndex)}
                >
                    <div style={{ display: 'flex', position: 'relative' }}>
                        <h3
                            className="user-collection-title"
                        >{collection.name} </h3>
                    </div>
                    <div style={{ position: 'relative' }} className="collection-image-container">
                        <img
                            src={`../../Images/${collection.image}`}
                            alt="collection"
                            className="user-collection-image"
                        />
                    </div>
                </div>
            )
        })

        return (
            <>
                <div id="collections-page-container">
                    <h1 id='collections-page-title'>Tus Colecciones</h1>
                    <div id="user-collections-container">
                        {collectionElements}
                    </div>
                    <button type="button" id="new-collection-button" onClick={() => {
                        setDisplayNewCollection(() => {
                            return 'grid'
                        })
                        setNewCollectionAnimation(() => {
                            return 'new-collection-in 0.2s linear 1'
                        })
                    }}
                    >Crear nueva colección</button>
                    <ESCollection
                        selectedCollection={selectedCollection}
                        setSelectedCollection={setSelectedCollection}
                        collections={collections}
                        setCollections={setCollections}
                        shrinkAnimation={shrinkAnimation}
                        closeCollection={closeCollection}
                        userID={userID}
                    />
                </div>
                <ESNewCollection
                    displayNewCollection={displayNewCollection}
                    setDisplayNewCollection={setDisplayNewCollection}
                    newCollectionAnimation={newCollectionAnimation}
                    setNewCollectionAnimation={setNewCollectionAnimation}
                />
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    placeContent: 'center',
                    display: displayLoading
                }}>
                    <img
                        src='../../../Images/favicon-gif.gif'
                        alt='icon'
                        style={{
                            marginTop: '-100px',
                            width: '150px',
                            filter: 'sepia(40%)'
                        }}
                    />
                    <p style={{marginLeft: '40px'}}>Cargando...</p>
                </div>
            </>
        )

    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc={`../../Images/favicon-gif.gif`}/>
        )
    }

}

export default MyCollections