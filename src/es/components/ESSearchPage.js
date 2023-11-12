import { useState, useEffect, useRef } from 'react'
import {     
    useGetRecipesByNameMutation,
    useGetRecipesByIngredientsMutation,
    useGetRecipesByCategoryMutation
} from '../../features/recipes/recipesApiSlice'
import { useNavigate, useLocation } from 'react-router-dom'

const SearchPage = () => {

    const usrlng = window.localStorage.getItem('usrlng') || ''

    const navigate = useNavigate()

    const currentLocation = useLocation()

    useEffect(() => {
        if (usrlng === 'en')  navigate(`/${currentLocation.pathname}`)
    }, [usrlng, navigate, currentLocation])

    const [getRecipesByName] = useGetRecipesByNameMutation()

    const [getRecipesByIngredients] = useGetRecipesByIngredientsMutation()

    const [getRecipesByCategory] = useGetRecipesByCategoryMutation()

    const searchRef = useRef()

    const filterRef = useRef()

    const [recipeSlice, setRecipeSlice] = useState(10)

    const [reachedLimit, setReachedLimit] = useState(true)

    const [resultRecipes, setResultRecipes] = useState({
        searchTerm: '',
        elements: []
    })

    const [searching, setSearching] = useState(false)

    useEffect(() => {
        searchRef.current.focus()
    }, [searchRef])

    useEffect(() => {
        const handleSearch = async() => {
    
            const searchIngredients = resultRecipes.searchTerm.replace(',', '').split(' ')
    
            if (resultRecipes.searchTerm !== '') {

                setSearching(true)
    
                var searchResults = []
    
                if (filterRef.current.value === 'name') {
                    const foundRecipes = await getRecipesByName({name: resultRecipes.searchTerm, slice: recipeSlice})
                    if (foundRecipes.data.result.length) {
                        searchResults = [...foundRecipes.data.result].sort((a, b) => b.likes - a.likes)
                    }
                    setReachedLimit(() => {
                        return foundRecipes.data.limit > recipeSlice ? false : true
                    })
                } else if (filterRef.current.value === 'category') {
                    const foundRecipes = await getRecipesByCategory({category: resultRecipes.searchTerm, slice: recipeSlice})
                    if (foundRecipes.data.result.length) {
                    searchResults = [...foundRecipes.data.result].sort((a, b) => b.likes - a.likes)
                    }
                    setReachedLimit(() => {
                        return foundRecipes.data.limit > recipeSlice ? false : true
                    })
                } else {
                    const foundRecipes = await getRecipesByIngredients({ingredients: searchIngredients, slice: recipeSlice})
                    if (foundRecipes.data.result.length) {
                    searchResults = [...foundRecipes.data.result].sort((a, b) => b.likes - a.likes)
                    }
                    setReachedLimit(() => {
                        return foundRecipes.data.limit > recipeSlice ? false : true
                    })
                }
    
                try {
    
                setResultRecipes((prevState) => {
    
                    const resultElements = []
    
                    if (searchResults.length > 0) {
    
                        for (let i = 0; i < searchResults.length; i++) {
    
                            const currentID = searchResults[i].searchField
    
                            var linearColor1
                            var linearColor2
                            switch (searchResults[i].category) {
                                case 'Breakfast':
                                    linearColor1 = 'rgba(131, 152, 192, 0.514)'
                                    linearColor2 = 'rgba(105, 68, 206, 0.514)'
                                    break
                                case 'Lunch':
                                    linearColor1 = 'rgba(165, 223, 172, 0.315)'
                                    linearColor2 = 'rgba(37, 142, 163, 0.514)'
                                    break
                                case 'Dinner':
                                    linearColor1 = 'rgba(190, 209, 161, 0.315)'
                                    linearColor2 = 'rgba(126, 34, 187, 0.514)'
                                    break
                                case 'Appetizer':
                                    linearColor1 = 'rgba(226, 208, 173, 0.315)'
                                    linearColor2 = 'rgba(126, 16, 67, 0.514)'
                                    break
                                case 'Salad':
                                    linearColor1 = 'rgba(155, 145, 126, 0.171)'
                                    linearColor2 = 'rgba(80, 27, 206, 0.514)'
                                    break
                                case 'Main-course':
                                    linearColor1 = 'rgba(174, 211, 164, 0.171)'
                                    linearColor2 = 'rgba(15, 152, 170, 0.514)'
                                    break
                                case 'Side-dish':
                                    linearColor1 = 'rgba(148, 216, 129, 0.171)'
                                    linearColor2 = 'rgba(8, 74, 150, 0.514)'
                                    break
                                case 'Baked-goods':
                                    linearColor1 = 'rgba(87, 199, 130, 0.377)'
                                    linearColor2 = 'rgba(76, 17, 143, 0.637)'
                                    break
                                case 'Dessert':
                                    linearColor1 = 'rgba(150, 199, 87, 0.377)'
                                    linearColor2 = 'rgba(112, 12, 104, 0.637)'
                                    break
                                case 'Snack':
                                    linearColor1 = 'rgba(56, 151, 112, 0.377)'
                                    linearColor2 = 'rgba(17, 15, 160, 0.637)'
                                    break
                                case 'Soup':
                                    linearColor1 = 'rgba(103, 75, 116, 0.158)'
                                    linearColor2 = 'rgba(9, 106, 109, 0.637)'
                                    break
                                case 'Holiday':
                                    linearColor1 = 'rgba(199, 126, 195, 0.342)'
                                    linearColor2 = 'rgba(87, 31, 5, 0.637))'
                                    break
                                case 'Vegetarian':
                                    linearColor1 = 'rgba(219, 136, 214, 0.342)'
                                    linearColor2 = 'rgba(58, 3, 3, 0.705)'
                                    break
                                default:
                                    linearColor1 = 'rgba(179, 132, 132, 0.342)'
                                    linearColor2 = 'rgba(3, 85, 74, 0.705)'
                                    break
                            }
    
                            resultElements.push((
                                <div
                                    key={currentID}
                                    className='search-recipe-container'
                                    style={{ background: `linear-gradient(180deg, ${linearColor1}, ${linearColor2})` }}
                                    onClick={() => navigate(`/es/es/recipes/${currentID}`)}
                                >
                                    <div className='search-images-container'>
                                        <img src={searchResults[i].pictures[0]} alt='recipe' className='search-result-image' />
                                    </div>
                                    <div className='name-stats'>
                                        <p className='search-recipe-name'>{searchResults[i].name}</p>
                                        <div className='search-author-likes'>
                                            <p>{searchResults[i].likes} Likes</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    } else {
                        resultElements.push((
                            <p key={0}>No se encontraron recetas</p>
                        ))
                    }
    
                    return {
                        ...prevState,
                        elements: resultElements
                    }
                })
                
                setSearching(false)
    
            } catch (err) {
                //console.log(err)
                return (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        placeContent: 'center'
                    }}>
                        <img
                            src='../Images/favicon-gif.gif'
                            alt='icon'
                            style={{
                                marginTop: '200px',
                                width: '200px',
                                filter: 'sepia(40%)'
                            }}
                        />
                    </div>
                )
            }
            }
    
        }
        if (recipeSlice > 10) {
            handleSearch()
        }
        // eslint-disable-next-line
    }, [recipeSlice])

    function handleChange(e) {
        window.sessionStorage.setItem('s-it', e.target.value)
        setResultRecipes((prevState) => {
            return {
                ...prevState,
                searchTerm: e.target.value
            }
        })
    }

    const handleSearch = async() => {

        setRecipeSlice(2)

        const searchIngredients = resultRecipes.searchTerm.replace(',', '').split(' ')

        if (resultRecipes.searchTerm !== '') {

            setSearching(true)

            var searchResults = []

            if (filterRef.current.value === 'name') {
                const foundRecipes = await getRecipesByName({name: resultRecipes.searchTerm, slice: recipeSlice, lng: usrlng})
                if (foundRecipes.data.result.length) {
                    searchResults = [...foundRecipes.data.result].sort((a, b) => b.likes - a.likes)
                }
                setReachedLimit(() => {
                    return foundRecipes.data.limit >= recipeSlice ? false : true
                })
            } else if (filterRef.current.value === 'category') {
                const foundRecipes = await getRecipesByCategory({category: resultRecipes.searchTerm, slice: recipeSlice, lng: usrlng})
                if (foundRecipes.data.result.length) {
                searchResults = [...foundRecipes.data.result].sort((a, b) => b.likes - a.likes)
                }
                setReachedLimit(() => {
                    return foundRecipes.data.limit >= recipeSlice ? false : true
                })
            } else {
                const foundRecipes = await getRecipesByIngredients({ingredients: searchIngredients, slice: recipeSlice, lng: usrlng})
                if (foundRecipes?.data?.result?.length) {
                searchResults = [...foundRecipes.data.result].sort((a, b) => b.likes - a.likes)
                }
                setReachedLimit(() => {
                    return foundRecipes?.data?.limit >= recipeSlice ? false : true
                })
            }

            try {

            setResultRecipes((prevState) => {

                const resultElements = []

                if (searchResults.length > 0) {

                    for (let i = 0; i < searchResults.length; i++) {

                        const currentID = searchResults[i].searchField

                        var linearColor1
                        var linearColor2
                        switch (searchResults[i].category) {
                            case 'Breakfast':
                                linearColor1 = 'rgba(131, 152, 192, 0.514)'
                                linearColor2 = 'rgba(105, 68, 206, 0.514)'
                                break
                            case 'Lunch':
                                linearColor1 = 'rgba(165, 223, 172, 0.315)'
                                linearColor2 = 'rgba(37, 142, 163, 0.514)'
                                break
                            case 'Dinner':
                                linearColor1 = 'rgba(190, 209, 161, 0.315)'
                                linearColor2 = 'rgba(126, 34, 187, 0.514)'
                                break
                            case 'Appetizer':
                                linearColor1 = 'rgba(226, 208, 173, 0.315)'
                                linearColor2 = 'rgba(126, 16, 67, 0.514)'
                                break
                            case 'Salad':
                                linearColor1 = 'rgba(155, 145, 126, 0.171)'
                                linearColor2 = 'rgba(80, 27, 206, 0.514)'
                                break
                            case 'Main-course':
                                linearColor1 = 'rgba(174, 211, 164, 0.171)'
                                linearColor2 = 'rgba(15, 152, 170, 0.514)'
                                break
                            case 'Side-dish':
                                linearColor1 = 'rgba(148, 216, 129, 0.171)'
                                linearColor2 = 'rgba(8, 74, 150, 0.514)'
                                break
                            case 'Baked-goods':
                                linearColor1 = 'rgba(87, 199, 130, 0.377)'
                                linearColor2 = 'rgba(76, 17, 143, 0.637)'
                                break
                            case 'Dessert':
                                linearColor1 = 'rgba(150, 199, 87, 0.377)'
                                linearColor2 = 'rgba(112, 12, 104, 0.637)'
                                break
                            case 'Snack':
                                linearColor1 = 'rgba(56, 151, 112, 0.377)'
                                linearColor2 = 'rgba(17, 15, 160, 0.637)'
                                break
                            case 'Soup':
                                linearColor1 = 'rgba(103, 75, 116, 0.158)'
                                linearColor2 = 'rgba(9, 106, 109, 0.637)'
                                break
                            case 'Holiday':
                                linearColor1 = 'rgba(199, 126, 195, 0.342)'
                                linearColor2 = 'rgba(87, 31, 5, 0.637))'
                                break
                            case 'Vegetarian':
                                linearColor1 = 'rgba(219, 136, 214, 0.342)'
                                linearColor2 = 'rgba(58, 3, 3, 0.705)'
                                break
                            default:
                                linearColor1 = 'rgba(179, 132, 132, 0.342)'
                                linearColor2 = 'rgba(3, 85, 74, 0.705)'
                                break
                        }

                        resultElements.push((
                            <div
                                key={currentID}
                                className='search-recipe-container'
                                style={{ background: `linear-gradient(180deg, ${linearColor1}, ${linearColor2})` }}
                                onClick={() => navigate(`/es/recipes/${currentID}`)}
                            >
                                <div className='search-images-container'>
                                    <img src={searchResults[i].pictures[0]} alt='recipe' className='search-result-image' />
                                </div>
                                <div className='name-stats'>
                                    <p className='search-recipe-name'>{searchResults[i].name}</p>
                                    <div className='search-author-likes'>
                                        <p>{searchResults[i].likes} Likes</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                } else {
                    resultElements.push((
                        <p key={0}>No se encontraron recetas</p>
                    ))
                }

                return {
                    ...prevState,
                    elements: resultElements
                }
            })
            
            setSearching(false)

        } catch (err) {
            //console.log(err)
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeContent: 'center'
                }}>
                    <img
                        src='../Images/favicon-gif.gif'
                        alt='icon'
                        style={{
                            marginTop: '200px',
                            width: '200px',
                            filter: 'sepia(40%)'
                        }}
                    />
                </div>
            )
        }
        }

    }
    
    return (
        <>
            <div id="search-page-container">
                <h1 id="search-page-title">Buscar recetas</h1>
                <div id="search-container">
                    <div id='search-fields-container'>
                        <p id='filter-label'>Buscar Por</p>
                        <select defaultValue={'name'} id='filter-select' ref={filterRef}>
                            <option
                                value='name'
                            >Nombre
                            </option >
                            <option
                                value='category'
                            >Categoría
                            </option >
                            <option
                                value='ingredients'
                            >Ingredientes
                            </option >
                        </select>
                        <input
                            type="text"
                            value={resultRecipes.searchTerm}
                            id='search-field'
                            placeholder='Escribe una palabra para buscar'
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch()
                            }}
                            ref={searchRef}
                        />
                        <div id='search-icon-container'>
                            <img src="../Images/search.png" alt="search" onClick={handleSearch} id='search-icon'/>
                        </div>
                    </div>
                    <div id="search-results-container">
                        {resultRecipes.elements}
                        <p style={{display: reachedLimit ? 'none' : 'block', cursor: 'pointer'}} onClick={() => setRecipeSlice((prevState) => {
                            return prevState + 2
                        })}>Mostrar más resultados...</p>
                    </div>
                    <div id='search-loading' style={{ display: searching ? 'grid' : 'none', width: '700px' }}>
                        <div className="lds-dual-ring" style={{padding: '100px', width: '300px', height: '300px'}}></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchPage