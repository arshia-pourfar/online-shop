'use client';

import React, { useState } from "react";
import { useAuth } from "@/lib/context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faUsers,
    faBoxOpen,
    faChartLine,
    faGear,
    faSignOutAlt,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import clsx from 'clsx';

type TabButtonProps = {
    active: boolean;
    onClick: () => void;
    icon: IconDefinition;
    label: string;
};

const SettingPage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<string>("profile");

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-primary-bg text-primary-text">
                <h2 className="text-xl font-bold">Please log in to access settings.</h2>
            </div>
        );
    }

    const isAdmin = user.role === "ADMIN";

    return (
        <div className="flex flex-col w-full h-full bg-primary-bg text-primary-text">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-accent text-center tracking-tight">
                        Account Settings
                    </h1>

                    {/* Tabs */}
                    <nav className="flex flex-wrap gap-2 md:gap-6 justify-center border-b border-gray-700/40 mb-10 pb-2">
                        <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={faUser} label="Profile" />

                        {isAdmin && (
                            <>
                                <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={faUsers} label="User Management" />
                                <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")} icon={faBoxOpen} label="Product Management" />
                                <TabButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")} icon={faChartLine} label="Reports" />
                            </>
                        )}

                        {!isAdmin && (
                            <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={faGear} label="Personal Settings" />
                        )}
                    </nav>

                    {/* Content */}
                    <section className="mt-4">
                        {activeTab === "profile" && <ProfileTab user={user} />}
                        {isAdmin && activeTab === "users" && <UsersManagement />}
                        {isAdmin && activeTab === "products" && <ProductsManagement />}
                        {isAdmin && activeTab === "reports" && <Reports />}
                        {!isAdmin && activeTab === "preferences" && <UserPreferences />}
                    </section>

                    {/* Logout Button */}
                    <div className="flex justify-end mt-12">
                        <button
                            onClick={logout}
                            className="bg-gradient-to-r from-status-negative to-red-700 hover:brightness-110 px-6 py-3 rounded-xl text-white font-bold flex items-center gap-3 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-status-negative"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200',
                active
                    ? 'bg-accent text-white'
                    : 'bg-secondary-bg text-secondary-text hover:bg-accent/20'
            )}
        >
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};

// Profile tab section
const ProfileTab = ({ user }: { user: { name: string; role: string } }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSave = () => {
        // Placeholder for save logic
        setMessage("Changes saved.");
    };

    return (
        <form className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            <div>
                <label className="block mb-2 font-semibold text-accent">Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-md bg-secondary-bg border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent text-primary-text outline-none"
                    type="text"
                />
            </div>

            <div>
                <label className="block mb-2 font-semibold text-accent">Change Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-md bg-secondary-bg border border-gray-700 focus:border-accent focus:ring-2 focus:ring-accent text-primary-text outline-none"
                    type="password"
                    placeholder="New password"
                />
            </div>

            <button
                type="button"
                onClick={handleSave}
                className="bg-gradient-to-r from-accent to-accent/65 hover:brightness-110 px-6 py-3 rounded-md text-white font-bold transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-accent"
            >
                Save Changes
            </button>

            {message && (
                <p className="text-status-positive bg-status-positive/10 border border-status-positive/40 rounded-lg px-4 py-2 text-center font-medium shadow">
                    {message}
                </p>
            )}
        </form>
    );
};

// Admin-only sections
const UsersManagement = () => (
    <div className="text-center text-secondary-text">User management section (under development)</div>
);

const ProductsManagement = () => (
    <div className="text-center text-secondary-text">Product management section (under development)</div>
);

const Reports = () => (
    <div className="text-center text-secondary-text">Reports section (under development)</div>
);

// Regular user section
const UserPreferences = () => (
    <div className="text-center text-secondary-text">Personal preferences section (under development)</div>
);

export default SettingPage;
