import React from 'react';

export const ProfileInfo = ({ user, previewImage }) => {
    const profileImage = previewImage || 
        (user.image ? `http://127.0.0.1:3000/uploads/${user.image}` : '/user-regular.svg');

    return (
        <div className="bg-white shadow-md p-6 rounded-lg mb-6">
            <div className="flex flex-col items-center">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.role === 0 ? 'Admin' : 'User'}</p>
            </div>
        </div>
    );
};