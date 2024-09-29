import React from 'react';

const TextView = ({ location = "justify-between", label, data }) => {
  return (
    <div className={`flex ${location}`}>
        <span className="text-gray-400">{label}</span>
        <span>{data}</span>
    </div>
  );
};

export default TextView;
