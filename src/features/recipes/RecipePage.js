import { useEffect, useState } from 'react'
//import {Helmet} from "react-helmet"
import { 
    FacebookShareButton, 
    TwitterShareButton, 
    WhatsappShareButton, 
    RedditShareButton, 
    PinterestShareButton, 
    TumblrShareButton /*FacebookIcon*/ 
} from "react-share"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'
import { useNavigate, useParams, /*useLocation*/ } from 'react-router-dom'
import {
    useGetRecipeMutation,
    useUpdateRecipeMutation
} from './recipesApiSlice'
import {
    useUpdateFavoriteMutation,
    useGetUserDataMutation,
    useGetCommentedByMutation,
    useAddCollectionMutation
} from '../users/usersApiSlice'
import { useLogEntryMutation } from '../logs/logsApiSlice'
import Recipe from './Recipe'
import Comments from './Comments'
import Collections from './Collections'

const RecipePage = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const lgoff = window.localStorage.getItem('lgoff')

    // const usrlng = window.localStorage.getItem('usrlng')

    const navigate = useNavigate()

    // const currentLocation = useLocation()

    // useEffect(() => {
    //     if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    // }, [usrlng, navigate, currentLocation])

    var content

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    var userName = token ? jwtDecode(token).UserInfo.username : ''

    const isTemp = window.sessionStorage.getItem('isTemp')

    const [getRecipe] = useGetRecipeMutation()

    const [getUserData, { isSuccess }] = useGetUserDataMutation() 

    const [updateFavorite] = useUpdateFavoriteMutation()

    const [getCommentedBy] = useGetCommentedByMutation()

    const [logEntry] = useLogEntryMutation()

    const [addCollection] = useAddCollectionMutation()

    const [updateRecipe] = useUpdateRecipeMutation()

    // current Recipe
    const [currentRecipe, setCurrentRecipe] = useState()

    // current user (to display image on comments, collections, and stats)
    const [currentUser, setCurrentUser] = useState()

    // to determine whether a new 'like'/'star' action can be sent asynchronously (to avoid clogging the backend)
    const [goComment, setGoComment] = useState(true)

    // to animate collections element
    const [shrinkAnimation, setShrinkAnimation] = useState('')

    // to display collections div
    const [displayCollections, setDisplayCollections] = useState('none')

    // to display correct icon in likes, stars, and comments
    const [stats, setStats] = useState({
        likes: 0,
        liked: false,
        star: false,
        comments: []
    })

    const [newCollectionAnimation, setNewCollectionAnimation] = useState('')

    const [displayLogin, setDisplayLogin] = useState('none')

    const [displayShare, setDisplayShare] = useState('none')

    const [displayRecipeConfirmation, setDisplayRecipeConfirmation] = useState({
        display: 'none', 
        animation: '',
        collection: ''
    })

    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRecipe({ id: id, commentsSlice: 10 })
            if (response?.error?.originalStatus === 400 || response?.data === null) navigate('/recipe/404')
            window.localStorage.setItem('usrlng', 'en')
            var userData = await getUserData({userID: userName})
            setCurrentRecipe(() => {
                return response.data.recipe
            })
            setCurrentUser(() => {
                return userData
            })
            setStats(() => {
                return {
                    likes: response.data.recipe.likes,
                    comments: [...response.data.recipe.comments],
                    liked: response.data.recipe.likedBy.includes(userID) ? true : false,
                    star: userData?.data?.favorites.includes(response.data.recipe._id) ? true : false
                }
            })
            // const headElement = document.getElementsByTagName('head')[0]
            // const meta1 = document.createElement('meta')
            // meta1.setAttribute('property', 'og:title')
            // meta1.setAttribute('content', `${response.data.recipe.name}`)
            // const meta4 = document.createElement('meta')
            // meta4.setAttribute('property', 'og:image')
            //meta4.setAttribute('content', `${response.data.recipe.pictures[0]}`)
            // meta4.setAttribute('content', 'https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg')
            // const meta2 = document.createElement('meta')
            // meta2.setAttribute('property', 'og:type')
            // meta2.setAttribute('content', 'website')
            // const meta3 = document.createElement('meta')
            // meta3.setAttribute('property', 'og:url')
            // meta3.setAttribute('content', 'http://localhost:3000/recipes/6522f5937595783cbe83f4ef')
            // meta4.setAttribute('property', 'og:image:url')
            // meta4.setAttribute('content', `${response.data.recipe.pictures[0]}`)
            // //meta4.setAttribute('content', 'http://localhost:3000/Images/avatar1.png')
            // const meta5 = document.createElement('meta')
            // meta5.setAttribute('property', 'og:description')
            // meta5.setAttribute('content', 'Delicious recipes')
            // //console.log(headElement.hasChildNodes(meta1))
            // //headElement.appendChild(meta1)
            //if (!headElement.hasChildNodes(meta1)) headElement.appendChild(meta1)
            // headElement.appendChild(meta1)
            // if (!headElement.hasChildNodes(meta2)) headElement.appendChild(meta2)
            // if (!headElement.hasChildNodes(meta3)) headElement.appendChild(meta3)
            //if (!headElement.hasChildNodes(meta4)) headElement.appendChild(meta4)
            // headElement.appendChild(meta4)
            // if (!headElement.hasChildNodes(meta5)) headElement.appendChild(meta5)
            // const htmlElement = document.getElementsByTagName('html')[0]
            // htmlElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
            // htmlElement.setAttribute('xmlns:og', 'http://ogp.me/ns#')
            // htmlElement.setAttribute('xmlns:fb', 'https://www.facebook.com/2008/fbml')
        }
        fetchData()
    }, [id, getRecipe, getUserData, userID, token, getCommentedBy, navigate, userName])

    const handleLike = async (e) => {
        if (goComment) {
            if (!stats.liked) {
                setGoComment(prevState => !prevState)
                e.target.src = '../../Images/like2.png'
                setStats((prevState) => {
                    return {
                        ...prevState,
                        likes: prevState.likes + 1,
                        liked: !prevState.liked
                    }
                })
                await updateRecipe({ id: currentRecipe._id, stat: 'like', userID: userID })
                if (isTemp === 'n' && lgoff === 'n') logEntry({ activity: 'like', recipeID: currentRecipe._id, userID: userID })
                setGoComment(prevState => !prevState)
            } else if (stats.liked) {
                setGoComment(prevState => !prevState)
                e.target.src = '../../Images/like.png'
                setStats((prevState) => {
                    return {
                        ...prevState,
                        likes: prevState.likes - 1,
                        liked: !prevState.liked
                    }
                })
                await updateRecipe({ id: currentRecipe._id, stat: 'like', userID: userID })
                setGoComment(prevState => !prevState)
            }
        }
    }

    const handleStar = async (e) => {
        if (isTemp === 'n') {
            if (goComment) {
                if (!stats?.star) {
                    setGoComment(prevState => !prevState)
                    e.target.src = '../../Images/star2.png'
                    setStats((prevState) => {
                        return {
                            ...prevState,
                            star: !prevState.star
                        }
                    })
                    await updateFavorite({ recipeID: currentRecipe._id, stat: 'star', userID: userID })
                    if (isTemp === 'n' && lgoff === 'n') logEntry({ activity: 'favorite', recipeID: currentRecipe._id, userID: userID })
                    setGoComment(prevState => !prevState)
                } else if (stats?.star) {
                    setGoComment(prevState => !prevState)
                    e.target.src = '../../Images/star.png'
                    setStats((prevState) => {
                        return {
                            ...prevState,
                            star: !prevState.star
                        }
                    })
                    await updateFavorite({ recipeID: currentRecipe._id, stat: 'star', userID: userID })
                    setGoComment(prevState => !prevState)
                }
            }
        } else {
            setDisplayLogin(() => {
                return 'grid'
            })
            setNewCollectionAnimation(() => {
                return 'new-collection-in 0.2s linear 1'
            })
        }
    }

    const handleShare = () => {
        setDisplayShare((prevState) => {
            return prevState === 'none' ? 'grid' : 'none'
        })
    }

    // const shareFacebook = () => {
    //     var url = `https://www.localhost:3000/recipes/${currentRecipe.searchField}`
    //     var imageURL = 'https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg'
    //     //var url = `https://recipes.wicked-web-worm.com`
    //     //var url = 'http://localhost:3000/recipes/6522f5937595783cbe83f4ef'
    //     console.log(url.toString())
    //     var params = "menubar=no,toolbar=no,status=no,width=570,height=570"
    //     //let shareUrl = `http://www.facebook.com/sharer/sharer.php?u=${url}?imageurl='https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg'`
    //     let shareUrl = `https://www.facebook.com/sharer.php?u=${url}?imageurl=${imageURL}`
    //     window.open(shareUrl, "NewWindow", params)
    // }

    // const shareTwitter = () => {
    //     var url = `https://recipes.wicked-web-worm.com`
    //     var params = "menubar=no,toolbar=no,status=no,width=570,height=570"
    //     //let shareUrl = `https://twitter.com/intent/tweet?url={url}&text={title}&via={user_id}&hashtags={hash_tags}`
    //     let shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${currentRecipe.name}`
    //     window.open(shareUrl, "NewWindow", params)
    // }

    // const shareWhatsapp = () => {
    //     //var url = `https://recipes.wicked-web-worm.com`
    //     var params = "menubar=no,toolbar=no,status=no,width=570,height=570"
    //     let shareUrl = `whatsapp://send?text=${currentRecipe.name}`
    //     window.open(shareUrl, "NewWindow", params)
    // }

    // const shareReddit = () => {
    //     var url = `https://recipes.wicked-web-worm.com`
    //     var params = "menubar=no,toolbar=no,status=no,width=570,height=570"
    //     let shareUrl = `https://www.reddit.com/submit?url=${url}`
    //     window.open(shareUrl, "NewWindow", params)
    // }

    // const sharePinterest = () => {
    //     var url = `https://recipes.wicked-web-worm.com`
    //     var params = "menubar=no,toolbar=no,status=no,width=570,height=570"
    //     let shareUrl = `http://pinterest.com/pin/create/button/?url=${url}`
    //     window.open(shareUrl, "NewWindow", params)
    // }

    // const shareTumblr = () => {
    //     var url = `https://recipes.wicked-web-worm.com`
    //     var params = "menubar=no,toolbar=no,status=no,width=570,height=570"
    //     let shareUrl = `http://www.tumblr.com/share/link?url=${url}`
    //     window.open(shareUrl, "NewWindow", params)
    // }

    const handleCollection = () => {
        setDisplayCollections(() => {
            return 'grid'
        })
        setShrinkAnimation(() => {
            return 'collections 0.2s linear 1'
        })
    }
    
    const addToACollection = (collectionIndex) => {
        addCollection({ userID: userID, recipeID: currentRecipe._id, collectionIndex: collectionIndex })
        setShrinkAnimation(() => {
            return 'shrink-animation 0.2s linear 1'
        })
        setTimeout(() => {
            setDisplayCollections(() => 'none')
        }, 150)
    }

    try {
        //console.log(currentRecipe)
        content = (
            <>                  
                {/* <Helmet>
                    <meta property="og:image" content='https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg'/>
                    <title>{currentRecipe.name}</title>
                    <link rel="canonical" href={`https://www.localhost:3000/recipes/${currentRecipe.searchField}`} />
                </Helmet> */}
                <div id="recipe-page-container">
                    <Recipe
                        id={id}
                        userID={userID}
                        currentUser={currentUser}
                        isSuccess={isSuccess}
                    />
                    <div id="likes-comments-share">
                        <div id='like-container'>
                            <p>{`${stats.likes}`}</p>
                            <img
                                src={!stats.liked ? '../../Images/like.png' : '../../Images/like2.png'}
                                alt='like'
                                id='like-icon'
                                onClick={handleLike}
                            />
                        </div>
                        <img
                            src={!stats?.star ? '../../Images/star.png' : '../../Images/star2.png'}
                            alt='star'
                            id='star-icon'
                            onClick={handleStar}
                        />
                        <img
                            src='../../Images/plus2.png'
                            alt='plus'
                            id='plus-icon'
                            onClick={handleCollection}
                        />
                        <img
                            src='../../Images/share.png'
                            alt='share'
                            id='share-icon'
                            onClick={handleShare} />
                        <div id='share-options-container' style={{ display: displayShare }} onMouseLeave={() => setDisplayShare('none')}>
                            {/* <div className='share-option' onClick={shareFacebook}>
                                <img src='../../Images/Facebook.png' alt='Facebook' className='share-icon' />
                                <p className='share-label'>Facebook</p>
                            </div> */}
                            {/* <FacebookShareButton children={''} url={`https://www.localhost:3000/recipes/${currentRecipe.searchField}`} quote={currentRecipe.name}> */}
                            <FacebookShareButton className='share-option' children={''} url={`https://recipexplorer.onrender.com/recipes/${currentRecipe.searchField}?imageurl=https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg`} title={currentRecipe.name}>
                                <img src='../../Images/Facebook.png' alt='Facebook' className='share-icon' />
                                <p className='share-label'>Facebook</p>
                            </FacebookShareButton>
                            <TwitterShareButton className='share-option' children={''} url={`https://recipexplorer.onrender.com/recipes/${currentRecipe.searchField}?imageurl=https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg`} title={currentRecipe.name}>
                                <img src='../../Images/X-Twitter.png' alt='Twitter' className='share-icon' />
                                <p className='share-label'>Twitter</p>
                            </TwitterShareButton>
                            <WhatsappShareButton className='share-option' children={''} url={`https://recipexplorer.onrender.com/recipes/${currentRecipe.searchField}?imageurl=https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg`} title={currentRecipe.name}>
                                <img src='../../Images/WhatsApp.png' alt='Whatsapp' className='share-icon' />
                                <p className='share-label'>Whatsapp</p>
                            </WhatsappShareButton>
                            <RedditShareButton className='share-option' children={''} url={`https://recipexplorer.onrender.com/recipes/${currentRecipe.searchField}?imageurl=https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg`} title={currentRecipe.name}>
                                <img src='../../Images/Reddit.png' alt='Reddit' className='share-icon' />
                                <p className='share-label'>Reddit</p>
                            </RedditShareButton>
                            <PinterestShareButton className='share-option' children={''} url={`https://recipexplorer.onrender.com/recipes/${currentRecipe.searchField}?imageurl=https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg`} title={currentRecipe.name}>
                                <img src='../../Images/Pinterest.png' alt='Pinterest' className='share-icon' />
                                <p className='share-label'>Pinterest</p>
                            </PinterestShareButton>
                            <TumblrShareButton className='share-option' children={''} url={`https://recipexplorer.onrender.com/recipes/${currentRecipe.searchField}?imageurl=https://recipexplorer.onrender.com/Images/Recipes/spaghetti.jpg`} title={currentRecipe.name}>
                                <img src='../../Images/Tumblr.png' alt='Tumblr' className='share-icon' />
                                <p className='share-label'>Tumblr</p>
                            </TumblrShareButton>
                        </div>
                    </div>
                    <Comments
                        userID={userID}
                        userName={userName}
                        id={id}
                        goComment={goComment}
                        setGoComment={setGoComment}
                        isTemp={isTemp}
                    />
                </div>
                <Collections
                    currentUser={currentUser}
                    currentRecipe={currentRecipe}
                    setShrinkAnimation={setShrinkAnimation}
                    addToACollection={addToACollection}
                    setDisplayCollections={setDisplayCollections}
                    displayCollections={displayCollections}
                    shrinkAnimation={shrinkAnimation}
                    setDisplayRecipeConfirmation={setDisplayRecipeConfirmation}
                />
                <div id='recipe-confirmation-container' style={{display: displayRecipeConfirmation.display, animation: displayRecipeConfirmation.animation}}>
                    <p>Recipe added to <span style={{fontSize: '22px'}}>{displayRecipeConfirmation.collection}</span></p>
                </div>
                <div id='recipe-login-option' style={{ display: displayLogin }}>
                    <div id='recipe-login-container' style={{ animation: newCollectionAnimation }}>
                        <p id='recipe-login-prompt' onClick={() => navigate('/login')}>Please login to add to favorites ➜</p>
                        <button type='button' onClick={() => {
                            setNewCollectionAnimation(() => {
                                return 'new-collection-out 0.2s linear 1'
                            })
                            setTimeout(() => {
                                setDisplayLogin(() => {
                                    return 'none'
                                })
                            }, 150)
                        }}>Cancel</button>
                    </div>
                </div>
            </>
        )
    } catch (err) {
        //console.log(err)
        content = (
            <></>
        )
    }

    return content
}

export default RecipePage