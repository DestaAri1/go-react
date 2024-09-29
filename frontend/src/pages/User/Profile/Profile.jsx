import React from 'react';
import useAuth from '../../../hooks/useAuth';
import Navbar from '../../../layouts/Navbar';
import TextView from '../../../components/Text.jsx';

export default function Profile() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />
      <div className="flex-grow container flex justify-center items-center">
      
      {/* Profile Section */}
          {user ? (
            <div className='w-full max-w-md'>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
                    <div className="flex flex-col items-center">
                        {/* User Image */}
                        <img
                            src={user.image ? `http://127.0.0.1:3000/uploads/${user.image}` : '/user-regular.svg'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full bg-white mb-4"
                        />
                        
                        {/* User Info */}
                        <h2 className="text-xl font-semibold">{user.username}</h2>
                        <p className="text-gray-400 mb-2">{user.email}</p>
                        <p className="text-gray-400">{user.role === 0 ? 'Admin' : 'User'}</p>
                        
                        {/* Additional Profile Info */}
                        <div className="mt-6 space-y-2 w-full">
                            <TextView 
                                label={"Username :"}
                                data={user.name}
                            />
                            <TextView 
                                label={"Email :"}
                                data={user.email}
                            />
                            <TextView 
                                label={"Role :"}
                                data={user.role === 0 ? 'Admin' : 'User'}
                            />
                        </div>
                    </div>
                </div>
                <div className='bg-gray-800x rounded-lg shadow-lg mt-5'>
                    {/* Update Section */}
                    <div className="flex-grow container mx-auto flex">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>

                        {user ? (
                            <div className="flex flex-col items-center">
                            {/* Form for updating username, password, and image */}
                            <form className="mt-6 w-full" >
                                <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-400 mb-2">Change Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={null}
                                    onChange={null}
                                    className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                                />
                                </div>

                                <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-400 mb-2">Change Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={null}
                                    onChange={null}
                                    className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                                />
                                </div>

                                <div className="mb-4">
                                <label htmlFor="image" className="block text-gray-400 mb-2">Change Profile Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={null}
                                    className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                                />
                                </div>

                                <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                                >
                                Update Profile
                                </button>
                            </form>
                            </div>
                        ) : (
                            <p className="text-center text-gray-400">No user data available.</p>
                        )}
                        </div>
                    </div>
                </div>
            </div>
          ) : (
              <p className="text-center text-gray-400">No user data available.</p>
            )}
        </div>
    </div>
  );
}
