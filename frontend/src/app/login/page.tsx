"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import { loginUser, registerUser, saveToken } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/authContext";
import Header from "@/components/Header";

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    const router = useRouter();
    const { login } = useAuth();

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");

        try {
            if (isRegistering) {
                const response = await registerUser(name, email, password, phone);

                setMessage("Registration successful, you are now logged in.");
                setMessageType("success");

                saveToken(response.token);
                login(response.user);
                router.push("/");
            } else {
                const response = await loginUser(email, password);

                setMessage(`Welcome ${response.user.name}`);
                setMessageType("success");

                saveToken(response.token);
                login(response.user);

                router.push(response.user.role === "ADMIN" ? "/dashboard" : "/");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Unknown error occurred");
            }
            setMessageType("error");
        }
    };

    return (
        <>
            <Header />

            <div className="flex items-center justify-center min-h-screen bg-primary-bg font-sans p-4 w-full h-full fixed left-0 md:top-auto top-0">
                <div className="bg-secondary-bg p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/30">
                    <h2 className="text-3xl font-extrabold text-primary-text text-center mb-6">
                        {isRegistering ? "Register" : "Login"}
                    </h2>

                    {message && (
                        <div className={`p-3 mb-4 rounded-lg text-sm px-4 py-2 text-center font-medium shadow ${messageType === "error" ? "text-status-negative bg-status-negative/10 border border-status-negative/40" : "text-status-positive bg-status-positive/10 border border-status-positive/40"}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-5">
                        {isRegistering && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-secondary-text text-sm font-medium mb-2">Name</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full pl-10 pr-3 py-2 bg-primary-bg border border-secondary-bg rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-secondary-text text-sm font-medium mb-2">Phone</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
                                        <input
                                            type="text"
                                            id="phone"
                                            className="w-full pl-10 pr-3 py-2 bg-primary-bg border border-secondary-bg rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent"
                                            placeholder="09123456789"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

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
                            className="mt-4 w-full bg-gradient-to-r from-accent to-accent/70 hover:to-accent text-primary-bg font-bold py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg cursor-pointer"
                        >
                            {isRegistering ? "Register" : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-accent hover:text-accent-alt text-base font-medium transition-colors duration-200 cursor-pointer"
                        >
                            {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
