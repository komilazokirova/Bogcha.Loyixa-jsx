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
import ChildProfile from "../pages/Children/ChildProfile";

function PrivateRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
function RoleRoute({ children, allowedRoles }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/attendance" element={<Attendance />} />

                    <Route
                        path="/children"
                        element={
                            <RoleRoute allowedRoles={["admin", "director", "teacher"]}>
                                <Children />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/children/new"
                        element={
                            <RoleRoute allowedRoles={["admin", "director"]}>
                                <ChildForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/children/:id"
                        element={
                            <RoleRoute allowedRoles={["admin", "director", "teacher"]}>
                                <ChildProfile />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/children/:id/edit"
                        element={
                            <RoleRoute allowedRoles={["admin", "director"]}>
                                <ChildForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/groups"
                        element={
                            <RoleRoute allowedRoles={["admin", "director"]}>
                                <Groups />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/groups/:id"
                        element={
                            <RoleRoute allowedRoles={["admin", "director"]}>
                                <GroupProfile />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/payments"
                        element={
                            <RoleRoute allowedRoles={["admin", "director"]}>
                                <Payments />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/staff"
                        element={
                            <RoleRoute allowedRoles={["admin", "director"]}>
                                <Staff />
                            </RoleRoute>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}