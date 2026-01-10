import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import {StrictMode} from "react";
import LoginPage from "./pages/LoginPage.jsx";
import DashBoardPage from "./pages/DashBoardPage.jsx";
import UsersPage from "./pages/users/UsersPage.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path='/dashboard' element={<DashBoardPage />}/>
                <Route path='/login' element={<LoginPage />}/>
                <Route path='/users' element={<UsersPage />}/>
            </Route>
        )
    )

    return (
        <RouterProvider router={router}></RouterProvider>
    )
}

export default App
