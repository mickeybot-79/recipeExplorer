import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const AccountDeleteConfirmation = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const deleted = window.sessionStorage.getItem('deleted')
        if (deleted !== 'y') navigate('/')
    }, [navigate])

    return (
        <div id='account-confirmation-container'>
            <img src='../../Images/deleted 2.gif' alt='deleted' id='delete-account-image'/>
            <p>Your Account was successfully deleted</p>
            <Link to="/" style={{fontSize: '30px', marginLeft: '60px'}}>Back to Home</Link>
        </div>
    )
}

export default AccountDeleteConfirmation