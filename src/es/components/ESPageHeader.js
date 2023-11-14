import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../features/auth/authSlice'
import { useSendLogoutMutation, useTempLoginMutation } from '../../features/auth/authApiSlice'
import { useGetUserDataMutation } from '../../features/users/usersApiSlice'
import jwtDecode from 'jwt-decode'

const ESPageHeader = () => {

    const navigate = useNavigate()
    const isTemp = window.sessionStorage.getItem('isTemp')
    const token = useSelector(selectCurrentToken)
    var logged = isTemp === 'n' ? true : false
    var userName = token ? jwtDecode(token).UserInfo.username : ''
    var userID = token ? jwtDecode(token).UserInfo._id : window.localStorage.getItem('temp-id')
    //const userImage = window.localStorage.getItem('image')

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
        const userLng = window.localStorage.getItem('usrlng')
        if (!userLng) {
            var usrlang = navigator.language || navigator.userLanguage
            window.localStorage.setItem('usrlng', usrlang)
            if (usrlang === 'en') navigate('/')
        }
    }, [navigate])

    useEffect(() => {
        if (isSuccess) navigate('/es')
        if (!token) setDisplay('none')
    }, [isSuccess, navigate, token])

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserData({ userID: userName })
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

    // useEffect(() => {
    //     function testImage(URL) {
    //         var tester=new Image()
    //         tester.onerror = imageNotFound
    //         tester.src=URL
    //     }

    //     function imageNotFound() {
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
                src='../../Images/favicon.png'
                alt='icon'
                style={{ width: '40px' }}
                className="header-option"
                id='header-icon'
                onClick={() => navigate('/es')}
            // onError={(error) => {
            //     console.log(error)
            //     setTimeout(() => {
            //         //window.location.reload()
            //     }, 500)
            // }}
            />
        )

        let threeDots = (
            <img
                src='../../Images/three-dots.png'
                alt='icon'
                style={{ display: displayDots, width: '40px' }}
                onMouseOver={() => {
                    console.log(displayDotOptions)
                    setDisplayDotOptions((prevState) => {
                        //return prevState === 'none' ? 'block' : 'none'
                        return 'block'
                    })
                }}
                onMouseLeave={() => setDisplayDotOptions(() => {
                    return window.innerWidth < 700 ? 'none' : 'block'
                })}
                id='header-dots'
            // onClick={() => navigate('/')}
            />
        )

        let dotOptions = (
            <div id='dot-options' style={{ display: displayDotOptions }} onMouseLeave={() => setDisplayDotOptions('none')}>
                <p
                    onClick={() => {
                        setDisplayDotOptions('none')
                        navigate('/es/recipes/best')
                    }}
                    className='dot-option'>Favoritos del público</p>
                <p
                    onClick={() => {
                        setDisplayDotOptions('none')
                        navigate('/es/recipes/newest')
                    }}
                    className='dot-option'>Recetas Nuevas</p>
                <p
                    onClick={() => {
                        setDisplayDotOptions('none')
                        navigate('/es/recipes/new')
                    }}
                    className='dot-option'>Comparte una receta</p>
            </div>
        )

        let peoplesFavorites = (
            <button
                className="header-option"
                onClick={() => navigate('/es/recipes/best')}
                style={{ display: displayDots === 'inline' ? 'none' : 'inline' }}
            >Favoritos del público
            </button>
        )

        let recentlyAdded = (
            <button
                className="header-option"
                onClick={() => navigate('/es/recipes/newest')}
                style={{ display: displayDots === 'inline' ? 'none' : 'inline' }}
            >Recetas Nuevas
            </button>
        )

        let shareOption = (
            <button
                className="header-option"
                onClick={() => navigate('/es/recipes/new')}
                style={{ display: displayDots === 'inline' ? 'none' : 'inline' }}
            >Comparte una receta
            </button>
        )

        let flagIcon = (
            <div id='flag-icon' onMouseOver={() => {
                setDisplayLngChoice(() => {
                    //return prevState === 'none' ? 'block' : 'none'
                    return 'block'
                })
            }}
                onMouseLeave={() => setDisplayLngChoice(() => {
                    //return window.innerWidth < 700 ? 'none' : 'block'
                    return 'none'
                })}
            >
                <img src={`../../Images/Spain.jpg`} alt='flag' />
                <p>ES</p>
            </div>
        )

        let lngChoice = (
            <div id='flag-choice' style={{ display: displayLngChoice }} onMouseOver={() => setDisplayLngChoice('block')} onMouseLeave={() => setDisplayLngChoice('none')}>
                <div id='EN-option' onClick={() => {
                    window.localStorage.setItem('usrlng', 'en')
                    if (currentLocation.pathname.includes('/es')) navigate(`/${currentLocation.pathname}`)
                    setDisplayLngChoice('none')
                }}>
                    <img src='../../Images/UK.jpg' alt='UK' className='flag-option' />
                    <p>English</p>
                </div>
                <div id='ES-option' onClick={() => {
                    window.localStorage.setItem('usrlng', 'es')
                    if (!currentLocation.pathname.includes('/es')) navigate(`/es${currentLocation.pathname}`)
                    setDisplayLngChoice('none')
                }}>
                    <img src='../../Images/Spain.jpg' alt='SP' className='flag-option' />
                    <p>Español</p>
                </div>
            </div>
        )

        let searchIcon = (
            <img
                src='../../Images/search.png'
                alt='icon'
                style={{ width: '45px', height: '45px' }}
                className="header-option"
                id='header-search-icon'
                onClick={() => navigate('/es/search')}
            />
        )

        let loginOption
        if (!logged) {
            loginOption = (
                <button
                    className="header-option"
                    id='login-es'
                    onClick={() => navigate('/es/login')}
                    style={{ zIndex: '10' }}
                >Iniciar sesión
                </button>
            )
        }

        let useIcon
        if (logged) {
            var finalImage
            //const avatarImages = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'avatar6.png']
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
                    style={{ display: `${display}` }}
                    onMouseOver={() => setDisplay('grid')}
                    onMouseLeave={() => setDisplay('none')}>
                    <button
                        className="header-option-icon"
                        onClick={() => navigate('/es/dash')}
                    >Panel
                    </button>
                    <button
                        className="header-option-icon"
                        onClick={() => navigate('/es/dash/account')}
                    >Cuenta
                    </button>
                    <button
                        className="header-option-icon"
                        onClick={() => {
                            sendLogout()
                            doLogin(userID)
                            window.sessionStorage.setItem('isTemp', 'y')
                            if (currentLocation.pathname !== '/es') {
                                setTimeout(() => {
                                    navigate('/es/')
                                }, 100)
                            } else {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 100)
                            }
                        }}
                    >Cerrar sesión
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
                        style={{ display: logged ? 'block' : 'none' }}
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
export default ESPageHeader
