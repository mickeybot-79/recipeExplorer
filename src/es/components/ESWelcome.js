import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import PageFooter from '../../components/PageFooter'

const Welcome = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
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
                    <h1 id="main-title" onClick={handleClick}>Explorador de Recetas</h1>
                    <p id="intro">¡Descubre recetas deliciosas!</p>
                </div>
                <main id="main-welcome">
                    <section id="welcome-search" ref={exploreRef}>
                        <p id="search-title">Explora un mundo de recetas</p>
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
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '30px'}} onClick={() => navigate('/es/recipes/pollo-al-horno-con-ensalada-blanca')}>
                                <img src="../../Images/Recipes/pollo.jpg" alt="" />
                                <p className="option-label">Pollo al horno con ensalada blanca</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '330px'}} onClick={() => navigate('/es/recipes/chaja-uruguayo')}>
                                <img src="../../Images/Recipes/chaja.jpg" alt="" />
                                <p className="option-label">Chajá Uruguayo</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '630px'}} onClick={() => navigate('/es/recipes/empanadas-de-pollo-con-salsa-teriyaki')}>
                                <img src="../../Images/Recipes/empanadas.webp" alt="" />
                                <p className="option-label">Empanadas de pollo con salsa teriyaki</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '930px'}} onClick={() => navigate('/es/recipes/pizza-uruguaya')}>
                            <img src="../../Images/Recipes/pizza.webp" alt="" />
                                <p className="option-label">Pizza</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '1230px'}} onClick={() => navigate('/es/recipes/ensaladilla-de-patata-con-mayonesa-de-limón-y-mostaza')}>
                                <img src="../../Images/Recipes/ensaladilla.jpg" alt="" />  
                                <p className="option-label">Ensaladilla de patata con mayonesa de limón y mostaza</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '1530px'}} onClick={() => navigate('/es/recipes/croquetas-de-jamon-iberico-y-huevo-duro')}>
                                <img src="../../../Images/Recipes/croquetas huevo.jpg" alt="" />
                                <p className="option-label">Croquetas de jamón ibérico y huevo duro</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '1830px'}} onClick={() => navigate('/es/recipes/ensalada-tailandesa')}>
                                <img src="../../Images/Recipes/ensalada tailandesa.jpg" alt="" />
                                <p className="option-label">Ensalada tailandesa</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '2130px'}} onClick={() => navigate('/es/recipes/faina')}>
                                <img src="../../Images/Recipes/faina.jpg" alt="" />
                                <p className="option-label">Fainá</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '2430px'}} onClick={() => navigate('/es/recipes/sopa-de-espinaca-y-chipa-frito')}>
                                <img src="../../Images/Recipes/sopa de espinaca.jpg" alt="" />
                                <p className="option-label">Sopa de espinaca y chipá frito</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '2730px'}} onClick={() => navigate('/es/recipes/pate-de-pollo-y-naranja')}>
                                <img src="../../Images/Recipes/paté.jpg" alt="" />
                                <p className="option-label">Paté de pollo y naranja</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3030px'}} onClick={() => navigate('/es/recipes/capelettis-de-queso-de-cabra')}>
                                <img src="../../Images/Recipes/capelettis.jpg" alt="" />
                                <p className="option-label">Capelettis de Queso de Cabra</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3330px'}} onClick={() => navigate('/es/recipes/niscalos-con-patatas-y-chorizo')}>
                                <img src="../../Images/Recipes/niscalos.jpg" alt="" />
                                <p className="option-label">Níscalos con patatas y chorizo</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3630px'}} onClick={() => navigate('/es/recipes/croquetas-de-boletus')}>
                                <img src="../../Images/Recipes/croquetas.jpg" alt="" />
                                <p className="option-label">Croquetas de boletus</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '3930px'}} onClick={() => navigate('/es/recipes/bucatoni-con-salsa-carbonara-y-achicoria')}>
                                <img src="../../Images/Recipes/bucatoni.jpg" alt="" />
                                <p className="option-label">Bucatoni con salsa carbonara y achicoria</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '4230px'}} onClick={() => navigate('/es/recipes/arroz-con-champinones-y-gambas')}>
                                <img src="../../Images/Recipes/champiñones.jpg" alt="" />
                                <p className="option-label">Arroz con champiñones y gambas</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '4530px'}} onClick={() => navigate('/es/recipes/canelones-rellenos-de-setas')}>
                                <img src="../../Images/Recipes/canelones.jpg" alt="" />
                                <p className="option-label">Canelones rellenos de setas</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '4830px'}} onClick={() => navigate('/es/recipes/entrecot-de-ternera-marinado-estilo-coreano')}>
                                <img src="../../Images/Recipes/entrecot.jpg" alt="" />
                                <p className="option-label">Entrecot de ternera marinado estilo coreano</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '5130px'}} onClick={() => navigate('/es/recipes/magret-de-pato-con-salsa-de-ciruela')}>
                                <img src="../../Images/Recipes/magret.jpg" alt="" />
                                <p className="option-label">Magret de pato con salsa de ciruela</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '5430px'}} onClick={() => navigate('/es/recipes/arroz-con-verduras-y-pollo-vegano')}>
                                <img src="../../Images/Recipes/vegano.jpg" alt="" />
                                <p className="option-label">Arroz con verduras y pollo vegano</p>
                            </div>
                            <div className="welcome-option" style={{transform: `translateX(-${(currentLeftScroll * 300)}px)`, transition: '0.2s', left: '5730px'}} ref={lastListItem} onClick={() => navigate('/recipes/atun-encebollado')}>
                                <img src="../../Images/Recipes/atun.jpg" alt="" />
                                <p className="option-label">Atún encebollado</p>
                            </div>
                        </div>
                    </section>
                    <section id="welcome-share">
                        <p id="welcome-share-prompt">¿Conoces una receta deliciosa? ¡Compártela con nosotros!</p>
                        <div id="welcome-share-image">
                                <img src="../Images/chef.png" alt="" />
                        </div>
                        <button type="button" id="welcome-share-button" onClick={() => navigate('/es/recipes/new')}>Compartir una receta</button>
                    </section>
                    <section id="welcome-comunity">
                        <p id="welcome-community-prompt">Únete a la comunidad para obtener reacciones en tus recetas, crear tus propias colecciones y más!</p>
                        <div id="welcome-community-image-container">
                            <div id="welcome-community-image">
                                <img src="../Images/cooking.jpg" alt="cooking"/>
                            </div>
                        </div>
                        <button type="button" id="welcome-community-button" onClick={() => navigate('/es/signup')}>Crear cuenta</button>
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
                        <PageFooter openLink={'../../Images/open.png'}/>
                    </footer>
                </main>
            </section>
        </>
    )
}

export default Welcome