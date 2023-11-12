import { Outlet } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import { v4 as uuid } from 'uuid'
import { useAddNewUserMutation, useGetUserDataMutation } from '../users/usersApiSlice'
import { useTempLoginMutation } from '../auth/authApiSlice'
import { useDispatch } from 'react-redux'

const PersistLogin = () => {

    const persist = JSON.parse(localStorage.getItem("persist")) || false
    const tempUserId = window.localStorage.getItem('temp-id')
    const session = window.sessionStorage.getItem('session')
    const isTemp = window.sessionStorage.getItem('isTemp')
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    const [addNewUser] = useAddNewUserMutation()

    const [tempLogin] = useTempLoginMutation()

    const dispatch = useDispatch()

    const [getUserData] = useGetUserDataMutation()

    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    await refresh()
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
            //if (!persist && session) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const doLogin = async (userID) => {
            try {
                await tempLogin({ userID: userID }).unwrap()
            } catch (err) {
                console.log('error on tempLogin', err)
                const tempUsername = uuid().split('-')[4]
                const newUser = await addNewUser({
                    user: `temp-${tempUsername}`,
                    pwd: '',
                    country: '',
                    about: '',
                    image: ''
                }) 
                window.localStorage.setItem('temp-id', newUser.data.user._id)
            }
        }
        const createUser = async (tempUsername) => {
            try {
                const newUser = await addNewUser({
                    user: tempUsername,
                    pwd: '',
                    country: '',
                    about: '',
                    image: ''
                })
                window.localStorage.setItem('temp-id', newUser.data.user._id)
                doLogin(newUser.data.user._id)
            } catch {
                //console.log('error on createUser')
            }
        }
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            }
            catch (err) {
                console.log(err)
            }
        }

        if (!persist) {
            if (session) {
                if (isTemp === 'n') { // active user, logged in, session started (prevents losing the login on refresh)
                    verifyRefreshToken()
                    setTrueSuccess(true)
                } else { // temp user, session started (renews the temp access token on refresh)
                    doLogin(tempUserId)
                }
            } else if (!session && tempUserId) { // temp user, session not started (getting temp access token to start the session)
                doLogin(tempUserId)
                window.sessionStorage.setItem('session', 'actv')
                window.sessionStorage.setItem('isTemp', 'y')
            } else if (!session && !tempUserId) { // new user, session not started (first time visiting the site)
                try {
                    const tempUsername = uuid().split('-')[4]
                    const newUser = createUser(`temp-${tempUsername}`)
                    window.localStorage.setItem('temp-id', newUser.data.user._id)
                    window.sessionStorage.setItem('session', 'actv')
                    window.sessionStorage.setItem('isTemp', 'y')
                } catch (err) {
                    console.log(err)
                }
            }
        }

    }, [persist, tempLogin, dispatch, addNewUser, tempUserId, session, refresh, isTemp, getUserData])

    let content

    if (isLoading) {
        //console.log('loading')
        content = (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeContent: 'center',
                position: 'fixed',
                top: '0px',
                left: '0px',
                background: 'linear-gradient(90deg, rgba(169, 142, 212, 0.37), rgba(89, 119, 202, 0.616))'
            }}>
            </div>
        )
    } else if (isError) {
        console.log(error.message)
        content = <Outlet />
    } else if (isSuccess && trueSuccess) {
        //console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) {
        //console.log('token and uninit')
        //console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}

export default PersistLogin