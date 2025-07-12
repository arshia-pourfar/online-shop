"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleAuth = (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        // --- Frontend-only simulation of auth logic ---
        // In a real application, you would send this data to your backend
        // for actual authentication/registration.

        if (email === 'test@example.com' && password === 'password') {
            setMessage(`Successfully ${isRegistering ? 'registered' : 'logged in'}! (Simulated)`);
            setMessageType('success');
            // In a real app, you'd redirect the user here
            console.log(`Simulated ${isRegistering ? 'registration' : 'login'} for: ${email}`);
        } else if (isRegistering && password.length < 6) {
            setMessage('Password must be at least 6 characters long for registration.');
            setMessageType('error');
        }
        else {
            setMessage(`Failed to ${isRegistering ? 'register' : 'log in'}. Invalid credentials. (Simulated)`);
            setMessageType('error');
        }
        // --- End of simulation ---
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4 w-full h-full">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-extrabold text-white text-center mb-6">
                    {isRegistering ? 'Register' : 'Login'}
                </h2>
                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-sm ${messageType === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="your@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                    >
                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default LoginPage;
