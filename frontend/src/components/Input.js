import React from 'react';

const Input = ({ label, label_color = "text-gray-700", type, name, value, onChange }) => {
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
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default Input;
