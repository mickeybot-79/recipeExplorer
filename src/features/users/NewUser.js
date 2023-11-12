import { useState, useEffect, useRef } from "react"
import { useDispatch } from 'react-redux'
import { setCredentials } from '../auth/authSlice'
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Prompt } from '../../hooks/useOnUnsaved'
import flags from '../../config/flags'
import { useLoginMutation } from '../auth/authApiSlice'

const NewUser = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const isTemp = window.sessionStorage.getItem('isTemp')

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    useEffect(() => {
        if (isTemp === 'n') {
            navigate('/dash')
        }
    }, [isTemp, navigate])

    const avatarRef = useRef()

    const [login] = useLoginMutation()

    let [isBlocking, setIsBlocking] = useState(false)

    const tempId = window.localStorage.getItem('temp-id')

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm: '',
        country: '',
        aboutYou: ''
    })

    const [pictures, setPictures] = useState([])

    const [avatar, setAvatar] = useState([])

    const [displayMissing, setDisplayMissing] = useState('none')

    const [missingMessage, setMissingMessage] = useState()

    const [pwdMismatch, setPwdMismatch] = useState('none')
    
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const [addNewUser, {
        isLoading,
        isSuccess
    }] = useAddNewUserMutation()

    useEffect(() => {
        if (isSuccess) {
            setFormData({
                username: '',
                password: '',
                confirm: '',
                country: '',
                aboutYou: ''
            })
            navigate('/dash')
        }
    }, [isSuccess, navigate])

    useEffect(() => {
        if (formData.password.length === formData.confirm.length && formData.password !== formData.confirm) {
            setPwdMismatch(() => {
                return 'block'
            })
        } else {
            setPwdMismatch(() => {
                return 'none'
            })
        }
    }, [formData])

    const allCountries = []

    for (let i = 0; i < flags.length; i++) {
        allCountries.push(flags[i].country)
    }

    const options = allCountries.sort().map(country => {
        return (
            <option
                key={country}
                value={country}
            > {country}</option >
        )
    })

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prevFormData) => {
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

    const picReady = pictures.length || avatar ? true : false

    const canSave = [formData.username, formData.password, formData.country, picReady].every(Boolean) && !isLoading && !formData.username.includes(' ')

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setIsBlocking(false)
        if (canSave) {
            const result = await addNewUser({
                user: formData.username,
                pwd: formData.password,
                country: formData.country,
                about: formData.aboutYou,
                image: !pictures[0]?.length ? avatar.concat('.png') : pictures[0],
                tempId: tempId
            })
            if (result?.error?.originalStatus === 409) {
                setMissingMessage(() => {
                    return 'Username already exists'
                })
                setDisplayMissing(() => {
                    return 'grid'
                })
                setIsBlocking(true)
                setLoading(false)
            } else {
                window.sessionStorage.setItem('isTemp', 'n')
                const { accessToken } = await login({ user: formData.username, pwd: formData.password }).unwrap()
                dispatch(setCredentials({ accessToken }))
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        username: '',
                        password: ''
                    }
                })
                localStorage.setItem("persist", false)
                setLoading(false)
                setTimeout(() => {
                    navigate('/dash')
                }, 500)
            }
        } else if (!formData.username) {
            setMissingMessage(() => {
                return 'Username is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (formData.username.includes(' ')) {
            setMissingMessage(() => {
                return 'Username must not include spaces'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (!formData.password) {
            setMissingMessage(() => {
                return 'Password is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (formData.password !== formData.confirm) {
            setMissingMessage(() => {
                return "Passwords don't match"
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (!formData.country) {
            setMissingMessage(() => {
                return 'Country is needed'
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        } else if (!avatar && !pictures.length) {
            setMissingMessage(() => {
                return "Please select an avatar"
            })
            setDisplayMissing(() => {
                return 'grid'
            })
        }
        setLoading(true)
    }

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
                    >X</p>
                </div>
            </div>
        ))
    }

    function handleNewPicture(e) {
        if (pictures.length < 3) {
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
            setAvatar(() => {
                avatarRef.current.classList.remove('selected-avatar')
                return []
            })
        }
    }

    const handleAvatar = (e) => {
        setAvatar(() => {
            avatarRef.current.classList.remove('selected-avatar')
            avatarRef.current = e.target
            e.target.classList.add('selected-avatar')
            return e.target.name
        })
    }

    return (
        <>
            <div id="new-user-container">
                <h1 id='new-user-title'>Create an account</h1>
                <form onSubmit={handleSubmit} id="new-user-form">
                    <label className="new-user-form-input">Username:</label>
                    <input
                        type='text'
                        placeholder='Enter a username'
                        onChange={handleChange}
                        name='username'
                        value={formData.username}
                        id="username"
                        className="new-user-form-value"
                    />
                    <label className="new-user-form-input">Password:</label>
                    <input
                        type='password'
                        placeholder='Enter a password'
                        onChange={handleChange}
                        name='password'
                        value={formData.password}
                        id="password"
                        className="new-user-form-value"
                    />
                    <label className="new-user-form-input">Confirm Password:</label>
                    <input
                        type='password'
                        placeholder='Confirm password'
                        onChange={handleChange}
                        name='confirm'
                        value={formData.confirm}
                        id="confirm"
                        className="new-user-form-value"
                    />
                    <div id="pwd-mismatch-container" style={{marginLeft: '10px'}}>
                        <p id="mismatch-label" style={{ display: pwdMismatch, marginRight: '0px' }}>Passwords don't match</p>
                    </div>
                    <label className="new-user-form-input">What country are you from?</label>
                    <select
                        id='countries'
                        value={formData.country}
                        name='country'
                        onChange={handleChange}
                    >
                        <option value="" hidden readOnly>Please select</option>
                        {options}
                    </select>
                    <label className="new-user-form-input">Tell us something about you:</label>
                    <textarea
                        placeholder='Add a funny introduction'
                        onChange={handleChange}
                        name='aboutYou'
                        value={formData.aboutYou}
                        id='about'
                    />
                    <div id="avatar-container">
                        <p id="avatar-prompt">Choose an avatar:</p>
                        <div id="avatars-imgs-container">
                            <img ref={avatarRef} src="../../Images/avatar1.png" alt="avatar1" name="avatar1" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar2.png" alt="avatar2" name="avatar2" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar3.png" alt="avatar3" name="avatar3" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar4.png" alt="avatar4" name="avatar4" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar5.png" alt="avatar5" name="avatar5" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar6.png" alt="avatar6" name="avatar6" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar7.png" alt="avatar7" name="avatar7" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar8.png" alt="avatar8" name="avatar8" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar9.png" alt="avatar9" name="avatar9" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar10.png" alt="avatar10" name="avatar10" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar11.png" alt="avatar11" name="avatar11" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar12.png" alt="avatar12" name="avatar12" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar13.png" alt="avatar13" name="avatar13" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar14.png" alt="avatar14" name="avatar14" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar15.png" alt="avatar15" name="avatar15" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar16.png" alt="avatar16" name="avatar16" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar17.png" alt="avatar17" name="avatar17" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar18.png" alt="avatar18" name="avatar18" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar19.png" alt="avatar19" name="avatar19" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar20.png" alt="avatar20" name="avatar20" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar21.png" alt="avatar21" name="avatar21" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar22.png" alt="avatar22" name="avatar22" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar23.png" alt="avatar23" name="avatar23" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar24.png" alt="avatar24" name="avatar24" className="signup-avatar" onClick={(e) => handleAvatar(e)} />
                        </div>
                    </div>
                    <div id="pictures-container">
                        <div id="pictures-input">
                            <label className="new-recipe-form-input">Or upload a profile image:</label>
                            <input
                                type="file"
                                onChange={handleNewPicture}
                                id="new-recipe-pictures"
                            />
                        </div>
                        <div id="pictures-preview">
                            {pictureElements}
                        </div>
                    </div>
                    <button id="new-user-submit">Create account</button>
                    <div id='login-option-container'>
                        <Link to="/login">Already a member? Login here</Link>
                    </div>
                </form>
                <div id='missing-login-data' style={{ display: displayMissing }}>
                    <div id='missing-login-container'>
                        <p id="missing-login">{missingMessage}</p>
                        <button type='button' id='ok-login' onClick={() => {
                            setDisplayMissing('none')
                            setLoading(false)
                        }}>Ok</button>
                    </div>
                </div>
            </div>
            <div id='signup-loading' style={{ display: loading ? 'grid' : 'none' }}>
                <div className="signup-lds-dual-ring" style={{ padding: '100px', width: '300px', height: '300px' }}></div>
            </div>
            <Prompt when={isBlocking}
                message="Would you like to exit without saving?"
                beforeUnload={true}
            />
        </>
    )
}

export default NewUser