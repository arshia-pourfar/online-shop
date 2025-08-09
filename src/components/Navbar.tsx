"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faBox,
    faUsers,
    faChartLine,
    faChartPie,
    faCircleUser,
    faGear,
    faTachometerAlt,
    faClipboardList,
    faStore,
    faThLarge,
    faHeart,
    faShoppingCart,
    // faUser,
    faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import { useState } from "react";

// Navigation bar component for the dashboard and user pages
// Handles role-based navigation and hover/collapse behavior
const adminNavLinks = [
    // Navigation links for admin users
    { href: "/dashboard", icon: faTachometerAlt, text: "Dashboard" },
    { href: "/ordersManagement", icon: faClipboardList, text: "Orders" },
    { href: "/productsManagement", icon: faBox, text: "Products" },
    { href: "/customersManagement", icon: faUsers, text: "Customers" },
    { href: "/reportsManagement", icon: faChartLine, text: "Reports" },
];

// Navigation links for regular users
const userNavLinks = [
    { href: "/", icon: faHome, text: "Home" },
    { href: "/shop", icon: faStore, text: "Shop" },
    { href: "/categories", icon: faThLarge, text: "Categories" },
    { href: "/wishlist", icon: faHeart, text: "Wishlist" },
    { href: "/cart", icon: faShoppingCart, text: "Cart" },
    { href: "/my-orders", icon: faClipboardList, text: "My Orders" },
    // { href: "/profile", icon: faUser, text: "My Account" },
    { href: "/contact", icon: faHeadset, text: "Contact Us" },
];

// Links shown to all users (e.g., analytics, login/logout)
const secondaryLinks = [
    { href: "/analytics", icon: faChartPie, text: "Analytics" },
    { href: "/login", icon: faCircleUser, text: "Login/Logout" },
];

// Links shown only after login (e.g., analytics, settings)
const secondaryLinksAfterLogin = [
    { href: "/analytics", icon: faChartPie, text: "Analytics" },
    { href: "/setting", icon: faGear, text: "Setting" },
];

const Navbar = () => {
    // Get current path and user role
    const pathname = usePathname();
    const { user } = useAuth();
    const role = user?.role || null;
    // Determine which links to show based on user role
    const mainLinks = role === "ADMIN" ? adminNavLinks : userNavLinks;
    const bottomLinks = role ? secondaryLinksAfterLogin : secondaryLinks;

    // Handle sidebar hover state for expanding/collapsing
    const [isHovered, setIsHovered] = useState(false);

    // Helper to check if a link is active
    const isActive = (path: string) => pathname === path;

    return (
        // Sidebar layout and navigation rendering
        <aside
            className={`${isHovered ? "w-64" : "w-20"
                } bg-secondary-bg p-4 shadow-xl flex flex-col min-h-screen border-r border-gray-700/30 transition-all duration-300 ease-in-out absolute z-20 overflow-hidden`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header section with logo and title */}
            <div className="flex items-center justify-between mb-8">
                <div
                    className={`text-accent ps-3 text-2xl w-10 font-bold flex items-center transition-all duration-300 space-x-2 ${isHovered ? "" : "w-full"
                        }`}
                >
                    <FontAwesomeIcon icon={faChartPie} className="text-2xl flex items-center justify-center" />
                    {/* Always render text, control visibility with opacity */}
                    <h2
                        className={`text-lg transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                            } whitespace-nowrap`}
                    >
                        Dashboard
                    </h2>
                </div>
            </div>

            {/* Main navigation links */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {mainLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`group flex items-center p-3 rounded-xl text-base relative transition-all duration-300 ease-in-out ${isActive(link.href)
                                    ? "bg-primary-bg text-primary-text"
                                    : "text-secondary-text hover:bg-primary-bg hover:text-primary-text"
                                    }`}
                            >
                                <FontAwesomeIcon
                                    icon={link.icon}
                                    className="text-lg flex items-center justify-center min-w-6"
                                />
                                {/* Always render text, control visibility with opacity */}
                                <span
                                    className={`ml-4 font-medium transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                                        } whitespace-nowrap`}
                                >
                                    {link.text}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Secondary navigation links (bottom) */}
            <hr className="border-t border-gray-700/50 my-6" />
            <ul className="space-y-2">
                {bottomLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`group flex items-center p-3 rounded-xl text-base relative transition-all duration-300 ease-in-out ${isActive(link.href)
                                ? "bg-accent text-primary-bg"
                                : "text-secondary-text hover:bg-primary-bg hover:text-primary-text"
                                }`}
                        >
                            <FontAwesomeIcon
                                icon={link.icon}
                                className="text-lg flex items-center justify-center min-w-6"
                            />
                            {/* Always render text, control visibility with opacity */}
                            <span
                                className={`ml-4 font-medium transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                                    } whitespace-nowrap`}
                            >
                                {link.text}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Navbar;
