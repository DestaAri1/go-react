import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import { AuthRoute, ProtectedRoute } from "./hooks/AuthRoute.js";
import Home from "./pages/Home/Home.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman yang tidak memerlukan auth */}
        <Route path="/login" element={<AuthRoute><Login/></AuthRoute>}/>
        <Route path="/register" element={<AuthRoute><Register/></AuthRoute>}/>

        {/* Halaman yang memerlukan auth */}
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
