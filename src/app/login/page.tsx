"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { loginUser, saveToken } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/authContext";  // اضافه کن

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'error'

    const router = useRouter();
    const { login } = useAuth();  // از Context، تابع login رو بگیر

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        try {
            const response = await loginUser(email, password);

            setMessage(`Welcome ${response.user.name}`);
            setMessageType("success");

            saveToken(response.token);

            // این خط رو حذف کن چون حالا Context ذخیره می‌کنه
            // localStorage.setItem("user", JSON.stringify(response.user));

            // آپدیت Context
            login(response.user);

            // هدایت بعد از لاگین
            if (response.user.role === "ADMIN") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Unknown login error");
            }
            setMessageType("error");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg font-sans p-4 w-full h-full">
            <div className="bg-secondary-bg p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/30">
                <h2 className="text-3xl font-extrabold text-primary-text text-center mb-6">
                    {isRegistering ? "Register" : "Login"}
                </h2>
                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-sm ${messageType === "error" ? "bg-status-negative text-primary-text" : "bg-status-positive text-primary-text"}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-secondary-text text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
                            <input
                                type="email"
                                id="email"
                                className="w-full pl-10 pr-3 py-2 bg-primary-bg border border-secondary-bg rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="your@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-secondary-text text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
                            <input
                                type="password"
                                id="password"
                                className="w-full pl-10 pr-3 py-2 bg-primary-bg border border-secondary-bg rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent-alt text-primary-bg font-bold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        {isRegistering ? "Register" : "Login"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-accent hover:text-accent-alt text-sm transition-colors duration-200"
                    >
                        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
