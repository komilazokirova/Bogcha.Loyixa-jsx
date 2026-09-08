import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";
import { canAccess } from "../lib/roles";

// Login birinchi ko'rinadigan sahifa bo'lgani uchun oddiy import qilinadi
import Login from "../pages/Login/Login";

// Qolgan barcha sahifalar LAZY (kerak bo'lgandagina yuklanadi)
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Attendance = lazy(() => import("../pages/Attendance/Attendance"));
const Children = lazy(() => import("../pages/Children/Children"));
const ChildForm = lazy(() => import("../pages/Children/ChildForm"));
const ChildProfile = lazy(() => import("../pages/Children/ChildProfile"));
const Groups = lazy(() => import("../pages/Groups/Groups"));
const GroupProfile = lazy(() => import("../pages/Groups/GroupProfile"));
const GroupForm = lazy(() => import("../pages/Groups/GroupForm"));
const Payments = lazy(() => import("../pages/Payments/Payments"));
const Staff = lazy(() => import("../pages/Staff/Staff"));
const StaffForm = lazy(() => import("../pages/Staff/StaffForm"));

function PageLoader() {
    return (
        <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-sky" />
        </div>
    );
}

function PrivateRoute({ children }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

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
            <Suspense fallback={<PageLoader />}>
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

                        <Route path="/children" element={<RoleRoute permission="children"><Children /></RoleRoute>} />
                        <Route path="/children/new" element={<RoleRoute permission="childrenWrite"><ChildForm /></RoleRoute>} />
                        <Route path="/children/:id" element={<RoleRoute permission="children"><ChildProfile /></RoleRoute>} />
                        <Route path="/children/:id/edit" element={<RoleRoute permission="childrenWrite"><ChildForm /></RoleRoute>} />

                        <Route path="/groups" element={<RoleRoute permission="groups"><Groups /></RoleRoute>} />
                        <Route path="/groups/:id" element={<RoleRoute permission="groups"><GroupProfile /></RoleRoute>} />
                        <Route path="/groups/new" element={<RoleRoute permission="groups"><GroupForm /></RoleRoute>} />

                        <Route path="/payments" element={<RoleRoute permission="payments"><Payments /></RoleRoute>} />

                        <Route path="/staff" element={<RoleRoute permission="staff"><Staff /></RoleRoute>} />
                        <Route path="/staff/new" element={<RoleRoute permission="staff"><StaffForm /></RoleRoute>} />
                        <Route path="/staff/:id/edit" element={<RoleRoute permission="staff"><StaffForm /></RoleRoute>} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}