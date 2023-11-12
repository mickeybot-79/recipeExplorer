import { Outlet } from 'react-router-dom'
import PageHeader from './PageHeader'

const ESLayout = () => {
    return (
        <>
            <PageHeader />
            <div className="page-container">
                <Outlet />
            </div>
            {/*<PageFooter />*/}
        </>
    )
}
export default ESLayout