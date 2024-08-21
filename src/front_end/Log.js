import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [Name, setName] = useState('');

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleButtonClick = () => {
        if (Name.trim()) {
            onLogin(Name);  // Pass the Name to Main
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission or other default behavior
            handleButtonClick(); // Trigger the button click handler
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <label className="input input-bordered border-2 border-gray-300 rounded-lg flex items-center gap-2 p-4">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Name"
                        value={Name}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                </label>
                <button className="input input-bordered border-2 border-gray-300 rounded-lg p-4" onClick={handleButtonClick}>
                    Login
                </button>
            </div>
        </div>
    );
}

