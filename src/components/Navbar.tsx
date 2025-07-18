"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faBox,
    faTag,
    faUsers,
    faChartLine,
    faChartPie,
    faDashboard,
    faCircleUser,
    faLock,
} from "@fortawesome/free-solid-svg-icons";

const adminNavLinks = [
    { href: "/dashboard", icon: faDashboard, text: "Dashboard" },
    { href: "/orders", icon: faBox, text: "Orders" },
    { href: "/products", icon: faTag, text: "Products" },
    { href: "/customers", icon: faUsers, text: "Customers" },
    { href: "/reports", icon: faChartLine, text: "Reports" },
];

const userNavLinks = [
    { href: "/", icon: faHome, text: "Home" },
    { href: "/dashboard", icon: faDashboard, text: "Dashboard" },
    { href: "/orders", icon: faBox, text: "Orders" },
    { href: "/products", icon: faTag, text: "Products" },
    { href: "/customers", icon: faUsers, text: "Customers" },
    { href: "/reports", icon: faChartLine, text: "Reports" },
];

const secondaryLinks = [
    { href: "/analytics", icon: faChartPie, text: "Analytics" },
    { href: "/login", icon: faCircleUser, text: "Login/Logout" },
];

const Navbar = () => {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setRole(user.role);
            } catch {
                setRole(null);
            }
        } else {
            setRole(null);
        }
    }, [isClient]);

    useEffect(() => {
        if (!isClient) return;
        if (!role && pathname !== "/login") {
            const dismissed = localStorage.getItem("loginPromptDismissed");
            if (!dismissed) setShowLoginPrompt(true);
            else setShowLoginPrompt(false);
        } else {
            setShowLoginPrompt(false);
        }
    }, [role, pathname, isClient]);

    const handleDismissPrompt = () => {
        setShowLoginPrompt(false);
        if (typeof window !== "undefined") {
            localStorage.setItem("loginPromptDismissed", "true");
        }
    };

    const isActive = (path: string) => pathname === path;
    const mainLinks = role === "ADMIN" ? adminNavLinks : userNavLinks;

    return (
        <>
            {isClient && showLoginPrompt && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 animate-fade-in">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handleDismissPrompt}
                            aria-label="Close prompt"
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-status-neutral text-primary-bg text-4xl font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white/70 hover:bg-status-negative hover:text-white transition-all z-10"
                        >
                            ×
                        </button>
                        <div className="bg-status-neutral text-primary-bg px-12 py-10 rounded-3xl shadow-2xl border-4 border-accent/40 flex items-center gap-8 min-w-[380px] max-w-[95vw] transition-all duration-300">
                            <div className="flex items-center justify-center bg-accent/10 rounded-full w-24 h-24">
                                <FontAwesomeIcon icon={faLock} className="text-accent text-6xl" />
                            </div>
                            <div className="flex flex-col gap-3 items-start">
                                <span className="text-3xl font-extrabold leading-tight tracking-tight">Please log in</span>
                                <span className="text-lg text-secondary-text font-medium">To continue, please sign in to your account.</span>
                                <Link href="/login" className="mt-4 w-fit px-8 py-3 rounded-xl bg-accent text-primary-bg font-bold text-xl shadow-lg hover:bg-accent-alt transition-colors">Log in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <aside className="w-64 bg-secondary-bg p-4 shadow-xl flex flex-col min-h-screen border-r border-gray-700/30 absolute z-20">
                <div className="text-center mb-8 text-accent text-2xl font-bold flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faChartPie} className="text-3xl" />
                    <h2>Dashboard</h2>
                </div>
                {/* Main Navigation Links */}
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {mainLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center p-3 rounded-xl text-base relative group
                  ${isActive(link.href)
                                            ? "before:bg-primary-text before:z-20 before:w-[6px] before:h-full before:absolute before:left-0 before:rounded-l-xl ps-4 text-primary-text shadow-sm shadow-black/50"
                                            : "text-secondary-text hover:bg-primary-bg hover:text-primary-text"
                                        }
                  transition-all duration-300 ease-in-out`}
                                >
                                    <FontAwesomeIcon
                                        icon={link.icon}
                                        className={`mr-4 text-lg ${isActive(link.href)
                                            ? "text-primary-text"
                                            : "text-secondary-text group-hover:text-primary-text"
                                            }`}
                                    />
                                    <span className="font-medium">{link.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Secondary Links at the bottom */}
                <hr className="border-t border-gray-700/50 my-6" />

                <ul className="space-y-2">
                    {secondaryLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`flex items-center p-3 rounded-xl text-base relative group
                ${isActive(link.href)
                                        ? "before:bg-primary-bg before:z-20 before:w-[6px] before:h-full before:absolute before:left-0 before:rounded-l-xl ps-4 bg-accent text-primary-bg shadow-sm shadow-black/50"
                                        : "text-secondary-text hover:bg-primary-bg hover:text-primary-text"
                                    }
                transition-all duration-300 ease-in-out`}
                            >
                                <FontAwesomeIcon
                                    icon={link.icon}
                                    className={`mr-4 text-lg ${isActive(link.href) ? "text-primary-bg" : "text-secondary-text group-hover:text-primary-text"
                                        }`}
                                />
                                <span className="font-medium">{link.text}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
};

export default Navbar;
