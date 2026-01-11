import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import {StrictMode} from "react";
import LoginPage from "./pages/LoginPage.jsx";
import DashBoardPage from "./pages/DashBoardPage.jsx";
import UsersPage from "./pages/users/UsersPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SchemasPage from "./pages/destinationSchemas/DestinationSchemaPage.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        <DashBoardPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/users' element={
                    <ProtectedRoute>
                        <UsersPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/schemas' element={
                    <ProtectedRoute>
                        <SchemasPage/>
                    </ProtectedRoute>
                }/>
            </Route>
        )
    )

    return (
        <RouterProvider router={router}></RouterProvider>
    )
}

export default App
