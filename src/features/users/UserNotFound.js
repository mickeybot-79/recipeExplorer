import { useNavigate } from "react-router-dom"

const UserNotFound = () => {

    const navigate = useNavigate()

    return (
        <div id="missing-user-container">
            <img src="../../Images/missing-user.png" alt="missing user" id="missing-user" />
            <p>User not found.</p>
            <button type="button" onClick={() => navigate('/')}>Back to Home</button>
        </div>
    )
}

export default UserNotFound