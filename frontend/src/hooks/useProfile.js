import { useState, useEffect } from 'react';
import { updateUser } from '../services/authService';
import { showSuccessToast, showErrorToast } from '../utils/Toast';

export const useProfile = (user, setUser) => {
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData(prevState => ({
                ...prevState,
                username: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

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

        try {
            const response = await updateUser(formData.username, formData.password, formData.image);
            
            setUser((prevUser) => ({
                ...prevUser,
                name: formData.username || prevUser.name,
                email: formData.email || prevUser.email,
                image: previewImage || prevUser.image,
            }));

            showSuccessToast(response.message);
            setFormData(prevState => ({ ...prevState, password: '' }));

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            showErrorToast(err.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        formData,
        previewImage,
        handleChange,
        handleFileChange,
        handleSubmit
    };
};