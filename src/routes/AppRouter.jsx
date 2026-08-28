import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";
import Children from "../pages/Children/Children";
import ChildForm from "../pages/Children/ChildForm";
import Profile from "../pages/Profile/Profile";
import ChildProfile from "../pages/Children/ChildProfile";

function PrivateRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/children" element={<Children />} />
                    <Route path="/children/new" element={<ChildForm />} />
                    <Route path="/children/:id/edit" element={<ChildForm />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/children/:id" element={<ChildProfile />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}