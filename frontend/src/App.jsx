import React from "react";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

// import toast from 'react-hot-toast';
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Navigate } from "react-router-dom";

//Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
};

const RedirectAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  } else {
    return children;
  }
};

const App = () => {
  return (
    <div className="relative h-full w-hull">
      {/* the gradient effect at the bottom */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#171618_65%,#F3A326_100%)]" />
      <Routes>
        {/* homepage is public */}
        <Route path="/" element={<HomePage />} />

        {/* Protect */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticated>
              <SignUpPage />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticated>
              <LoginPage />
            </RedirectAuthenticated>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
