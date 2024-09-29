import React, { useState } from 'react';
import Input from '../../components/Input';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showErrorToast } from '../../utils/Toast';
import { ToastContainer } from 'react-toastify';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false); // State untuk loading
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading menjadi true saat submit
        try {
            await register(formData.username, formData.email, formData.password);
            window.location.reload()
            navigate('/', { state: { message: `Account successfully created` }});
        } catch (err) {
            showErrorToast(err.message || "Failed register")
        } finally {
            setLoading(false); // Set loading menjadi false setelah respons diterima (baik success atau error)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
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
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        disabled={loading} // Disabled tombol saat loading
                    >
                        {loading ? (<LoadingSpinner/>) : (
                            'Register'
                        )}
                    </button>
                </form>
                <p className="text-center text-sm mt-4">
                    Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}
