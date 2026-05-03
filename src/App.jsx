import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import {StrictMode} from "react";
import LoginPage from "./pages/LoginPage.jsx";
import DashBoardPage from "./pages/DashBoardPage.jsx";
import UsersPage from "./pages/users/UsersPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SchemasPage from "./pages/destinationSchemas/DestinationSchemaPage.jsx";
import SchemaFieldsPage from "./pages/schemaFields/SchemaFieldsPage.jsx";
import MappingTemplate from "./pages/mappingTemplates/MappingTemplate.jsx";
import MigrationJobsPage from "./pages/migrationJobs/MigrationJobsPage.jsx";
import MigrationJobDetailPage from "./pages/migrationJobs/MigrationJobDetailPage.jsx";
import CustomersPage from "./pages/customers/CustomersPage.jsx";
import AccountsPage from "./pages/accounts/AccountsPage.jsx";
import NotificationsPage from "./pages/notifications/NotificationsPage.jsx";
import AuditLogsPage from "./pages/auditLogs/AuditLogsPage.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/' element={
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
                <Route path='/schema-fields' element={
                    <ProtectedRoute>
                        <SchemaFieldsPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/mapping-templates' element={
                    <ProtectedRoute>
                        <MappingTemplate/>
                    </ProtectedRoute>
                }/>
                <Route path='/migration-jobs' element={
                    <ProtectedRoute>
                        <MigrationJobsPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/migration-jobs/:id' element={
                    <ProtectedRoute>
                        <MigrationJobDetailPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/customers' element={
                    <ProtectedRoute>
                        <CustomersPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/accounts' element={
                    <ProtectedRoute>
                        <AccountsPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/notifications' element={
                    <ProtectedRoute>
                        <NotificationsPage/>
                    </ProtectedRoute>
                }/>
                <Route path='/audit-logs' element={
                    <ProtectedRoute>
                        <AuditLogsPage/>
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
