import { useNavigate } from "react-router-dom"

const RecipeNotFound = () => {

    const navigate = useNavigate()

    return (
        <div id="missing-page-container">
            <img src="../../../Images/chefsleep.png" alt="chef sleep" id="chef-sleep"/>
            <p>No hemos encontrado tu receta.</p>
            <button type="button" onClick={() => navigate('/es/')}>Volver al Inicio</button>
        </div>
    )
}

export default RecipeNotFound