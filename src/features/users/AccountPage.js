import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import jwtDecode from 'jwt-decode'
import { useGetUserDataMutation, useUpdateUserMutation } from './usersApiSlice'
import flags from '../../config/flags'
import { useLogEntryMutation } from '../logs/logsApiSlice'
import { useSendLogoutMutation } from "../auth/authApiSlice"
import LoadingIcon from "../../components/LoadingIcon"

const AccountPage = () => {

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const lgoff = window.localStorage.getItem('lgoff')

    const [sendLogout] = useSendLogoutMutation()

    const avatarRef = useRef()

    const [getUserData] = useGetUserDataMutation()

    const [updateUser] = useUpdateUserMutation()

    const [logEntry] = useLogEntryMutation()

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.username : window.localStorage.getItem('temp-id')

    const [currentUser, setCurrentUser] = useState()

    const [currentAnimation, setCurrentAnimation] = useState('')

    const [fieldToEdit, setFieldToEdit] = useState({
        image: 'none',
        country: 'none',
        about: 'none',
        pwd: 'none',
        delete: 'none'
    })

    const [pictureElement, setPictureElement] = useState()

    //const [avatar, setAvatar] = useState([])

    const [currentUserImage, setCurrentUserImage] = useState()

    const [currentUserCountry, setCurrentUserCountry] = useState()

    const [currentUserAbout, setCurrentUserAbout] = useState()

    const [currentUserPwd, setCurrentUserPwd] = useState('')

    const [currentUserPwdConfirm, setCurrentUserPwdConfirm] = useState('')

    const [displayDelete, setDisplayDelete] = useState('none')

    const [pwdMismatch, setPwdMismatch] = useState('none')

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserData({ userID: userID })
            //console.log(userData)
            setCurrentUser(() => {
                return userData.data
            })
            setCurrentUserImage(() => {
                let finalImage
                //const avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']
                if (!userData?.data?.image) {
                    finalImage = '../../Images/user-icon.png'
                } else if (userData.data.image.split('.')[1] === 'png') {
                    finalImage = `../../Images/${userData.data.image}`
                } else {
                    finalImage = userData.data.image
                }
                return finalImage
            })
            setCurrentUserAbout(() => {
                return userData?.data?.about
            })
        }
        fetchUser()
    }, [getUserData, userID])

    useEffect(() => {
        if (currentUserPwd.length === currentUserPwdConfirm.length && currentUserPwd !== currentUserPwdConfirm) {
            setPwdMismatch(() => {
                return 'block'
            })
        } else {
            setPwdMismatch(() => {
                return 'none'
            })
        }
    }, [currentUserPwd, currentUserPwdConfirm])

    const handleRemovePicture = () => {
        setPictureElement(() => {
            return (
                <></>
            )
        })
        setCurrentUserImage(() => {
            let finalImage
            //const avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']
            if (!currentUser.image) {
                finalImage = '../../Images/user-icon.png'
            } else if (currentUser.image.split('.')[1] === 'png') {
                finalImage = `../../Images/${currentUser.image}`
            } else {
                finalImage = currentUser.image
            }
            return finalImage
        })
    }

    function handleNewPicture(e) {
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            setPictureElement(() => {
                return (
                    <div className="account-image-thumbnail">
                        <img
                            src={reader.result}
                            alt=''
                        />
                        <div className="account-X-container">
                            <p
                                onClick={handleRemovePicture}
                            >✖</p>
                        </div>
                    </div>
                )
            })
            setCurrentUserImage(() => {
                return reader.result
            })
        }
        reader.onerror = (error) => {
            console.log('Error: ', error)
        }
        avatarRef.current.classList.remove('selected-avatar')
    }

    const handleAvatar = (e) => {
        avatarRef.current.classList.remove('selected-avatar')
        avatarRef.current = e.target
        e.target.classList.add('selected-avatar')
        setCurrentUserImage(() => {
            return `../../Images/${e.target.name}.png`
        })
    }

    const handleCountry = (e) => {
        setCurrentUserCountry(() => {
            return e.target.value
        })
    }

    const handleIntro = (e) => {
        setCurrentUserAbout(() => {
            return e.target.value
        })
    }

    const handlePwd = (e) => {
        setCurrentUserPwd(() => {
            return e.target.value
        })
    }

    const handlePwdConfirm = (e) => {
        setCurrentUserPwdConfirm(() => {
            return e.target.value
        })
    }

    const handleDisplayDelete = () => {
        setDisplayDelete(() => {
            return 'grid'
        })
    }

    const handleUpdateImage = () => {
        if (fieldToEdit.image === 'none') {
            setFieldToEdit((prevState) => {
                return {
                    ...prevState,
                    image: 'grid'
                }
            })
            setCurrentAnimation(() => {
                return 'before-update 0.2s linear 1'
            })
        } else {
            setCurrentAnimation(() => {
                return 'after-update 0.2s linear 1'
            })
            setTimeout(() => {
                setFieldToEdit((prevState) => {
                    return {
                        ...prevState,
                        image: 'none'
                    }
                })
            }, 150)
            setCurrentUserImage(() => {
                let finalImage
                //const avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']
                if (!currentUser.image) {
                    finalImage = '../../Images/user-icon.png'
                } else if (currentUser.image.split('.')[1] === 'png') {
                    finalImage = `../../Images/${currentUser.image}`
                } else {
                    finalImage = currentUser.image
                }
                return finalImage
            })
        }
    }

    const handleUpdateCountry = () => {
        if (fieldToEdit.country === 'none') {
            setFieldToEdit((prevState) => {
                return {
                    ...prevState,
                    country: 'grid'
                }
            })
            setCurrentAnimation(() => {
                return 'before-update 0.2s linear 1'
            })
        } else {
            setCurrentAnimation(() => {
                return 'after-update 0.2s linear 1'
            })
            setTimeout(() => {
                setFieldToEdit((prevState) => {
                    return {
                        ...prevState,
                        country: 'none'
                    }
                })
            }, 150)
            setCurrentUserCountry(() => {
                return ''
            })
        }
    }

    const handleUpdateAbout = () => {
        if (fieldToEdit.about === 'none') {
            setFieldToEdit((prevState) => {
                return {
                    ...prevState,
                    about: 'grid'
                }
            })
            setCurrentAnimation(() => {
                return 'before-update 0.2s linear 1'
            })
        } else {
            setCurrentAnimation(() => {
                return 'after-update 0.2s linear 1'
            })
            setTimeout(() => {
                setFieldToEdit((prevState) => {
                    return {
                        ...prevState,
                        about: 'none'
                    }
                })
            }, 150)
            setCurrentUserAbout(() => {
                return currentUser.about
            })
        }
    }

    const handleUpdatePwd = () => {
        if (fieldToEdit.pwd === 'none') {
            setFieldToEdit((prevState) => {
                return {
                    ...prevState,
                    pwd: 'grid'
                }
            })
            setCurrentAnimation(() => {
                return 'before-update 0.2s linear 1'
            })
        } else {
            setCurrentAnimation(() => {
                return 'after-update 0.2s linear 1'
            })
            setTimeout(() => {
                setFieldToEdit((prevState) => {
                    return {
                        ...prevState,
                        pwd: 'none'
                    }
                })
            }, 150)
            setCurrentUserPwd(() => {
                return ''
            })
            setCurrentUserPwdConfirm(() => {
                return ''
            })
        }
    }

    const handleUpdateDelete = () => {
        if (fieldToEdit.delete === 'none') {
            setFieldToEdit((prevState) => {
                return {
                    ...prevState,
                    delete: 'grid'
                }
            })
            setCurrentAnimation(() => {
                return 'before-update 0.2s linear 1'
            })
        } else {
            setCurrentAnimation(() => {
                return 'after-update 0.2s linear 1'
            })
            setTimeout(() => {
                setFieldToEdit((prevState) => {
                    return {
                        ...prevState,
                        delete: 'none'
                    }
                })
            }, 150)
        }
    }

    const handleSaveNewPicture = async () => {
        await updateUser({
            userID: userID,
            image: currentUserImage,
            country: '',
            about: '',
            pwd: '',
            active: ''
        })
        if (lgoff === 'n') logEntry({ activity: 'image', recipeID: '', userID: userID })
        window.location.reload()
    }

    const handleSaveNewCountry = async () =>{
        await updateUser({
            userID: userID,
            image: '',
            country: currentUserCountry,
            about: '',
            pwd: '',
            active: ''
        })
        if (lgoff === 'n') logEntry({ activity: 'country', recipeID: '', userID: userID })
        window.location.reload()
    }

    const handleSaveNewIntro = async () => {
        await updateUser({
            userID: userID,
            image: '',
            country: '',
            about: currentUserAbout,
            pwd: '',
            active: ''
        })
        if (lgoff === 'n') logEntry({ activity: 'about', recipeID: '', userID: userID })
        window.location.reload()
    }

    const handleSaveNewPwd = async() => {
        if (currentUserPwd === currentUserPwdConfirm) {
            await updateUser({
                userID: userID,
                image: '',
                country: '',
                about: '',
                pwd: currentUserPwd,
                active: ''
            })
            if (lgoff === 'n') logEntry({ activity: 'pwd', recipeID: '', userID: userID })
            window.location.reload()
        }
    }

    const handleDeleteAccount = async () => {
        sendLogout()
        await updateUser({
            userID: userID,
            image: '',
            country: '',
            about: '',
            pwd: '',
            active: 'false'
        })
        window.sessionStorage.setItem('deleted', 'y')
        navigate('/dash/user/deleted')
    }

    try {

        const allCountries = []

        for (let i = 0; i < flags.length; i++) {
            allCountries.push(flags[i].country)
        }

        const countryOptions = allCountries.sort().map(country => {
            return (
                <option
                    key={country}
                    value={country}
                > {country}</option >
            )
        })

        return (
            <>
                <div id="edit-user-container">
                    <div id="account-container">
                        <h1 id="edit-user-title">Your Account</h1>
                        <p className="account-option" onClick={() => navigate(`/user/${userID}`)}>View your public profile ➜</p>
                        <p className="account-option" onClick={handleUpdateImage}>Update your profile picture ➜</p>
                        <p className="account-option" onClick={handleUpdateCountry}>Update your country ➜</p>
                        <p className="account-option" onClick={handleUpdateAbout}>Update your introduction ➜</p>
                        <p className="account-option" onClick={handleUpdatePwd}>Reset your password ➜</p>
                        <p className="account-option" id="delete-page" onClick={handleUpdateDelete}>Delete your account <span style={{ fontSize: '18px' }}>✖</span></p>
                    </div>
                </div>
                {/* image */}
                <div className="update-field-container" style={{ display: fieldToEdit.image }}>
                    <div className="account-content-container" style={{ animation: currentAnimation }}>
                        <img src={currentUserImage} alt="" id="account-current-image"/>
                        <p id="account-image-prompt">Select a new avatar:</p>
                        <div id="account-avatars-imgs-container">
                            <img ref={avatarRef} src="../../Images/avatar1.png" alt="avatar1" name="avatar1" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar2.png" alt="avatar2" name="avatar2" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar3.png" alt="avatar3" name="avatar3" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar4.png" alt="avatar4" name="avatar4" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar5.png" alt="avatar5" name="avatar5" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar6.png" alt="avatar6" name="avatar6" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar7.png" alt="avatar7" name="avatar7" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar8.png" alt="avatar8" name="avatar8" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar9.png" alt="avatar9" name="avatar9" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar10.png" alt="avatar10" name="avatar10" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar11.png" alt="avatar11" name="avatar11" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar12.png" alt="avatar12" name="avatar12" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar13.png" alt="avatar13" name="avatar13" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar14.png" alt="avatar14" name="avatar14" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar15.png" alt="avatar15" name="avatar15" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar16.png" alt="avatar16" name="avatar16" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar17.png" alt="avatar17" name="avatar17" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar18.png" alt="avatar18" name="avatar18" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar19.png" alt="avatar19" name="avatar19" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar20.png" alt="avatar20" name="avatar20" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar21.png" alt="avatar21" name="avatar21" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar22.png" alt="avatar22" name="avatar22" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar23.png" alt="avatar23" name="avatar23" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                            <img src="../../Images/avatar24.png" alt="avatar24" name="avatar24" className="account-signup-avatar" onClick={(e) => handleAvatar(e)} />
                        </div>
                        <div id="account-image">
                            <label className="account-image-input">Or upload a profile image:</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    handleNewPicture(e)
                                }}
                                id="new-account-image"
                            />
                        </div>
                        <div id="account-pictures-preview">
                            {pictureElement}
                        </div>
                        <div className="account-buttons-container">
                            <button type="button" onClick={handleUpdateImage} className="account-cancel-button">Cancel</button>
                            <button type="button" className="account-save-button" onClick={handleSaveNewPicture}>Save changes</button>
                        </div>
                    </div>
                </div>
                {/* country */}
                <div className="update-field-container" style={{ display: fieldToEdit.country }}>
                    <div className="account-content-container" style={{ animation: currentAnimation }}>
                        <div id="account-current-country">
                            <p>Your country:</p>
                            <p>{currentUser.country}</p>
                        </div>
                        <label id="account-country-prompt">Select a new country:</label>
                        <select
                            id='account-country'
                            value={currentUserCountry}
                            name='country'
                            onChange={handleCountry}
                        >
                            <option value="" hidden readOnly>Please select</option>
                            {countryOptions}
                        </select>
                        <div className="account-buttons-container">
                            <button type="button" onClick={handleUpdateCountry} className="account-cancel-button">Cancel</button>
                            <button type="button" className="account-save-button" onClick={handleSaveNewCountry}>Save changes</button>
                        </div>
                    </div>
                </div>
                {/* about */}
                <div className="update-field-container" style={{ display: fieldToEdit.about }}>
                    <div className="account-content-container" style={{ animation: currentAnimation }}>
                        <div id="account-about-container">
                            <label className="new-user-form-input">Your introduction:</label>
                            <textarea
                                onChange={(e) => handleIntro(e)}
                                name='aboutYou'
                                value={currentUserAbout}
                                id='account-about'
                            />
                        </div>
                        <div className="account-buttons-container">
                            <button type="button" onClick={handleUpdateAbout} className="account-cancel-button">Cancel</button>
                            <button type="button" className="account-save-button" onClick={handleSaveNewIntro}>Save changes</button>
                        </div>
                    </div>
                </div>
                {/* pwd */}
                <div className="update-field-container" style={{ display: fieldToEdit.pwd }}>
                    <div className="account-content-container" style={{ animation: currentAnimation }}>
                        <div id="account-password-container">
                            <div id="account-enter-password">
                                <label htmlFor="password" className="account-password-label">Enter a new password:</label>
                                <input
                                    className="account-input"
                                    type="password"
                                    id="account-password"
                                    name="password"
                                    onChange={(e) => handlePwd(e)}
                                    value={currentUserPwd}
                                    required
                                    placeholder='Enter a new password'
                                    autoComplete='off'
                                />
                            </div>
                            <div id="account-password-confirm">
                                <label htmlFor="confirm-password" className="account-password-label">Confirm password:</label>
                                <input
                                    className="account-input"
                                    type="password"
                                    id="account-confirm-password"
                                    name="confirm-password"
                                    onChange={(e) => handlePwdConfirm(e)}
                                    value={currentUserPwdConfirm}
                                    required
                                    placeholder='Confirm password'
                                    autoComplete='off'
                                />
                            </div>
                            <div id="pwd-mismatch-container">
                                <p id="mismatch-label" style={{ display: pwdMismatch }}>Passwords don't match</p>
                            </div>
                        </div>
                        <div className="account-buttons-container">
                            <button type="button" onClick={handleUpdatePwd} className="account-cancel-button">Cancel</button>
                            <button type="button" className="account-save-button" onClick={handleSaveNewPwd}>Save changes</button>
                        </div>
                    </div>
                </div>
                {/* delete */}
                <div className="update-field-container" style={{ display: fieldToEdit.delete }}>
                    <div className="account-content-container" style={{ animation: currentAnimation }}>
                        <p id="account-delete-prompt">Are you sure you want to delete your account?</p>
                        <div className="account-buttons-container">
                            <button type="button" onClick={handleUpdateDelete} className="account-cancel-button">Cancel</button>
                            <button type="button" className="account-save-button" onClick={handleDisplayDelete}>Delete account</button>
                        </div>
                    </div>
                </div>
                <div id="account-delete-container" style={{display: displayDelete}}>
                    <div id='account-confirm-delete'>
                        <p>Delete account?</p>
                        <p>Please note this action cannot be reversed</p>
                        <div id='account-confirm-delete-buttons'>
                            <button type='button' id='cancel-delete' onClick={() => setDisplayDelete(() => {
                                return 'none'
                            })}>Cancel</button>
                            <button type='button' id='do-delete' onClick={handleDeleteAccount}>Delete</button>
                        </div>
                    </div>
                </div>
            </>
        )
    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc='../../Images/favicon-gif.gif'/>
        )
    }
}

export default AccountPage