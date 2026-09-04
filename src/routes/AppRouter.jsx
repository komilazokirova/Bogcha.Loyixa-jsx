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
import StaffForm from "../pages/Staff/StaffForm";
import Attendance from "../pages/Attendance/Attendance";
import ChildProfile from "../pages/Children/ChildProfile";
import GroupForm from "../pages/Groups/GroupForm";
import { canAccess } from "../lib/roles";

function PrivateRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// permission orqali tekshiramiz — markaziy ruxsat tizimiga bog'liq
function RoleRoute({ children, permission }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (permission && !canAccess(permission, user?.role)) {
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
                            <RoleRoute permission="children">
                                <Children />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/children/new"
                        element={
                            <RoleRoute permission="childrenWrite">
                                <ChildForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/children/:id"
                        element={
                            <RoleRoute permission="children">
                                <ChildProfile />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/children/:id/edit"
                        element={
                            <RoleRoute permission="childrenWrite">
                                <ChildForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/groups"
                        element={
                            <RoleRoute permission="groups">
                                <Groups />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/groups/:id"
                        element={
                            <RoleRoute permission="groups">
                                <GroupProfile />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/groups/new"
                        element={
                            <RoleRoute permission="groups">
                                <GroupForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/payments"
                        element={
                            <RoleRoute permission="payments">
                                <Payments />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/staff"
                        element={
                            <RoleRoute permission="staff">
                                <Staff />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/staff/new"
                        element={
                            <RoleRoute permission="staff">
                                <StaffForm />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/staff/:id/edit"
                        element={
                            <RoleRoute permission="staff">
                                <StaffForm />
                            </RoleRoute>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}