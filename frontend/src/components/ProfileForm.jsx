import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import Input from './Input';

export const ProfileForm = ({ 
    formData, 
    isLoading, 
    handleChange, 
    handleFileChange, 
    handleSubmit 
}) => {
    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white shadow-md p-6 rounded-lg">
            <div className="mb-4">
                <Input
                    label="Name"
                    type="text"
                    name="username"
                    tampilan='admin'
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>
            
            <div className="mb-4">
                <Input
                    label="Email"
                    type="email"
                    tampilan='admin'
                    value={formData.email}
                    onChange={handleChange}
                    readonly
                />
            </div>

            <div className="mb-4">
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    tampilan='admin'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={'Leave blank to keep current password'}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Change Profile Image</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded bg-gray-100 text-gray-700 border border-gray-300"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                disabled={isLoading}
            >
                {isLoading ? <LoadingSpinner /> : 'Update Profile'}
            </button>
        </form>
    );
};