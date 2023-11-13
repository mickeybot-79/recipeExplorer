import { useEffect, useState } from "react"
import { useGetCollectionsMutation } from '../users/usersApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'
import Collection from './Collection'
import NewCollection from './NewCollection'
import { useNavigate, useLocation } from "react-router-dom"
import LoadingIcon from "../../components/LoadingIcon"

const MyCollections = () => {

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    const [getCollections] = useGetCollectionsMutation()

    const [collections, setCollections] = useState()

    const [selectedCollection, setSelectedCollection] = useState({
        name: '',
        collectionIndex: 0,
        recipes: [],
        display: 'none'
    })

    const [shrinkAnimation, setShrinkAnimation] = useState('')

    const [displayNewCollection, setDisplayNewCollection] = useState('none')

    const [newCollectionAnimation, setNewCollectionAnimation] = useState('')

    useEffect(() => {
        const fetchCollections = async () => {
            const userCollections = await getCollections({ userID: userID})
            setCollections(() => {
                return userCollections.data.userCollections
            })
        }
        fetchCollections()
    }, [userID, getCollections])

    const selectCollection = (collection, currentCollectionIndex) => {
        setSelectedCollection(() => {
            return {
                name: collection.name,
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
                    <h1 id='collections-page-title'>Your Collections</h1>
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
                    >Create a new collection</button>
                    <Collection
                        selectedCollection={selectedCollection}
                        setSelectedCollection={setSelectedCollection}
                        shrinkAnimation={shrinkAnimation}
                        closeCollection={closeCollection}
                        userID={userID}
                    />
                </div>
                <NewCollection
                    displayNewCollection={displayNewCollection}
                    setDisplayNewCollection={setDisplayNewCollection}
                    newCollectionAnimation={newCollectionAnimation}
                    setNewCollectionAnimation={setNewCollectionAnimation}
                />
            </>
        )

    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon />
        )
    }

}

export default MyCollections