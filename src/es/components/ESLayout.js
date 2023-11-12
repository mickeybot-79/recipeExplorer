import { Outlet } from 'react-router-dom'
import ESPageHeader from './ESPageHeader'

const Layout = () => {
    return (
        <>
            <ESPageHeader />
            <div className="page-container">
                <Outlet />
            </div>
            {/*<PageFooter />*/}
        </>
    )
}
export default Layout