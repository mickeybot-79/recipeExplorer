import { useEffect, useRef, useState } from 'react'
import {
    useGetRecipeMutation,
    useLikeCommentMutation,
    useGetCommentsMutation,
    useUpdateRecipeMutation,
    useDeleteCommentMutation
} from '../../../features/recipes/recipesApiSlice'
import {
    useGetCommentedByMutation,
    useGetUserDataMutation
} from '../../../features/users/usersApiSlice'
import { useLogEntryMutation } from '../../../features/logs/logsApiSlice'
import { useNavigate } from 'react-router-dom'

const Comments = ({ userID, userName, id, goComment, setGoComment, isTemp }) => {

    const logoff = window.localStorage.getItem('lgoff')

    const commentsRef = useRef()

    const replyRef = useRef()

    const lastComment = useRef()

    const navigate = useNavigate()

    const [getRecipe] = useGetRecipeMutation()

    const [getUserData] = useGetUserDataMutation()

    const [getCommentedBy] = useGetCommentedByMutation()

    const [likeComment] = useLikeCommentMutation()

    const [getComments] = useGetCommentsMutation()

    const [updateRecipe] = useUpdateRecipeMutation()

    const [deleteComment] = useDeleteCommentMutation()

    const [logEntry] = useLogEntryMutation()

    const [trueSuccess, setTrueSuccess] = useState(true)

    // list of users who commented (to display their profile pictures)
    const [commentedByUsers, setCommentedByUsers] = useState([])

    // current user (to display image on comments, collections, and stats)
    const [currentUser, setCurrentUser] = useState()

    // to display 'Cancel' button in comments
    const [displayCancel, setDisplayCancel] = useState('none')

    // select the comment to be deleted (prior to confirmation)
    const [commentToDelete, setCommentToDelete] = useState({
        ID: '',
        display: 'none'
    })

    // current Recipe
    const [currentRecipe, setCurrentRecipe] = useState()

    // to display a new comment added by user
    const [userComment, setUserComment] = useState({
        content: '',
        userID: userID,
        date: '',
        likes: 0,
        likedBy: '',
        _id: 0
    })

    // to display correct icon in likes, stars, and comments
    const [stats, setStats] = useState({
        likes: 0,
        liked: false,
        star: false,
        comments: []
    })

    // to display further comments on demand
    const [commentsSlice, setCommentsSlice] = useState(10)

    const [commentLength, setCommentLength] = useState()

    const [displayCommentLoader, setDisplayCommentLoader] = useState('none')

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRecipe({ id: id, commentsSlice: commentsSlice })
            var userData = await getUserData({userID: userName})
            const allUsersWhoCommented = []
            for (let i = 0; i < response?.data?.recipe?.comments.length; i++) {
                allUsersWhoCommented.push(response.data.recipe.comments[i].userID)
            }
            //console.log('allUsersWhoCommented:', allUsersWhoCommented)
            var usersWhoCommented = await getCommentedBy({ users: allUsersWhoCommented })
            //console.log('usersWhoCommented: ', usersWhoCommented)
            //console.log(userData)
            setCommentLength(() => {
                return response.data.commentLength
            })
            setCurrentRecipe(() => {
                return response.data.recipe
            })
            setCommentedByUsers(() => {
                return usersWhoCommented.data
            })
            setCurrentUser(() => {
                return userData
            })
        }
        fetchData()
    }, [id, getRecipe, userID, getCommentedBy, commentsSlice, getUserData, userName])

    useEffect(() => {
        const fetchStats = async () => {
            setTrueSuccess(false)
            const response = await getRecipe({ id: id, commentsSlice: commentsSlice })
            const allUsersWhoCommented = []
            for (let i = 0; i < response?.data?.recipe?.comments.length; i++) {
                allUsersWhoCommented.push(response.data.recipe.comments[i].userID)
            }
            var usersWhoCommented = await getCommentedBy({ users: allUsersWhoCommented })
            setCommentedByUsers(() => {
                return usersWhoCommented.data
            })
            setStats((prevState) => {
                return {
                    ...prevState,
                    comments: [...response.data.recipe.comments]
                }
            })
            if (commentsSlice > 10) {
                window.scrollTo(0, replyRef.current.offsetTop - 2250)
            }
            setTrueSuccess(true)
        }
        fetchStats()
        // eslint-disable-next-line
    }, [])

    const handleLikeComment = async (e, commentID) => {
        if (goComment) {
            const selectedComment = stats.comments.filter(comment => comment._id === commentID)
            //console.log(selectedComment)
            const realIndex = stats.comments.indexOf(selectedComment[0])
            //console.log(stats.comments)
            if (!stats.comments[realIndex].likedBy.includes(userID)) {
                setGoComment(prevState => !prevState)
                e.target.src = '../../Images/like2.png'
                setStats((prevState) => {
                    const updatedLikes = prevState.comments[realIndex].likes + 1
                    const updatedLikedBy = [...prevState.comments[realIndex].likedBy, userID]
                    const updatedComment = {
                        ...prevState.comments[realIndex],
                        likes: updatedLikes,
                        likedBy: updatedLikedBy,
                    }
                    const updatedComments = [...prevState.comments]
                    updatedComments.splice(realIndex, 1, updatedComment)
                    return {
                        ...prevState,
                        comments: updatedComments
                    }
                })
                //const result = 
                await likeComment({ recipeID: currentRecipe._id, commentID: commentID, userID: userID })
                //console.log('result:', result)
                setGoComment(prevState => !prevState)
            } else {
                setGoComment(prevState => !prevState)
                e.target.src = '../../Images/like.png'
                setStats((prevState) => {
                    const updatedLikes = prevState.comments[realIndex].likes - 1
                    const updatedLikedBy = [...prevState.comments[realIndex].likedBy]
                    updatedLikedBy.splice(updatedLikedBy.indexOf(userID), 1)
                    const updatedComment = {
                        ...prevState.comments[realIndex],
                        likes: updatedLikes,
                        likedBy: updatedLikedBy,
                    }
                    const updatedComments = [...prevState.comments]
                    updatedComments.splice(realIndex, 1, updatedComment)
                    return {
                        ...prevState,
                        comments: updatedComments
                    }
                })
                await likeComment({ recipeID: currentRecipe._id, commentID: commentID, userID: userID })
                setGoComment(prevState => !prevState)
            }
        }
    }

    const handleReply = () => {
        window.scrollTo({ top: replyRef.current.offsetTop - 50, behavior: 'smooth' })
        setTimeout(() => {
            replyRef.current.focus()
        }, 800)
    }

    const handleCommentSlice = async (recipeID) => {
        //window.scrollTo(0, document.body.scrollHeight)
        const updatedSlice = commentsSlice + 10
        const updatedComments = [...stats.comments]
        const additionalComments = await getComments({ recipeID: recipeID, commentsSlice: updatedSlice })
        updatedComments.push(additionalComments)
        setCommentsSlice(() => {
            return updatedSlice
        })
    }

    const handleChange = (e) => {
        setUserComment((prevState) => {
            const date = new Date()
            const today = date.getTime()
            return {
                ...prevState,
                content: e.target.value,
                date: today
            }
        })
        if (userComment.content !== '') {
            setDisplayCancel(() => {
                return 'block'
            })
        } else {
            setDisplayCancel(() => {
                return 'none'
            })
        }
    }

    const handleCancel = () => {
        setUserComment((prevState) => {
            return {
                ...prevState,
                content: '',
                date: ''
            }
        })
        setDisplayCancel(() => {
            return 'none'
        })
    }

    const handlePost = async () => {
        if (userComment.content !== '') {
            setDisplayCommentLoader(() => {
                return 'block'
            })
            const result = await updateRecipe({ id: currentRecipe._id, stat: userComment.content, userID: userID })
            setStats((prevState) => {
                //const updatedComments = [...prevState.comments, userComment]
                return {
                    ...prevState,
                    //comments: [...updatedComments].sort((a, b) => b.date - a.date)
                    comments: [...result.data.comments].sort((a, b) => b.date - a.date)
                }
            })
            setCommentedByUsers((prevState) => {
                //const updatedArray = [...prevState, userComment.userID]
                const updatedArray = [...prevState, currentUser.data]
                return updatedArray
            })
            setUserComment(() => {
                return {
                    content: '',
                    userID: userID,
                    date: '',
                    likes: 0,
                    likedBy: '',
                    _id: 0
                }
            })
            setDisplayCommentLoader(() => {
                return 'none'
            })
            if (isTemp === 'n' && logoff === 'n') logEntry({ activity: 'comment', recipeID: currentRecipe._id, userID: userID })
            setTimeout(() => {
                window.scrollTo({ top: commentsRef.current.offsetTop - 200, behavior: 'smooth' })
            }, 100)
            //console.log(commentedByUsers)
        }
    }

    const handleDeleteComment = (commentID) => {
        deleteComment({ recipeID: currentRecipe._id, commentID: commentID, userID: userID })
        setStats((prevState) => {
            const updatedComments = [...prevState.comments]
            var commentIndex
            for (let i = 0; i < prevState.comments.length; i++) {
                if (prevState.comments[i]._id === commentID) commentIndex = i
            }
            updatedComments.splice(commentIndex, 1)
            return {
                ...prevState,
                comments: [...updatedComments].sort((a, b) => b.date - a.date)
            }
        })
    }

    const selectUser = (commentUserID, isTempUser) => {
        //console.log(commentUserID)
        //console.log(isTempUser)
        if (commentUserID && !isTempUser) navigate(`/es/user/${commentUserID}`)
    }

    try {

        var commentElements = [...stats.comments].sort((a, b) => b.date - a.date).slice(0, commentsSlice).map(comment => {
            const date = new Date()
            const today = date.getTime()
            var timeValue
            const timeDiff = Math.floor(Math.abs(today - comment.date) / (1000 * 60 * 60))
            if (timeDiff < 1) {
                if (Math.floor(Math.abs(today - comment.date) / (1000 * 60)) === 0) {
                    timeValue = 'Hace menos de un minuto'
                } else if (Math.floor(Math.abs(today - comment.date) / (1000 * 60)) === 1) {
                    timeValue = '1 minuto'
                } else {
                    timeValue = `${Math.floor(Math.abs(today - comment.date) / (1000 * 60))} minutos`
                }
            } else if (timeDiff === 1) {
                timeValue = `${timeDiff} hora`
            } else if (timeDiff > 1 && timeDiff < 24) {
                timeValue = `${timeDiff} horas`
            } else if (Math.floor((timeDiff / 24)) === 1) {
                timeValue = `${Math.floor((timeDiff / 24))} día`
            } else if (Math.floor((timeDiff / 24)) > 1) {
                timeValue = `${Math.floor((timeDiff / 24))} días`
            }

            const likedByUser = comment.likedBy.includes(userID)

            var commentUser = commentedByUsers.filter(user => user.id === comment.userID)
            //console.log(commentUser)

            //const avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']

            var finalUserImage

            if (!commentUser[0]?.image) {
                finalUserImage = '../../../Images/user-icon.png'
            } else if (commentUser[0].image.split('.')[1] === '.png') {
                finalUserImage = `../../../Images/${commentUser[0].image}`
            } else {
                finalUserImage = commentUser[0].image
            }

            return (
                <div 
                key={stats.comments.indexOf(comment)} 
                className='comment-container'
                ref={stats.comments.indexOf(comment) === stats.comments.length - 1 ? lastComment : null}
                >
                    <div className='comment-user-content'>
                        <div className='comment-image-content'>
                            <img 
                            src={finalUserImage} 
                            alt='user' 
                            className='comment-user' 
                            onClick={() => selectUser(commentUser[0]?.username, commentUser[0]?.isTempUser)}
                            />
                            <p className='comment-content'>{comment.content}</p>
                        </div>
                        <div className='comment-date-delete'>
                            <p className='comment-date'>{timeValue}</p>
                            <img
                                src='../../Images/trash.png'
                                alt='delete'
                                className='trash-icon'
                                style={{ display: comment.userID === userID ? 'block' : 'none' }}
                                onClick={() => setCommentToDelete({ ID: comment._id, display: 'grid' })}
                            />
                        </div>
                    </div>
                    <div className='comment-like-reply'>
                        <p>{comment.likes}</p>
                        <img
                            src={likedByUser ? '../../Images/like2.png' : '../../Images/like.png'}
                            alt='like'
                            className='like-icon'
                            // onClick={(e) => handleLikeComment(e, stats.comments.indexOf(comment))}
                            onClick={(e) => handleLikeComment(e, comment._id)}
                        />
                        <button
                            type='button'
                            className='comment-reply'
                            onClick={handleReply}
                        >Responder</button>
                    </div>
                </div>
            )
        })

        //var avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']

        var currentUserImage

        //console.log(currentUser)

        if (!currentUser?.data?.image) {
            currentUserImage = '../../Images/user-icon.png'
        } else if (currentUser.data.image.split('.')[1] === 'png') {
            currentUserImage = `../../Images/${currentUser.data.image}`
        } else {
            currentUserImage = currentUser.data.image
        }

        return (
            <>
                <div id='coments-container' ref={commentsRef}>
                    <div id='all-comments'>
                        {stats.comments.length ? commentElements : <p>Aún no hay comentarios</p>}
                        <div id="loader" style={{display: !trueSuccess ? 'flex': 'none'}}>
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>
                        <button
                            type='button'
                            id='show-more-button'
                            onClick={() => {
                                handleCommentSlice(currentRecipe.id)
                            }}
                            style={{ display: trueSuccess && commentLength > commentsSlice ? 'block' : 'none' }}
                        >Mostrar más...</button>
                    </div>
                    <div id='picture-comment'>
                        <img src={currentUserImage} alt='user' />
                        <textarea
                            placeholder='Escribe un comentario'
                            onChange={handleChange}
                            value={userComment.content}
                            id='comment-body'
                            ref={replyRef}
                        />
                    </div>
                    <div id='comment-buttons'>
                        <button
                            style={{ display: displayCancel === 'none' ? 'block' : 'none' }}
                            type='button'
                            id='fake-cancel'
                            disabled
                        >Cancelar</button>
                        <button
                            style={{ display: displayCancel }}
                            type='button'
                            id='cancel'
                            onClick={handleCancel}
                        >Cancelar</button>
                        <button
                            type='button'
                            id='post'
                            onClick={handlePost}
                        >Publicar</button>
                    </div>
                    <div id='comment-loader-container' style={{
                        display: displayCommentLoader, 
                        top: displayCommentLoader === 'block' ? replyRef.current.offsetTop : '0px', 
                        left: displayCommentLoader === 'block' ? replyRef.current.offsetLeft : '0px'
                        }}>
                        <div id="comment-loader">
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
                </div>
                <div id='confirm-delete-container' style={{ display: commentToDelete.display }}>
                    <div id='confirm-delete'>
                        <p>¿Borrar comentario?</p>
                        <p>Esta acción no puede revertirse</p>
                        <div id='confirm-delete-buttons'>
                            <button type='button' id='cancel-delete' onClick={() => setCommentToDelete({ ID: '', display: 'none' })}>Cancelar</button>
                            <button type='button' id='do-delete' onClick={() => {
                                handleDeleteComment(commentToDelete.ID)
                                setCommentToDelete({ ID: '', display: 'none' })
                            }}>Borrar</button>
                        </div>
                    </div>
                </div>
            </>
        )

    } catch (err) {
        //console.log(err)
        return (
            <></>
        )
    }
}

export default Comments