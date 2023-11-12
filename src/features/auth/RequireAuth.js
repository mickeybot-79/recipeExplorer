//import { useLocation, Navigate, Outlet } from "react-router-dom"
import { Navigate, Outlet } from "react-router-dom"
// import { useSelector } from 'react-redux'
// import { selectCurrentToken } from "./authSlice"

const RequireAuth = () => {

    //const location = useLocation()
    //const token = useSelector(selectCurrentToken)
    const isTemp = window.sessionStorage.getItem('isTemp')
    const logged = isTemp === 'n' ? true : false

    const content = (
        //logged === true ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
        logged === true ? <Outlet /> : <Navigate to="/login" replace />
    )

    return content
}
export default RequireAuth