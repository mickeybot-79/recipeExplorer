import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { useSendLogoutMutation, useTempLoginMutation } from "../features/auth/authApiSlice"
import { useGetUserDataMutation } from '../features/users/usersApiSlice'
import jwtDecode from 'jwt-decode' 

const PageHeader = () => {

    const navigate = useNavigate()
    const isTemp = window.sessionStorage.getItem('isTemp')
    const token = useSelector(selectCurrentToken)
    var logged = isTemp === 'n' ? true : false
    var userName = token ? jwtDecode(token).UserInfo.username : ''

    var userID = token ? jwtDecode(token).UserInfo._id : window.localStorage.getItem('temp-id')

    const [tempLogin] = useTempLoginMutation()

    const [getUserData] = useGetUserDataMutation()

    const doLogin = async (userID) => {
        try {
            //console.log('sending tempLogin')
            await tempLogin({ userID: userID }).unwrap()
        } catch (err) {
            console.log('error on tempLogin', err)
        }
    }

    const [display, setDisplay] = useState()

    const [currentUser, setCurrentUser] = useState()

    const [displayDots, setDisplayDots] = useState(window.innerWidth < 600 ? 'inline' : 'none')

    const [displayDotOptions, setDisplayDotOptions] = useState('none')

    const [displayLngChoice, setDisplayLngChoice] = useState('none')

    const currentLocation = useLocation()

    const [sendLogout, {
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess ) navigate('/')
        if (!token) setDisplay('none')
    }, [isSuccess, navigate, token])

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserData({userID: userName})
            setCurrentUser(() => {
                return userData
            })
        }
        fetchUser()
    }, [getUserData, userName])

    useEffect(() => {
        if (window.innerWidth < 700) {
            setDisplayDots('inline')
        } else {
            setDisplayDots('none')
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth < 700) {
                setDisplayDots('inline')
            } else {
                setDisplayDots('none')
            }
        })
    }, [])


    // const iconRef = useRef()

    // useEffect(() => {
    //     function testImage(URL) {
    //         var tester=new Image()
    //         tester.onerror = imageNotFound
    //         tester.src=URL
    //     }
        
    //     function imageNotFound() {
    //         alert('That image was not found.')
    //         window.location.reload()
    //     }
        
    //     if (iconRef.current?.src) {
    //         console.log(iconRef.current.src)
    //         testImage(iconRef.current.src)
    //     }
    // }, [iconRef])

    var content

    try {
        let mainIcon = (
            <img
                src={'../Images/favicon.png'}
                alt= 'icon'
                style={{width:'40px'}}
                className="header-option"
                id='header-icon'
                onClick={() => navigate('/') }
                // onError={(error) => {
                //     console.log(error)
                //     setTimeout(() => {
                //         //window.location.reload()
                //     }, 500)
                // }}
            />
        )

        //console.log(mainIcon)
        //if (!mainIcon) window.location.reload()

        let threeDots = (
            <img
                src='../Images/three-dots.png'
                alt='icon'
                style={{ display: displayDots, width: '40px'}}
                onMouseOver={() => {
                    console.log(displayDotOptions)
                    setDisplayDotOptions((prevState) => {
                    return prevState === 'none' ? 'block' : 'none'
                })
                }}
                onMouseLeave={() => setDisplayDotOptions(() => {
                    return window.innerWidth < 700 ? 'none' : 'block'
                })}
                id='header-dots'
            />
        )

        let dotOptions = (
            <div id='dot-options' style={{display: displayDotOptions}} onMouseLeave={() => setDisplayDotOptions('none')}>
                <p
                    onClick={() => {
                        setDisplayDotOptions('none')
                        navigate('/recipes/best')
                    }}
                    className='dot-option'>People's Favorites</p>
                <p
                    onClick={() => {
                        setDisplayDotOptions('none')
                        navigate('/recipes/newest')
                    }}
                    className='dot-option'>Recently Added</p>
                <p
                    onClick={() => {
                        setDisplayDotOptions('none')
                        navigate('/recipes/new')
                    }}
                    className='dot-option'>Share a Recipe</p>
            </div>
        )
    
        let peoplesFavorites = (
            <button
                className="header-option"
                onClick={() => navigate('/recipes/best')}
                style={{ display: displayDots === 'inline' ? 'none' : 'inline'}}
            >People's Favorites
            </button>
        )
    
        let recentlyAdded = (
            <button
                className="header-option"
                onClick={() => navigate('/recipes/newest')}
                style={{ display: displayDots === 'inline' ? 'none' : 'inline'}}
            >Recently Added
            </button>
        )
    
        let shareOption = (
            <button
                className="header-option"
                onClick={() => navigate('/recipes/new')}
                style={{ display: displayDots === 'inline' ? 'none' : 'inline'}}
            >Share a Recipe
            </button>
        )

        let flagIcon = (
            <div id='flag-icon' onMouseOver={() => {
                setDisplayLngChoice((prevState) => {
                    //return prevState === 'none' ? 'block' : 'none'
                    return 'block'
                })
            }}
                onMouseLeave={() => setDisplayLngChoice(() => {
                    return window.innerWidth < 700 ? 'none' : 'block'
                })}
            >
                <img src={`../Images/UK.jpg`} alt='flag' />
                <p>EN</p>
            </div>
        )

        let lngChoice = (
            <div id='flag-choice' style={{display: displayLngChoice}} onMouseOver={() => setDisplayLngChoice('block')} onMouseLeave={() => setDisplayLngChoice('none')}>
                <div id='EN-option' onClick={() => {
                    window.localStorage.setItem('usrlng', 'en')
                    if (currentLocation.pathname.includes('/es')) {
                        navigate(`/${currentLocation.pathname}`)
                        window.location.reload()
                    }
                    setDisplayLngChoice('none')
                }}>
                    <img src='../Images/UK.jpg' alt='UK' className='flag-option'/>
                    <p>English</p>
                </div>
                <div id='ES-option' onClick={() => {
                    window.localStorage.setItem('usrlng', 'es')
                    if (!currentLocation.pathname.includes('/es')) {
                        navigate(`/es${currentLocation.pathname}`)
                        window.location.reload()
                    }
                    setDisplayLngChoice('none')
                }}>
                    <img src='../Images/Spain.jpg' alt='SP' className='flag-option'/>
                    <p>Español</p>
                </div>
            </div>
        )
    
        let searchIcon = (
            <img
                src='../Images/search.png'
                alt= 'icon'
                style={{width:'45px', height: '45px'}}
                className="header-option"
                id='header-search-icon'
                onClick={() => navigate('/search')}
            />
        )
    
        let loginOption 
        if (!logged) {
            loginOption = (
                <button
                    className="header-option"
                    id='login'
                    onClick={() => navigate('/login')}
                    style={{zIndex: '10'}}
                >Login
                </button>
            )
        }
    
        let useIcon
        if (logged) {
            var finalImage
            if (!currentUser.data.image) {
                finalImage = '../../Images/user-icon.png'
            } else if (currentUser.data.image.split('.')[1] === 'png') {
                finalImage = `../../Images/${currentUser.data.image}`
            } else {
                finalImage = currentUser.data.image
            }
            useIcon = (
                <img
                    src={finalImage}
                    alt='user icon'
                    id='user-icon'
                    onMouseOver={() => setDisplay('grid')}
                    onMouseLeave={() => setDisplay('none')}
                />
            )
        }
    
        let userOptions
        if (logged) {
            userOptions = (
                <div 
                id='user-options' 
                style={{display: `${display}`}}
                onMouseOver={() => setDisplay('grid')}
                onMouseLeave={() => setDisplay('none')}>
                    <button
                        className="header-option-icon"
                        onClick={() => navigate('/dash')}
                    >Dashboard
                    </button>
                    <button
                        className="header-option-icon"
                        onClick={() => navigate('/dash/account')}
                    >Account
                    </button>
                    <button
                        className="header-option-icon"
                        onClick={() => {
                            sendLogout()
                            doLogin(userID)
                            window.sessionStorage.setItem('isTemp', 'y')
                            window.localStorage.setItem('persist', 'false')
                            if (currentLocation.pathname !== '/') {
                                setTimeout(() => {
                                    navigate('/')
                                }, 100)
                            } else {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 100)
                            }
                        }}
                    >Logout
                    </button>
                </div>
            )
        }
    
        const errClass = isError ? "errmsg" : "offscreen"
    
        let optionsContent = (
            <>
                <div id='favorites'>
                    {mainIcon}
                    {threeDots}
                    {peoplesFavorites}
                    {recentlyAdded}
                    {shareOption}
                    {flagIcon}
                </div>
                {dotOptions}
                {lngChoice}
                <div id='search-account'>  
                    {searchIcon}
                    {loginOption}
                    <div 
                    id='display-element'
                    onMouseOver={() => setDisplay('grid')}
                    onMouseLeave={() => setDisplay('none')}
                    style={{display: logged ? 'block' : 'none'}}
                    >
                        {useIcon}
                        {userOptions}
                    </div>
                </div>
            </>
        )

        content = (
            <>
                <p className={errClass}>{error?.data?.message}</p>
    
                <header id="page-header">
                    <div id="header-container">
                        {optionsContent}
                    </div>
                </header>
            </>
        )
    } catch {
        content = (
            <></>
        )
    }

    return content

}
export default PageHeader
