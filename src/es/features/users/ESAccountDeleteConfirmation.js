import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const AccountDeleteConfirmation = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const deleted = window.sessionStorage.getItem('deleted')
        if (deleted !== 'y') navigate('/es/')
    }, [navigate])

    return (
        <div id='account-confirmation-container'>
            <img src='../../../Images/deleted 2.gif' alt='deleted' id='delete-account-image'/>
            <p>Tu cuenta se eliminó correctamente</p>
            <Link to="/es/" style={{fontSize: '30px', marginLeft: '60px'}}>Volver al Inicio</Link>
        </div>
    )
}

export default AccountDeleteConfirmation