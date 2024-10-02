import React from 'react';
import { ToastContainer } from 'react-toastify';
import useAuth from '../../../../hooks/useAuth';
import { useProfile } from '../../../../hooks/useProfile';
import { ProfileInfo } from '../../../../components/ProfileInfo';
import { ProfileForm } from '../../../../components/ProfileForm';
import LoadingSpinner from '../../../../components/LoadingSpinner';

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

    if (!user) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="flex-1 p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
            
            <div className="max-w-lg mx-auto">
                <ProfileInfo user={user} previewImage={previewImage} />
                
                <ProfileForm
                    formData={formData}
                    isLoading={isLoading}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                />
            </div>
            
            <ToastContainer />
        </div>
    );
}