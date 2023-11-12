import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const DeleteConfirmPage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const deleted = window.sessionStorage.getItem('deleted')
        if (deleted !== 'y') navigate('/')
    }, [navigate])

    return (
        <div style={{width: '100vw', height: '100vh', display: 'grid', placeContent: 'center', position: 'fixed', top: '0px', left: '0px' }}>
            <img src='../../Images/deleted.gif' alt="trash" style={{ width: '300px', height: '300px', marginBottom: '100px' }} />
            <div id='missing-data-container' style={{width: '500px', marginLeft: '-100px'}}>
                <p id="missing-message">Your recipe was successfully deleted</p>
                <button type='button' id='ok-missing' onClick={() => {
                    window.sessionStorage.removeItem('deleted')
                    navigate('/')
                }}>Ok</button>
            </div>
        </div>
    )
}

export default DeleteConfirmPage