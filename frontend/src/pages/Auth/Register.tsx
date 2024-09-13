import React, { useState } from 'react'
import Input from '../../components/Input';
import { Link } from 'react-router-dom';
import { register } from '../../services/authService';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
        try {
            const data = await register(formData.name, formData.email, formData.password);
            console.log(data);
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
                <Input 
                label="Name" 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                />
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
                <button type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                Register
                </button>
            </form>
            <p className="text-center text-sm mt-4">
                Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
            </p>
        </div>
    </div>
    )
}
