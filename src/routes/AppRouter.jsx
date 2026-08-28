import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";
import Children from "../pages/Children/Children";
import ChildForm from "../pages/Children/ChildForm";
import Profile from "../pages/Profile/Profile";
import Groups from "../pages/Groups/Groups";
import GroupProfile from "../pages/Groups/GroupProfile";
import Payments from "../pages/Payments/Payments";
import Staff from "../pages/Staff/Staff";
import Attendance from "../pages/Attendance/Attendance";

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
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/:id" element={<GroupProfile />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/attendance" element={<Attendance />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}