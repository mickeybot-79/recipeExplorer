import { useNavigate } from "react-router-dom"

const RecipeNotFound = () => {

    const navigate = useNavigate()

    return (
        <div id="missing-page-container">
            <img src="../../Images/chefsleep.png" alt="chef sleep" id="chef-sleep"/>
            <p>We have not found your recipe.</p>
            <button type="button" onClick={() => navigate('/')}>Back to Home</button>
        </div>
    )
}

export default RecipeNotFound