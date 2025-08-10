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
    faHeart,
    faShoppingCart,
    faHeadset,
    faBars,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import { useState, useEffect } from "react";

const adminNavLinks = [
    { href: "/dashboard", icon: faTachometerAlt, text: "Dashboard" },
    { href: "/ordersManagement", icon: faClipboardList, text: "Orders" },
    { href: "/productsManagement", icon: faBox, text: "Products" },
    { href: "/customersManagement", icon: faUsers, text: "Customers" },
    { href: "/reportsManagement", icon: faChartLine, text: "Reports" },
];

const userNavLinks = [
    { href: "/", icon: faHome, text: "Home" },
    { href: "/shop", icon: faStore, text: "Shop" },
    { href: "/wishlist", icon: faHeart, text: "Wishlist" },
    { href: "/cart", icon: faShoppingCart, text: "Cart" },
    { href: "/my-orders", icon: faClipboardList, text: "My Orders" },
    { href: "/contact", icon: faHeadset, text: "Contact Us" },
];

const secondaryLinks = [
    { href: "/analytics", icon: faChartPie, text: "Analytics" },
    { href: "/login", icon: faCircleUser, text: "Login/Logout" },
];

const secondaryLinksAfterLogin = [
    { href: "/analytics", icon: faChartPie, text: "Analytics" },
    { href: "/setting", icon: faGear, text: "Setting" },
];

const Navbar = () => {
    const pathname = usePathname();
    const { user } = useAuth();
    const role = user?.role || null;
    const mainLinks = role === "ADMIN" ? adminNavLinks : userNavLinks;
    const bottomLinks = role ? secondaryLinksAfterLogin : secondaryLinks;

    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Mobile Top Bar */}
            {isMobile && (
                <div className="bg-secondary-bg p-4 flex justify-between items-center h-16 fixed top-0 left-0 z-50">
                    <FontAwesomeIcon
                        icon={faBars}
                        className="text-xl cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    />
                </div>
            )}


            {/* Sidebar */}
            <aside
                className={`${isMobile ? "w-64" : isHovered ? "w-64" : "w-20"} 
                            bg-secondary-bg p-4 shadow-xl flex flex-col min-h-screen border-r border-gray-700/30 
                            transition-all duration-300 ease-in-out absolute z-50 overflow-hidden top-0
                            ${isMobile ? (isOpen ? "left-0" : "-left-64") : "left-0"}`}
                onMouseEnter={() => !isMobile && setIsHovered(true)}
                onMouseLeave={() => !isMobile && setIsHovered(false)}
            >

                {/* Mobile Close Button */}
                {isMobile && (
                    <div className="flex justify-start items-center pb-7 mt-3 mb-10 border-b-2">
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-xl cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <div
                        className={`text-accent ps-3 text-2xl w-10 font-bold flex items-center transition-all duration-300 space-x-2 ${isMobile ? "w-full" : isHovered ? "" : "w-full"
                            }`}
                    >
                        <FontAwesomeIcon
                            icon={faChartPie}
                            className="text-2xl flex items-center justify-center"
                        />
                        <h2
                            className={`text-lg transition-opacity duration-300 ${isMobile ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
                                } whitespace-nowrap`}
                        >
                            Dashboard
                        </h2>
                    </div>
                </div>

                {/* Main navigation */}
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
                                    <span
                                        className={`ml-4 font-medium transition-opacity duration-300 ${isMobile ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
                                            } whitespace-nowrap`}
                                    >
                                        {link.text}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Secondary navigation */}
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
                                <span
                                    className={`ml-4 font-medium transition-opacity duration-300 ${isMobile ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
                                        } whitespace-nowrap`}
                                >
                                    {link.text}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
};

export default Navbar;
