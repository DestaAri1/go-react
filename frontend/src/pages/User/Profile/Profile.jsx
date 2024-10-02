import React, { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import Navbar from '../../../layouts/Navbar';
import TextView from '../../../components/Text.jsx';
import Input from '../../../components/Input.js';
import { ToastContainer } from 'react-toastify';
import { useProfile } from '../../../hooks/useProfile.js';

export default function Profile() {
    const { user, setUser } = useAuth();
    const {
        isLoading,
        formData,
        previewImage,
        handleChange,
        handleFileChange,
        handleSubmit
    } = useProfile(user, setUser);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

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
                                            tampilan='user'
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
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                                        disabled={isLoading}
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