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
    faUser,
    faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import { useState } from "react";

const adminNavLinks = [
    { href: "/dashboard", icon: faTachometerAlt, text: "Dashboard" },
    { href: "/orders", icon: faClipboardList, text: "Orders" },
    { href: "/products", icon: faBox, text: "Products" },
    { href: "/customers", icon: faUsers, text: "Customers" },
    { href: "/reports", icon: faChartLine, text: "Reports" },
];

const userNavLinks = [
    { href: "/", icon: faHome, text: "Home" },
    { href: "/shop", icon: faStore, text: "Shop" },
    { href: "/categories", icon: faThLarge, text: "Categories" },
    { href: "/wishlist", icon: faHeart, text: "Wishlist" },
    { href: "/cart", icon: faShoppingCart, text: "Cart" },
    { href: "/my-orders", icon: faClipboardList, text: "My Orders" },
    { href: "/profile", icon: faUser, text: "My Account" },
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

    const isActive = (path: string) => pathname === path;

    return (
        <aside
            className={`${isHovered ? "w-64" : "w-20"
                } bg-secondary-bg p-4 shadow-xl flex flex-col min-h-screen border-r border-gray-700/30 transition-all duration-300 ease-in-out absolute z-20 overflow-hidden`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div
                    className={`text-accent ps-3 text-2xl font-bold flex items-center transition-all duration-300 space-x-2 ${isHovered ? "" : "w-full"
                        }`}
                >
                    <FontAwesomeIcon icon={faChartPie} className="text-2xl" />
                    {/* Always render text, control visibility with opacity */}
                    <h2
                        className={`text-lg transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                            } whitespace-nowrap`}
                    >
                        Dashboard
                    </h2>
                </div>
            </div>

            {/* Main Links */}
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

            {/* Secondary Links */}
            <hr className="border-t border-gray-700/50 my-6" />
            <ul className="space-y-2">
                {bottomLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`group flex items-center p-3 ps-3.5 rounded-xl text-base relative transition-all duration-300 ease-in-out ${isActive(link.href)
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

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faHome,
//     faBox,
//     faUsers,
//     faChartLine,
//     faChartPie,
//     faCircleUser,
//     faGear,
//     faBars,
//     faTachometerAlt,
//     faClipboardList,
//     faStore,
//     faThLarge,
//     faHeart,
//     faShoppingCart,
//     faUser,
//     faHeadset,
// } from "@fortawesome/free-solid-svg-icons";
// import { useAuth } from "@/lib/context/authContext";
// import { useState } from "react";

// const adminNavLinks = [
//     { href: "/dashboard", icon: faTachometerAlt, text: "Dashboard" },
//     { href: "/orders", icon: faClipboardList, text: "Orders" },
//     { href: "/products", icon: faBox, text: "Products" },
//     { href: "/customers", icon: faUsers, text: "Customers" },
//     { href: "/reports", icon: faChartLine, text: "Reports" },
// ];

// const userNavLinks = [
//     { href: "/", icon: faHome, text: "Home" },
//     { href: "/shop", icon: faStore, text: "Shop" },
//     { href: "/categories", icon: faThLarge, text: "Categories" },
//     { href: "/wishlist", icon: faHeart, text: "Wishlist" },
//     { href: "/cart", icon: faShoppingCart, text: "Cart" },
//     { href: "/my-orders", icon: faClipboardList, text: "My Orders" },
//     { href: "/profile", icon: faUser, text: "My Account" },
//     { href: "/contact", icon: faHeadset, text: "Contact Us" },
// ];

// // const adminNavLinks = [
// //     { href: "/dashboard", icon: faDashboard, text: "Dashboard" },
// //     { href: "/orders", icon: faBox, text: "Orders" },
// //     { href: "/products", icon: faTag, text: "Products" },
// //     { href: "/customers", icon: faUsers, text: "Customers" },
// //     { href: "/reports", icon: faChartLine, text: "Reports" },
// // ];

// // const userNavLinks = [
// //     { href: "/", icon: faHome, text: "Home" },
// //     { href: "/dashboard", icon: faDashboard, text: "Dashboard" },
// //     { href: "/orders", icon: faBox, text: "Orders" },
// //     { href: "/products", icon: faTag, text: "Products" },
// //     { href: "/customers", icon: faUsers, text: "Customers" },
// //     { href: "/reports", icon: faChartLine, text: "Reports" },
// // ];

// const secondaryLinks = [
//     { href: "/analytics", icon: faChartPie, text: "Analytics" },
//     { href: "/login", icon: faCircleUser, text: "Login/Logout" },
// ];

// const secondaryLinksAfterLogin = [
//     { href: "/analytics", icon: faChartPie, text: "Analytics" },
//     { href: "/setting", icon: faGear, text: "Setting" },
// ];

// const Navbar = () => {
//     const pathname = usePathname();
//     const { user } = useAuth();
//     const role = user?.role || null;
//     const mainLinks = role === "ADMIN" ? adminNavLinks : userNavLinks;
//     const bottomLinks = role ? secondaryLinksAfterLogin : secondaryLinks;

//     const [isCollapsed, setIsCollapsed] = useState(false);

//     const isActive = (path: string) => pathname === path;

//     return (
//         <aside
//             className={`${isCollapsed ? "w-20" : "w-64"
//                 } bg-secondary-bg p-4 shadow-xl flex flex-col min-h-screen border-r border-gray-700/30 transition-all duration-300 ease-in-out absolute z-20`}
//         >
//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">
//                 <div
//                     className={`text-accent text-2xl font-bold flex items-center transition-all duration-300 ${isCollapsed ? "justify-center w-full" : "space-x-2"
//                         }`}
//                 >
//                     <FontAwesomeIcon icon={faChartPie} className="text-2xl" />
//                     {!isCollapsed && <h2 className="text-lg">Dashboard</h2>}
//                 </div>
//                 <button
//                     onClick={() => setIsCollapsed(!isCollapsed)}
//                     className="text-secondary-text hover:text-primary-text"
//                 >
//                     <FontAwesomeIcon icon={faBars} />
//                 </button>
//             </div>

//             {/* Main Links */}
//             <nav className="flex-grow">
//                 <ul className="space-y-2">
//                     {mainLinks.map((link) => (
//                         <li key={link.href}>
//                             <Link
//                                 href={link.href}
//                                 className={`group flex items-center p-3 rounded-xl text-base relative transition-all duration-300 ease-in-out ${isActive(link.href)
//                                     ? "bg-primary-bg text-primary-text"
//                                     : "text-secondary-text hover:bg-primary-bg hover:text-primary-text"
//                                     }`}
//                             >
//                                 <FontAwesomeIcon
//                                     icon={link.icon}
//                                     className="text-lg min-w-[20px]"
//                                 />
//                                 {!isCollapsed && (
//                                     <span className="ml-4 font-medium">{link.text}</span>
//                                 )}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </nav>

//             {/* Secondary Links */}
//             <hr className="border-t border-gray-700/50 my-6" />
//             <ul className="space-y-2">
//                 {bottomLinks.map((link) => (
//                     <li key={link.href}>
//                         <Link
//                             href={link.href}
//                             className={`group flex items-center p-3 rounded-xl text-base relative transition-all duration-300 ease-in-out ${isActive(link.href)
//                                 ? "bg-accent text-primary-bg"
//                                 : "text-secondary-text hover:bg-primary-bg hover:text-primary-text"
//                                 }`}
//                         >
//                             <FontAwesomeIcon
//                                 icon={link.icon}
//                                 className="text-lg min-w-[20px]"
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-4 font-medium">{link.text}</span>
//                             )}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
//         </aside>
//     );
// };

// export default Navbar;
