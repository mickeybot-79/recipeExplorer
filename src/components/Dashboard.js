import { useState, useEffect } from 'react'
import { useGetLogsMutation } from '../features/logs/logsApiSlice'
import { useGetRecipesDataMutation } from '../features/recipes/recipesApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import LoadingIcon from './LoadingIcon'

const Dashboard = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [getLogs] = useGetLogsMutation()

    const [getRecipesData] = useGetRecipesDataMutation()

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const token = useSelector(selectCurrentToken)
    const userID = token ? jwtDecode(token).UserInfo.id : window.localStorage.getItem('temp-id')
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
                    timeValue = 'Less than a minute ago'
                } else if (Math.floor(Math.abs(today - activities[i].timestamp) / (1000 * 60)) === 1) {
                    timeValue = '1 minute'
                } else {
                    timeValue = `${Math.floor(Math.abs(today - activities[i].timestamp) / (1000 * 60))} minutes`
                }
            } else if (timeDiff === 1) {
                timeValue = `${timeDiff} hour`
            } else if (timeDiff > 1 && timeDiff < 24) {
                timeValue = `${timeDiff} hours`
            } else if (Math.floor((timeDiff / 24)) === 1) {
                timeValue = `${Math.floor((timeDiff / 24))} day`
            } else if (Math.floor((timeDiff / 24)) > 1) {
                timeValue = `${Math.floor((timeDiff / 24))} days`
            }

            var activityItem
            switch (activityType) {
                case 'like':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You liked <Link to={`/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(${timeValue} ago)`}</p>)
                    break
                case 'comment':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You commented on <Link to={`/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(${timeValue} ago)`}</p>)
                    break
                case 'newRecipe':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You posted <Link to={`/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> - {`(${timeValue} ago)`}</p>)
                    break
                case 'favorite':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You added <Link to={`/recipes/${recipeName[0][0].searchField}`}>{recipeName[0][0].name}</Link> to favorites - {`(${timeValue} ago)`}</p>)
                    break
                case 'image':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You updated your profile image - {`(${timeValue} ago)`}</p>)
                    break
                case 'country':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You updated your country - {`(${timeValue} ago)`}</p>)
                    break
                case 'about':
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You updated your introduction - {`(${timeValue} ago)`}</p>)
                    break
                default:
                    activityItem = (<p key={i} className='activity-item'><span style={{ fontSize: '25px', color: 'rgba(57, 158, 57, 0.719)', marginRight: '10px' }}>★</span>You changed your password - {`(${timeValue} ago)`}</p>)
                    break
            }
            activityElements.push(activityItem)
        }

        content = (
            <>
                <div id="dash-container">
                    <h1 id='dash-title'>Your Dashboard</h1>
                    <div id='activity-items-container'>
                        <h2 id='dash-activity'>Your activity:</h2>
                        {activityElements}
                        <p id='all-activity-option' onClick={() => navigate('/dash/activity')}>View all activity ➜</p>
                    </div>
                    <h2 onClick={() => navigate('/dash/favorites')} className='dash-option'>View your favorites ➜</h2>
                    <h2 onClick={() => navigate('/dash/myrecipes')} className='dash-option'>Manage your recipes ➜</h2>
                    <h2 onClick={() => navigate('/dash/collections')} className='dash-option' id='dash-collections'>Manage your collections ➜</h2>
                    {/* <h2 onClick={() => navigate('/dash/drafts')} className='dash-option' id='dash-drafts'>Edit your drafts ➜</h2> */}
                </div>
            </>
        )

    } catch (err) {
        //console.log(err)
        return (
            <LoadingIcon imgSrc='../../Images/favicon-gif.gif'/>        
            // <div style={{
            //     width: '100%',
            //     height: '1500px',
            //     display: 'grid',
            //     placeContent: 'center'
            // }}>
            //     <img
            //         src='../Images/favicon-gif.gif'
            //         alt='icon'
            //         style={{
            //             marginTop: '-500px',
            //             width: '200px',
            //             filter: 'sepia(40%)'
            //         }}
            //     />
            // </div>
        )
    }
    return content
}

export default Dashboard
