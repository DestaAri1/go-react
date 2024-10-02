import React from 'react';

export default function Input({ label, label_color = "text-gray-700", type, name, value, onChange, tampilan = 'user', placeholder }) {
  
  const getStyle = () => {
    switch (tampilan) {
      case 'user':
        return 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline3';
      case 'admin':
        return 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300';
      default:
        return 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
    }
  };

  return (
    <div className="mb-4">
      <label className={`block ${label_color} text-sm font-bold mb-2`} htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${getStyle()}`}
        placeholder={placeholder}
      />
    </div>
  );
};
