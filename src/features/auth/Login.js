import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { setCredentials, selectCurrentToken } from '../auth/authSlice'
import { useLoginMutation, useVerifyUsernameMutation } from './authApiSlice'
import { useLogEntryMutation } from '../logs/logsApiSlice'
import { useUpdateUserMutation } from '../users/usersApiSlice'

const Login = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = 'Login'
        return () => document.title = prevTitle
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    const selectRef = useRef()

    const textRef = useRef()

    const [login, { isLoading }] = useLoginMutation()

    const [logEntry] = useLogEntryMutation()

    const [updateUser, {isSuccess}] = useUpdateUserMutation()

    const [verifyUsername] = useVerifyUsernameMutation()
 
    const isTemp = window.sessionStorage.getItem('isTemp')

    const tempId = window.localStorage.getItem('temp-id')
    //const tempId = 'test'

    const userRef = useRef()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        errMsg: '',
        persist: JSON.parse(localStorage.getItem("persist")) || false
    })

    const [displayVerify, setDisplayVerify] = useState('none')

    const [verifyUser, setVerifyUser] = useState('')

    const [verifyOption, setVerifyOption] = useState('prompt')

    const [userPromptAnimation, setUserPromptAnimation] = useState()

    const [displayRequireUser, setDisplayRequireUser] = useState({
        display: 'none',
        animation: '',
        message: ''
    })

    const [recipeOptions, setRecipeOptions] = useState()

    const [recipesToSelect, setRecipestoSelect] = useState()

    const [userToVerify, setUserToVerify] = useState()

    const [newPwd, setNewPwd] = useState('')

    const [confirmPwd, setConfirmPwd] = useState('')

    const [pwdMismatch, setPwdMismatch] = useState('none')

    const [displayPasswordMismatch, setDisplayPasswordMismatch] = useState({
        display: 'none',
        animation: '',
        message: ''
    })

    const [pwdSuccess, setPwdSuccess] = useState({
        display: 'none',
        animation: '',
        message: ''
    })

    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch()

    useEffect(() => {
        if (userRef.current) userRef.current.focus()
    }, [])

    useEffect(() => {
        setFormData((prevState) => {
            return {
                ...prevState,
                errMsg: ''
            }
        })
    }, [formData.username, formData.password])

    useEffect(() => {
        if (isTemp === 'n') {
            navigate('/dash')
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [isTemp, navigate])

    useEffect(() => {
        if (newPwd.length === confirmPwd.length && newPwd !== confirmPwd) {
            setPwdMismatch('block')
        } else {
            setPwdMismatch('none')
        }
    }, [newPwd, confirmPwd])

    useEffect(() => {
        if (isSuccess) {
            setNewPwd('')
            setConfirmPwd('')
        }
    }, [isSuccess])
    
    if (loading || isLoading) {
        return(
            <div style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeContent: 'center'
            }}>
                <img
                    src='../Images/favicon-gif.gif'
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ user: formData.username, pwd: formData.password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setFormData((prevState) => {
                return {
                    ...prevState,
                    username: '',
                    password: ''
                }
            })
            localStorage.setItem("persist", JSON.stringify(formData.persist))
            window.sessionStorage.setItem('isTemp', 'n')
            //console.log(jwtDecode(accessToken).UserInfo.id)
            //navigate('/dash')
        } catch (err) {
            console.log(err)
            //window.sessionStorage.setItem('isTemp', 'y')
            if (!err.originalStatus) {
                setDisplayPasswordMismatch(() => {
                    return {
                        display: 'grid',
                        animation: 'new-collection-in 0.2s linear 1',
                        message: "No server response"
                    }
                })
            } else if (err.originalStatus === 400) {
                setDisplayPasswordMismatch(() => {
                    return {
                        display: 'grid',
                        animation: 'new-collection-in 0.2s linear 1',
                        message: "Missing username or password"
                    }
                })
            } else if (err.originalStatus === 401) {
                setDisplayPasswordMismatch(() => {
                    return {
                        display: 'grid',
                        animation: 'new-collection-in 0.2s linear 1',
                        message: "Username or password incorrect"
                    }
                })
            } else {
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        errMsg: err.data?.message
                    }
                })
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        }
        )
    }

    const handlePersist = () => {
        setFormData((prevState) => {
            return {
                ...prevState,
                persist: !prevState.persist
            }
        })
    }

    const handleVerifyUser = (e) => {
        setVerifyUser(() => {
            return e.target.value
        })
    }

    const handleVerifyRecipe = () => {
        const selectedRecipe = recipesToSelect.filter(recipe => recipe.name === selectRef.current.value)
        if (selectedRecipe[0]?.createdBy === userToVerify) {
            setVerifyOption(() => {
                return 'new-pwd'
            })
            console.log(verifyOption)
        } else {
             setUserPromptAnimation(() => {
                 return 'new-collection-in 0.2s linear 1'
             })
             setVerifyOption(() => {
                 return 'failed'
             })
             setDisplayRequireUser((prevState) => {
                return {
                    ...prevState,
                    display: 'none',
                }
             })
        }
    }

    const handleVerify = async () => {
        if (verifyUser === '') {
            setDisplayRequireUser(() => {
                return {
                    display: 'grid',
                    animation: 'new-collection-in 0.2s linear 1',
                    message: 'Username is required'
                }
            })
        } else {
            setVerifyOption(() => {
                return 'loader'
            })
            const result = await verifyUsername({username: verifyUser, tempId: tempId})
            //console.log(result)
            if (result?.error?.originalStatus === 404) {
                setDisplayRequireUser(() => {
                    return {
                        display: 'grid',
                        animation: 'new-collection-in 0.2s linear 1',
                        message: 'No user found'
                    }
                })
            } else {
                setVerifyOption(() => {
                    let newOption
                    if (result?.data?.match === 'true') {
                        newOption = 'new-pwd'
                    } else {
                        setRecipeOptions(() => {
                            const optionElements = result?.data?.recipes.map(recipe => {
                                return (
                                    <option
                                    key={recipe._id}
                                    value={recipe.name}
                                >{recipe.name}</option >
                                )
                            })
                            optionElements.push(<option key={0} value="" readOnly>I haven't posted any recipes</option>)
                            return optionElements
                        })
                        setRecipestoSelect(() => {
                            return result?.data?.recipes
                        })
                        setUserToVerify(() => {
                            return result?.data?.foundUserID
                        })
                        newOption = 'unverified'
                    }
                    return newOption
                })
            }
        }
    }

    const handleNewPwd = (e) => {
        setNewPwd(e.target.value)
    }

    const handleConfirmPwd = (e) => {
        setConfirmPwd(e.target.value)
    }

    const handleCreatePwd = async () => {
        if (newPwd !== confirmPwd) {
            setDisplayPasswordMismatch(() => {
                textRef.current.style.setProperty('margin-left', '0px')
                return {
                    display: 'grid',
                    animation: 'new-collection-in 0.2s linear 1',
                    message: "Passwords don't match"
                }
            })
        } else {
            setVerifyOption('loader')
            await updateUser({
                userID: userID,
                image: '',
                country: '',
                about: '',
                pwd: newPwd,
                active: ''
            })
            setPwdSuccess(() => {
                return {
                    display: 'grid',
                    animation: 'new-collection-in 0.2s linear 1',
                    message: "Your password was updated. Please login again."
                }
            })
            setDisplayVerify('none')
            setVerifyOption('prompt')
            setNewPwd('')
            setConfirmPwd('')
            logEntry({ activity: 'pwd', recipeID: '', userID: userID })
        }
    }

    const content = (
        <section id='login-container'>
            <div id='login-title'>
                <h1>Login</h1>
            </div>
            <main id="login-form-container">
                <form id="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="form-input"
                        type="text"
                        id="username"
                        name="username"
                        ref={userRef}
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        placeholder='Enter your username'
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        className="form-input"
                        type="password"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                        placeholder='Enter your password'
                        autoComplete='off'
                    />
                    <p id='forgot-pwd' onClick={() => {
                        setDisplayVerify(() => {
                            return 'grid'
                        })
                        setUserPromptAnimation(() => {
                            return 'new-collection-in 0.2s linear 1'
                        })
                    }}>Forgot your password?</p>
                    <label htmlFor="persist" className="form-persist">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            id="persist"
                            onChange={handlePersist}
                            checked={formData.persist}
                        />
                        Stay connected
                    </label>
                    <button id="form-submit-button">Login</button>
                    <div id='create-account-container'>
                        <Link to="/signup">Not a member yet? Create new account</Link>
                    </div>
                </form>
                <div id='verify-account-container' style={{ display: displayVerify }}>
                    <div id='verify-username-container' style={{ display: verifyOption === 'prompt' ? 'grid' : 'none', animation: userPromptAnimation }}>
                        <p>Please enter your username: </p>
                        <input
                            className="form-input"
                            type="text"
                            id="verify-username"
                            name="verify-username"
                            value={verifyUser}
                            onChange={handleVerifyUser}
                            autoComplete="on"
                            required
                            placeholder='Your username'
                        />
                        <div id='verify-buttons-container'>
                            <button type='button' id='cancel-verify' onClick={() => {
                                setUserPromptAnimation(() => {
                                    return 'new-collection-out 0.2s linear 1'
                                })
                                setTimeout(() => {
                                    setDisplayVerify(() => {
                                        return 'none'
                                    })
                                    setVerifyUser(() => {
                                        return ''
                                    })
                                }, 150);
                            }}>Cancel</button>
                            <button type='button' id='verify-submit' onClick={handleVerify}>Send</button> {/*verify username matches tempId*/}
                        </div>
                    </div>
                    <div id='verify-loading' style={{ display: verifyOption === 'loader' ? 'grid' : 'none' }}>
                        <div className="lds-dual-ring"></div>
                    </div>
                    <div id='new-pwd-container' style={{ display: verifyOption === 'new-pwd' ? 'grid' : 'none', animation: userPromptAnimation }}>
                        <p>Please create a new password: </p>
                        <input
                            className="form-input"
                            type="password"
                            id="new-pwd"
                            name="new-pwd"
                            value={newPwd}
                            onChange={handleNewPwd}
                            autoComplete="off"
                            required
                            placeholder='New password'
                        />
                        <input
                            className="form-input"
                            type="password"
                            id="confirm-new-pwd"
                            name="confirm-new-pwd"
                            value={confirmPwd}
                            onChange={handleConfirmPwd}
                            autoComplete="off"
                            required
                            placeholder='Confirm new password'
                        />
                        <p style={{display: pwdMismatch, fontSize: '15px', marginTop: '-15px', marginBottom: '-10px', color: 'red'}}>Passwords don't match</p>
                        <div id='verify-buttons-container'>
                            <button type='button' id='cancel-verify' onClick={() => {
                                setUserPromptAnimation(() => {
                                    return 'new-collection-out 0.2s linear 1'
                                })
                                setTimeout(() => {
                                    setDisplayVerify(() => {
                                        return 'none'
                                    })
                                    setVerifyUser(() => {
                                        return ''
                                    })
                                    setVerifyOption(() => {
                                        return 'prompt'
                                    })
                                }, 150)
                            }}>Cancel</button>
                            <button type='button' id='verify-submit' onClick={handleCreatePwd}>Send</button>
                        </div>
                    </div>
                    <div id='unverified-container' style={{ display: verifyOption === 'unverified' ? 'grid' : 'none', animation: userPromptAnimation }}>
                        <p>We could not verify your identity.</p>
                        <p>Can you select a recipe posted by you?</p>
                        <select defaultValue='select' ref={selectRef}>
                            <option value='select' hidden readOnly>Please select</option>
                            {recipeOptions}
                        </select>
                        <div id='unverified-buttons'>
                            <button type='button' id='cancel-verify-recipe' onClick={() => {
                                setUserPromptAnimation(() => {
                                    return 'new-collection-out 0.2s linear 1'
                                })
                                setTimeout(() => {
                                    setDisplayVerify(() => {
                                        return 'none'
                                    })
                                    setVerifyUser(() => {
                                        return ''
                                    })
                                    setVerifyOption(() => {
                                        return 'prompt'
                                    })
                                }, 150)
                            }}>Cancel</button>
                            <button type='button' id='verify-recipe' onClick={handleVerifyRecipe}>Send</button>
                        </div>
                    </div>
                    <div id='failed' style={{ display: verifyOption === 'failed' ? 'grid' : 'none', animation: userPromptAnimation }}>
                        <p>Unfortunately, we are not able to verify your account right now.</p>
                        <Link to="/signup">Feel free to create a new account here ➜</Link>
                    </div>
                </div>
                <div id='require-username-container' style={{ display: displayRequireUser.display }}>
                    <div id='require-username' style={{ animation: displayRequireUser.animation }}>
                        <p>{displayRequireUser.message}</p>
                        <button type='button' onClick={() => {
                            setDisplayRequireUser((prevState) => {
                                return {
                                    ...prevState,
                                    animation: 'new-collection-out 0.2s linear 1'
                                }
                            })
                            setTimeout(() => {
                                setDisplayRequireUser((prevState) => {
                                    return {
                                        ...prevState,
                                        display: 'none'
                                    }
                                })
                            }, 150)
                            setVerifyOption(() => {
                                return 'prompt'
                            })
                        }}>Ok</button>
                    </div>
                </div>
                <div id='password-mismatch-container' style={{ display: displayPasswordMismatch.display }}>
                    <div id='password-mismatch' style={{ animation: displayPasswordMismatch.animation }}>
                        <p ref={textRef}>{displayPasswordMismatch.message}</p>
                        <button type='button' onClick={() => {
                            setDisplayPasswordMismatch((prevState) => {
                                return {
                                    ...prevState,
                                    animation: 'new-collection-out 0.2s linear 1'
                                }
                            })
                            setTimeout(() => {
                                setDisplayPasswordMismatch((prevState) => {
                                    return {
                                        ...prevState,
                                        display: 'none'
                                    }
                                })
                            }, 150)
                        }}>Ok</button>
                    </div>
                </div>
                <div id='password-success-container' style={{ display: pwdSuccess.display }}>
                    <div id='password-success' style={{ animation: pwdSuccess.animation }}>
                        <p>{pwdSuccess.message}</p>
                        <button type='button' onClick={() => {
                            setPwdSuccess((prevState) => {
                                return {
                                    ...prevState,
                                    animation: 'new-collection-out 0.2s linear 1'
                                }
                            })
                            setTimeout(() => {
                                setPwdSuccess((prevState) => {
                                    return {
                                        ...prevState,
                                        display: 'none'
                                    }
                                })
                            }, 150)
                        }}>Ok</button>
                    </div>
                </div>
            </main>
            <div id='back-container'>
                <Link to="/">Back to Home</Link>
            </div>
        </section>
    )

    return content
}
export default Login
