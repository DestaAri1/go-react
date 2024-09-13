import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import { login } from '../../services/authService';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const data = await login(formData.email, formData.password);
        console.log(data); // Jika berhasil login, tangani responsnya
        // Redirect atau simpan token di local storage
      } catch (err) {
        setError(err.message || 'Login failed'); // Tampilkan error
      }
    };
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
            <Input 
                label="Email" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
            />
            <Input 
                label="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
            />
            <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
                Login
            </button>
            </form>
            <p className="text-center text-sm mt-4">
            Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
            </p>
        </div>
    </div>
    );
};
