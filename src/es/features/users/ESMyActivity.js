import { useEffect, useState } from 'react'
import { useGetLogsMutation, useDeleteLogEntryMutation } from '../../../features/logs/logsApiSlice'
import { useGetRecipesDataMutation } from '../../../features/recipes/recipesApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../../../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import LoadingIcon from '../../../components/LoadingIcon'

const MyActivity = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [lgoff, setLgoff] = useState(window.localStorage.getItem('lgoff'))

    const token = useSelector(selectCurrentToken)
    var userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')

    const [getRecipesData] = useGetRecipesDataMutation()

    const [getLogs] = useGetLogsMutation()

    const [deleteLogEntry] = useDeleteLogEntryMutation()

    const [activities, setActivities] = useState()

    const [recipes, setRecipes] = useState()

    const [logsSlice, setLogsSlice] = useState(30)

    const [lengthReached, setLengthReached] = useState(false)

    const [trueSuccess, setTrueSuccess] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            setTrueSuccess(false)
            const allLogs = await getLogs({ userID: userID, logsSlice: logsSlice })
            setActivities(() => {
                const finalLogs = [...allLogs.data.logs].sort((a, b) => b.timestamp - a.timestamp)
                return finalLogs
            })
            const recipesInLogs = []
            for (let i = 0; i < allLogs.data.logs.length; i++) {
                if (!recipesInLogs.includes(allLogs.data.logs[i].recipeID) && allLogs.data.logs[i].recipeID !== '') {
                    recipesInLogs.push(allLogs.data.logs[i].recipeID)
                }
            }
            const allRecipes = await getRecipesData({ recipes: recipesInLogs })
            setRecipes(() => {
                return allRecipes.data
            })
            setLengthReached(() => {
                return allLogs.data.length === allLogs.data.logs.length
            })
            setTrueSuccess(true)
        }
        fetchLogs()
    }, [getLogs, userID, getRecipesData, logsSlice])

    var content

    const handleLogsSlice = () => {
        setLogsSlice((prevState) => {
            const newLogsSlice = prevState + 30
            return newLogsSlice
        })
    }

    const handleOptOut = () => {
        if (lgoff === 'y') {
            window.localStorage.setItem('lgoff', 'n')
            setLgoff('n')
        } else {
            window.localStorage.setItem('lgoff', 'y')
            setLgoff('y')
        }
    }

    const handleDeleteItem = (activity) => {
        deleteLogEntry({logID: activity._id})
        setActivities(() => {
            const updatedArray = [...activities]
            updatedArray.splice(updatedArray.indexOf(activity), 1)
            return updatedArray
        })
    }

    try {

        const activityElements = activities.sort((a, b) => b.timestamp - a.timestamp).map(activity => {

            const activityType = activity.activity
            const recipeName = recipes.filter(recipe => recipe[0]._id === activity.recipeID)

            const date = new Date()
            const today = date.getTime()
            var timeValue
            const timeDiff = Math.floor(Math.abs(today - activity.timestamp) / (1000 * 60 * 60))
            if (timeDiff < 1) {
                if (Math.floor(Math.abs(today - activity.timestamp) / (1000 * 60)) === 0) {
                    timeValue = 'menos de un minuto'
                } else if (Math.floor(Math.abs(today - activity.timestamp) / (1000 * 60)) === 1) {
                    timeValue = '1 minuto'
                } else {
                    timeValue = `${Math.floor(Math.abs(today - activity.timestamp) / (1000 * 60))} minutos`
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
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Te gustó <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                case 'comment':
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Comentaste en <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                case 'newRecipe':
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Publicaste <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                case 'favorite':
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Agregaste <Link to={`/es/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> a favoritos - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                case 'image':
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Actualizaste tu imagen de perfil - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                case 'country':
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Actualizaste tu país - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                case 'about':
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Actualizaste tu introducción - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
                default:
                    activityItem = (<div className='activity-container' key={activity._id}><p className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>Cambiaste tu contraseña - {`(hace ${timeValue})`}</p><p className='activity-x' onClick={() => handleDeleteItem(activity)}>✖</p></div>)
                    break
            }

            return activityItem

        })

        content = (
            <>
                <div id="dash-container">
                    <h1 id='dash-title'>Tu Actividad</h1>
                    <div id='opt-out-option'>
                        <input type='checkbox' onChange={handleOptOut} checked={lgoff === 'y' ? true : false} />
                        <p>No registrar mi actividad</p>
                    </div>
                    <div id='activity-items-container'>
                        {activityElements}
                        <p id='activity-show-more' onClick={handleLogsSlice} style={{display: trueSuccess && !lengthReached ? 'block': 'none'}}>Mostrar más...</p>
                        <div id="loader" style={{display: !trueSuccess ? 'flex': 'none'}}>
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
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

export default MyActivity