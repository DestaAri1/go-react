import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import { AdminRoute, AuthRoute, ProtectedRoute } from "./utils/AuthRoute.js";
import Home from "./pages/Home/Home.jsx";
import Concert from "./pages/Concerts/Concert.jsx";
import Tickets from "./pages/User/Tickets/Tickets.tsx";
import TicketsDetail from "./pages/User/Tickets/TicketsDetail.jsx";
import Profile from "./pages/User/Profile/Profile.jsx";
import Dashboard from "./pages/User/Dashboard/Dashboard.jsx";
import DashProfile from "./pages/User/Dashboard/DashProfile.jsx";
import DashConcerts from "./pages/User/Dashboard/DashConcerts.jsx";
import UpdateConcerts from "./pages/User/Dashboard/UpdateConcerts.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman yang tidak memerlukan auth */}
        <Route path="/login" element={<AuthRoute><Login/></AuthRoute>}/>
        <Route path="/register" element={<AuthRoute><Register/></AuthRoute>}/>

        {/* Halaman yang memerlukan auth */}
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/concerts" element={<ProtectedRoute><Concert/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/tickets" element={<ProtectedRoute><Tickets/></ProtectedRoute>}/>
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketsDetail/></ProtectedRoute>}/>

        {/* halaman untuk admin */}
        <Route path="/dashboard" element={<AdminRoute><Dashboard/></AdminRoute>}/>
        <Route path="/dashboard/profile" element={<AdminRoute><DashProfile/></AdminRoute>}/>
        <Route path="/dashboard/event" element={<AdminRoute><DashConcerts/></AdminRoute>}/>
        <Route path="/dashboard/event/:id" element={<AdminRoute><UpdateConcerts/></AdminRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
