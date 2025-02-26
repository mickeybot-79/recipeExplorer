import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import PageFooter from './PageFooter'
import {useGetRecipesQuery} from '../features/recipes/recipesApiSlice'

const Welcome = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const {
        data
    } = useGetRecipesQuery('', {
        pollingInterval: 600000,
        refetchOnMountOrArgChange: true
    })

    console.log(data)

    const usrlng = window.localStorage.getItem('usrlng')

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'es')  navigate(`/es${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const exploreRef = useRef()

    const galleryRef = useRef()

    const lastListItem = useRef()

    const [currentLeftScroll, setCurrentLeftScroll] = useState(0)

    useEffect(() => {
        const resizeListener = () => {
            if (lastListItem.current) {
                const rect = lastListItem.current.getBoundingClientRect()
                const x = rect.right
                if (x < window.innerWidth + 300) {
                    setCurrentLeftScroll(10)
                }
            }
        }
        window.addEventListener('resize', resizeListener)

        //return window.removeEventListener('resize', resizeListener)
    }, [])

    const handleClick = () => {
        window.scrollTo({ top: exploreRef.current.offsetTop - 75, behavior: 'smooth' })
    }

    return (
        <>
            <section id="welcome">
                <div id="welcome-title">
                    <img src='../Images/favicon-gif.gif' alt='icon' id="icon" onClick={handleClick}/>
                    <h1 id="main-title" onClick={handleClick}>Recipe Explorer</h1>
                    <p id="intro">Find delicious recipes to enjoy!</p>
                </div>
                <main id="main-welcome">
                    <section id="welcome-search" ref={exploreRef}>
                        <p id="search-title">Explore a world of recipes</p>
                        <div id="scroll-container">
                        <div id="scroll-left" onClick={() => {
                            if (currentLeftScroll > 0) {
                                setCurrentLeftScroll((prevScroll) => {
                                    return prevScroll - 1
                                })
                            }
                        }}>
                                <img src="../Images/left.png" alt="left"/>
                            </div>
                            <div id="scroll-right" onClick={() => { 
                                const rect = lastListItem.current.getBoundingClientRect()
                                const x = rect.right
                            // if (x > window.innerWidth + 300) {
                            if (x > window.innerWidth) {
                                setCurrentLeftScroll((prevScroll) => {
                                    return prevScroll + 1
                                })
                            }                      
                            }}>
                                <img src="../Images/right.png" alt="left"/>
                            </div>
                        </div>
                        <div id="welcome-option-container" ref={galleryRef}>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '30px'}} onClick={() => navigate('/recipes/classic-spaghetti-and-meatballs')}>
                                <img src="../Images/Recipes/spaghetti.jpg" alt="" />
                                <p className="option-label">Classic Spaghetti And Meatballs</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '330px'}} onClick={() => navigate('/recipes/crispy-baked-chicken-tacos')}>
                                <img src="../Images/Recipes/tacos.jpg" alt="" />
                                <p className="option-label">Crispy Baked Chicken Tacos</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '630px'}} onClick={() => navigate('/recipes/pumpkin-turkey-chili')}>
                                <img src="../Images/Recipes/pumpkin.jpg" alt="" />
                                <p className="option-label">Pumpkin Turkey Chili</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '930px'}} onClick={() => navigate('/recipes/roasted-pork-tenderloin')}>
                                <img src="../Images/Recipes/pork.jpg" alt="" />
                                <p className="option-label">Roasted Pork Tenderloin</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '1230px'}} onClick={() => navigate('/recipes/banana-cake')}>
                                <img src="../Images/Recipes/banana cake.jpg" alt="" />
                                <p className="option-label">Banana cake</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '1530px'}} onClick={() => navigate('/recipes/bread-and-butter-pudding')}>
                                <img src="../Images/Recipes/bread pudding.jpg" alt="" />
                                <p className="option-label">Bread and butter pudding</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '1830px'}} onClick={() => navigate('/recipes/mug-brownie')}>
                                <img src="../Images/Recipes/mug brownie.jpg" alt="" />
                                <p className="option-label">Mug brownie</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '2130px'}} onClick={() => navigate('/recipes/chicken-saltimbocca')}>
                                <img src="../Images/Recipes/saltimbocca.webp" alt="" />
                                <p className="option-label">Chicken saltimbocca</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '2430px'}} onClick={() => navigate('/recipes/roast-chicken')}>
                                <img src="../Images/Recipes/roast chicken.jpg" alt="" />
                                <p className="option-label">Roast chicken</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '2730px'}} onClick={() => navigate('/recipes/homemade-lasagna')}>
                                <img src="../Images/Recipes/lasagna.jpg" alt="" />
                                <p className="option-label">Homemade Lasagna</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3030px'}} onClick={() => navigate('/recipes/hot-honey-chicken-&-brussels-sprouts')}>
                                <img src="../Images/Recipes/honey chicken.jpg" alt="" />
                                <p className="option-label">Hot Honey Chicken & Brussels Sprouts</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3330px'}} onClick={() => navigate('/recipes/butter-chicken')}>
                                <img src="../Images/Recipes/butter chicken.jpg" alt="" />
                                <p className="option-label">Butter Chicken</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3630px'}} onClick={() => navigate('/recipes/macaroni-and-cheese')}>
                                <img src="../Images/Recipes/macaroni.jpg" alt="" />
                                <p className="option-label">Macaroni and Cheese</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3930px'}} onClick={() => navigate('/recipes/white-lasagna')}>
                                <img src="../Images/Recipes/white lasagna.jpg" alt="" />
                                <p className="option-label">White Lasagna</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '4230px'}} onClick={() => navigate('/recipes/banana-pudding-pie')}>
                                <img src="../Images/Recipes/banana pudding.jpg" alt="" />
                                <p className="option-label">Banana Pudding Pie</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '4530px'}} onClick={() => navigate('/recipes/garlic-confit-mashed-potatoes')}>
                                <img src="../Images/Recipes/garlic.jpg" alt="" />
                                <p className="option-label">Garlic Confit Mashed Potatoes</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '4830px'}} onClick={() => navigate('/recipes/oatmeal-soda-bread')}>
                                <img src="../Images/Recipes/oatmeal.jpg" alt="" />
                                <p className="option-label">Oatmeal Soda Bread</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '5130px'}} onClick={() => navigate('/recipes/sweet-potato-casserole-cheesecake')}>
                                <img src="../Images/Recipes/cheesecake.jpg" alt="" />
                                <p className="option-label">Sweet Potato Casserole Cheesecake</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '5430px'}} onClick={() => navigate('/recipes/herb-crusted-rack-of-lamb')}>
                                <img src="../Images/Recipes/lamb.jpg" alt="" />
                                <p className="option-label">Herb-Crusted Rack of Lamb</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '5730px'}} ref={lastListItem} onClick={() => navigate('/recipes/chicken-and-sweetcorn-noodle-soup')}>
                                <img src="../Images/Recipes/chicken noodle.jpg" alt="" />
                                <p className="option-label">Chicken and sweetcorn noodle soup</p>
                            </div>
                        </div>
                    </section>
                    <section id="welcome-share">
                        <p id="welcome-share-prompt">Do you have a recipe that you love? Share it with us!</p>
                        <div id="welcome-share-image">
                                <img src="../Images/chef.png" alt="" />
                        </div>
                        <button type="button" id="welcome-share-button" onClick={() => navigate('/recipes/new')}>Share a new recipe</button>
                    </section>
                    <section id="welcome-comunity">
                        <p id="welcome-community-prompt">Join the community to get feedback on your recipes, create your own recipe collections and more!</p>
                        <div id="welcome-community-image-container">
                            <div id="welcome-community-image">
                                <img src="../Images/cooking.jpg" alt="cooking"/>
                            </div>
                        </div>
                        <button type="button" id="welcome-community-button" onClick={() => navigate('/signup')}>Join</button>
                    </section>
                    {/*Visit our shop*/}
                    {/* <section id="welcome-store">
                        <p id="welcome-store-prompt">Check our favorite cooking products in the store.</p>
                        <div id="welcome-store-image">
                                <img src="" alt="" />
                        </div>
                        <button type="button" id="welcome-store-button" onClick={() => navigate('/shop')}>Visit the store</button>
                    </section> */}
                    <footer>
                        <PageFooter openLink={'../Images/open.png'}/>
                    </footer>
                </main>
            </section>
        </>
    )
}

export default Welcome