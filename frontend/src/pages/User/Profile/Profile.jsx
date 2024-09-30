import React, { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import Navbar from '../../../layouts/Navbar';
import TextView from '../../../components/Text.jsx';
import Input from '../../../components/Input.js';
import { updateUser } from '../../../services/authService.js';
import { showSuccessToast } from '../../../utils/Toast.js';
import { ToastContainer } from 'react-toastify';
import LoadingSpinner from '../../../components/LoadingSpinner.js';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await updateUser(formData.username, formData.password, formData.image);
            
            // Update the user data after success
            setUser((prevUser) => ({
                ...prevUser,
                name: formData.username || prevUser.name,
                image: previewImage || prevUser.image, // Use the preview image URL
            }));

            showSuccessToast(response.message);

            setFormData({ username: '', password: '', image: null });

            setTimeout(() => {
                window.location.reload();
            }, 2000); // Wait for 2 seconds before refreshing
        } catch (err) {
            setError(err.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Navbar />
            <div className="flex-grow container flex justify-center items-center">
                {user ? (
                    <div className="w-full max-w-md">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
                            <div className="flex flex-col items-center">
                                <img
                                    src={previewImage || (user.image ? `http://127.0.0.1:3000/uploads/${user.image}` : '/user-regular.svg')}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full bg-white mb-4"
                                />
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-400 mb-2">{user.email}</p>
                                <p className="text-gray-400">{user.role === 0 ? 'Admin' : 'User'}</p>
                                <div className="mt-6 space-y-2 w-full">
                                    <TextView label="Username :" data={user.name} />
                                    <TextView label="Email :" data={user.email} />
                                    <TextView label="Role :" data={user.role === 0 ? 'Admin' : 'User'} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-lg mt-5">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                                <h1 className="text-2xl font-bold mb-6 text-center">Change Profile</h1>
                                <form className="mt-6 w-full" onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="mb-4">
                                        <Input
                                            label="Change Username"
                                            label_color="text-gray-400"
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Input
                                            label="Change Password"
                                            label_color="text-gray-400"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="image" className="block text-white mb-2">Change Profile Image</label>
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                                        />
                                    </div>
                                    {loading && <LoadingSpinner/>}
                                    {error && <p className="text-center text-red-500">{error}</p>}
                                    {success && <p className="text-center text-green-500">{success}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                                        disabled={loading}
                                    >
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No user data available.</p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}