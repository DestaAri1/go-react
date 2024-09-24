import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import { AuthRoute, ProtectedRoute } from "./utils/AuthRoute.js";
import Home from "./pages/Home/Home.tsx";
import Concert from "./pages/Concerts/Concert.tsx";
import Tickets from "./pages/User/Tickets/Tickets.tsx";
import TicketsDetail from "./pages/User/Tickets/TicketsDetail.jsx";

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
        <Route path="/tickets" element={<ProtectedRoute><Tickets/></ProtectedRoute>}/>
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketsDetail/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
