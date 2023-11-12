import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import Layout from './components/Layout'
import Login from './features/auth/Login'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import NewUser from './features/users/NewUser'
import SearchPage from './components/SearchPage'
import BestRecipes from './features/recipes/BestRecipes'
import NewestRecipes from './features/recipes/NewestRecipes'
import RecipePage from './features/recipes/RecipePage'
import MyRecipesPage from './features/recipes/MyRecipesPage'
import MyCollections from './features/recipes/MyCollections'
import MyActivity from './features/users/MyActivity'
import MyFavoriteRecipesPage from './features/recipes/MyFavoriteRecipesPage'
import UserPage from './features/users/UserPage'
import AccountPage from './features/users/AccountPage'
import NewRecipePage from './features/recipes/NewRecipePage'
import EditRecipePage from './features/recipes/EditRecipePage'
import DeleteConfirmPage from './features/recipes/DeleteConfirmPage'
import AccountDeleteConfirmation from './features/users/AccountDeleteConfirmation'
import Shop from './components/Shop'
//import Prefetch from './features/auth/Prefetch'
import PrefetchUser from './features/auth/PrefetchUser'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import ESLayout from './es/components/ESLayout'
import ESWelcome from './es/components/ESWelcome'
import ESLogin from './es/features/auth/ESLogin'
import ESNewUser from './es/features/users/ESNewUser'
import ESSearchPage from './es/components/ESSearchPage'
import ESBestRecipes from './es/features/recipes/ESBestRecipes'
import ESNewestRecipes from './es/features/recipes/ESNewestRecipes'
import ESRecipePage from './es/features/recipes/ESRecipePage'
import ESNewRecipePage from './es/features/recipes/ESNewRecipePage'
import ESUserPage from './es/features/users/ESUserPage'
import ESAccountDeleteConfirmation from './es/features/users/ESAccountDeleteConfirmation'
import ESDashboard from './es/components/ESDashboard'
import ESMyFavoriteRecipesPage from './es/features/recipes/ESMyFavoriteRecipesPage'
import ESMyRecipesPage from './es/features/recipes/ESMyRecipesPage'
import ESMyCollections from './es/features/recipes/ESMyCollections'
import ESMyActivity from './es/features/users/ESMyActivity'
import ESEditRecipePage from './es/features/recipes/ESEditRecipePage'
import ESDeleteConfirmPage from './es/features/recipes/ESDeleteConfirmPage'
import ESAccountPage from './es/features/users/ESAccountPage'
import RecipeNotFound from './features/recipes/RecipeNotFound'
import ESRecipeNotFound from './es/features/recipes/ESRecipeNotFound'
import UserNotFound from './features/users/UserNotFound'
import ESUserNotFound from './es/features/users/ESUserNotFound'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PersistLogin />}>
      {/* <Route element={<Prefetch />}> */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<NewUser />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="recipes/best" element={<BestRecipes />} />
        <Route path="recipes/newest" element={<NewestRecipes />} />
        <Route path="recipes/:id" element={<RecipePage />} />
        <Route path="recipes/new" element={<NewRecipePage />} />
        <Route path="shop" element={<Shop />} />
        <Route path="user/:id" element={<UserPage />} />
        <Route path="user/deleted" element={<AccountDeleteConfirmation />} />
        <Route path="recipe/404" element={<RecipeNotFound />} />
        <Route path="user/404" element={<UserNotFound />} />
        <Route element={<RequireAuth />}>
          <Route element={<PrefetchUser />}>
            <Route path="dash">
              <Route index element={<Dashboard />} />
              <Route path="favorites" element={<MyFavoriteRecipesPage />} />
              <Route path="myrecipes" element={<MyRecipesPage />} />
              <Route path="collections" element={<MyCollections />} />
              <Route path="activity" element={<MyActivity />} />
              <Route path="myrecipes/:id/edit" element={<EditRecipePage />} />
              <Route path="myrecipes/deleted" element={<DeleteConfirmPage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/es" element={<ESLayout />}>
          <Route index element={<ESWelcome />} />
          <Route path="login" element={<ESLogin />} />
          <Route path="signup" element={<ESNewUser />} />
          <Route path="search" element={<ESSearchPage />} />
          <Route path="recipes/best" element={<ESBestRecipes />} />
          <Route path="recipes/newest" element={<ESNewestRecipes />} />
          <Route path="recipes/:id" element={<ESRecipePage />} />
          <Route path="recipes/new" element={<ESNewRecipePage />} />
          <Route path="shop" element={<Shop />} />
          <Route path="user/:id" element={<ESUserPage />} />
          <Route path="user/deleted" element={<ESAccountDeleteConfirmation />} />
          <Route path="recipe/404" element={<ESRecipeNotFound />} />
          <Route path="user/404" element={<ESUserNotFound />} />
          <Route element={<RequireAuth />}>
            <Route element={<PrefetchUser />}>
              <Route path="dash">
                <Route index element={<ESDashboard />} />
                <Route path="favorites" element={<ESMyFavoriteRecipesPage />} />
                <Route path="myrecipes" element={<ESMyRecipesPage />} />
                <Route path="collections" element={<ESMyCollections />} />
                <Route path="activity" element={<ESMyActivity />} />
                <Route path="myrecipes/:id/edit" element={<ESEditRecipePage />} />
                <Route path="myrecipes/deleted" element={<ESDeleteConfirmPage />} />
                <Route path="account" element={<ESAccountPage />} />
              </Route>
            </Route>
          </Route>
      </Route>
      </Route>
      {/* </Route> */}
    </Route>
  )
)

function App() {
  document.title = 'Recipe Explorer'

  return (
    <RouterProvider router={router} />
  )
}

export default App