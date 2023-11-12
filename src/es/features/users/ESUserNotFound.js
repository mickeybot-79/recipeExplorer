import { useNavigate } from "react-router-dom"

const ESUserNotFound = () => {

    const navigate = useNavigate()

    return (
        <div id="missing-user-container">
            <img src="../../Images/missing-user.png" alt="missing user" id="missing-user" />
            <p>Usuario no encontrado.</p>
            <button type="button" onClick={() => navigate('/es/')}>Volver al Inicio</button>
        </div>
    )
}

export default ESUserNotFound