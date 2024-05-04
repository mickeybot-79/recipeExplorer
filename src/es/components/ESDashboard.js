import { useState, useEffect } from 'react'
import { useGetLogsMutation } from '../../features/logs/logsApiSlice'
import { useGetRecipesDataMutation } from '../../features/recipes/recipesApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import LoadingIcon from '../../components/LoadingIcon'

const Dashboard = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng')

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [getLogs] = useGetLogsMutation()

    const [getRecipesData] = useGetRecipesDataMutation()

    const token = useSelector(selectCurrentToken)
    const userID = token ? jwtDecode(token).UserInfo.id : ''
    //const userID = jwtDecode(token).UserInfo.id

    const [activities, setActivities] = useState()

    const [recipes, setRecipes] = useState()

    useEffect(() => {
        const fetchLogs = async () => {
            const userLogs = await getLogs({ userID: userID, logsSlice: 5 })
            setActivities(() => {
                const finalLogs = [...userLogs.data.logs].sort((a, b) => b.timestamp - a.timestamp)
                return finalLogs
            })
            const recipesInLogs = []
            for (let i = 0; i < userLogs.data.logs.length; i++) {
                if (!recipesInLogs.includes(userLogs.data.logs[i].recipeID) && userLogs.data.logs[i].recipeID !== '') {
                    recipesInLogs.push(userLogs.data.logs[i].recipeID)
                }
            }
            const allRecipes = await getRecipesData({ recipes: recipesInLogs })
            setRecipes(() => {
                return allRecipes.data
            })
        }
        fetchLogs()
    }, [userID, getLogs, getRecipesData])

    const activityElements = []

    var content

    try {

        for (let i = 0; i < activities.length; i++) {
            const activityType = activities[i].activity
            const recipeName = recipes.filter(recipe => recipe[0]._id === activities[i].recipeID)

            const date = new Date()
            const today = date.getTime()
            var timeValue
            const timeDiff = Math.floor(Math.abs(today - activities[i].timestamp) / (1000 * 60 * 60))
            if (timeDiff < 1) {
                if (Math.floor(Math.abs(today - activities[i].timestamp) / (1000 * 60)) === 0) {
                    timeValue = 'menos de un minuto'
                } else if (Math.floor(Math.abs(today - activities[i].timestamp) / (1000 * 60)) === 1) {
                    timeValue = '1 minuto'
                } else {
                    timeValue = `${Math.floor(Math.abs(today - activities[i].timestamp) / (1000 * 60))} minutos`
                }
            } else if (timeDiff === 1) {
                timeValue = `${timeDiff} hora`
            } else if (timeDiff > 1 && timeDiff < 24) {
                timeValue = `${timeDiff} horas`
            } else if (Math.floor((timeDiff / 24)) === 1) {
                timeValue = `${Math.floor((timeDiff / 24))} día`
            } else if (Math.floor((timeDiff / 24)) > 1) {
                timeValue = `${Math.floor((timeDiff / 24))} días`
            }

            var activityItem
            switch (activityType) {
                case 'like':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Te gustó <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(hace ${timeValue})`}</p>)
                    break
                case 'comment':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Comentaste en <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(hace ${timeValue})`}</p>)
                    break
                case 'newRecipe':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Publicaste <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(hace ${timeValue})`}</p>)
                    break
                case 'favorite':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Agregaste <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> a favoritos - {`(hace ${timeValue})`}</p>)
                    break
                case 'image':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Actualizaste tu imagen de perfil - {`(hace ${timeValue})`}</p>)
                    break
                case 'country':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Actualizaste tu país - {`(hace ${timeValue})`}</p>)
                    break
                case 'about':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Actualizaste tu introducción - {`(hace ${timeValue})`}</p>)
                    break
                default:
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Cambiaste tu contraseña - {`(hace ${timeValue})`}</p>)
                    break
            }
            activityElements.push(activityItem)
        }

        content = (
            <>
                <div id="dash-container">
                    <h1 id='dash-title'>Tu panel</h1>
                    <div id='activity-items-container'>
                        <h2 id='dash-activity'>Tu actividad:</h2>
                        {activityElements}
                        <p id='all-activity-option' onClick={() => navigate('/es/dash/activity')}>Ver toda la actividad ➜</p>
                    </div>
                    <h2 onClick={() => navigate('/es/dash/favorites')} className='dash-option'>Ver tus favoritos ➜</h2>
                    <h2 onClick={() => navigate('/es/dash/myrecipes')} className='dash-option'>Administra tus recetas ➜</h2>
                    <h2 onClick={() => navigate('/es/dash/collections')} className='dash-option' id='dash-collections'>Administrar colecciones ➜</h2>
                    {/* <h2 onClick={() => navigate('/dash/drafts')} className='dash-option' id='dash-drafts'>Edit your drafts ➜</h2> */}
                </div>
            </>
        )

    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc='../../Images/favicon-gif.gif'/>
        )
    }
    return content
}

export default Dashboard
