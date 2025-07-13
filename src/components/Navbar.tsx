"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faBox,
    faTag,
    faUsers,
    faChartLine,
    faChartPie,
    faDashboard,
    faCircleUser,
} from '@fortawesome/free-solid-svg-icons';

const adminNavLinks = [
    { href: '/', icon: faHome, text: 'Home' },
    { href: '/dashboard', icon: faDashboard, text: 'Dashboard' },
    { href: '/orders', icon: faBox, text: 'Orders' },
    { href: '/products', icon: faTag, text: 'Products' },
    { href: '/customers', icon: faUsers, text: 'Customers' },
    { href: '/reports', icon: faChartLine, text: 'Reports' },
];

const navLinks = [
    { href: '/', icon: faHome, text: 'Home' },
    { href: '/dashboard', icon: faDashboard, text: 'Dashboard' },
    { href: '/orders', icon: faBox, text: 'Orders' },
    { href: '/products', icon: faTag, text: 'Products' },
    { href: '/customers', icon: faUsers, text: 'Customers' },
    { href: '/reports', icon: faChartLine, text: 'Reports' },
];
const secondaryLinks = [
    { href: '/analytics', icon: faChartPie, text: 'Analytics' },
    { href: '/login', icon: faCircleUser, text: 'Login/Logout' },
];

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <aside className="w-64 bg-secondary-bg p-4 shadow-xl flex flex-col min-h-screen border-r border-gray-700/30 absolute z-20">
            <div className="text-center mb-8 text-accent text-2xl font-bold flex items-center justify-center space-x-2">
                <FontAwesomeIcon icon={faChartPie} className="text-3xl" />
                <h2>Dashboard</h2>
            </div>

            {/* Main Navigation Links */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {adminNavLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className={`flex items-center p-3 rounded-xl text-base relative group
                                ${isActive(link.href)
                                    ? 'before:bg-primary-text before:z-20 before:w-[6px] before:h-full before:absolute before:left-0 before:rounded-l-xl ps-4 text-primary-text shadow-sm shadow-black/50'
                                    : 'text-secondary-text hover:bg-primary-bg hover:text-primary-text'
                                }
                                transition-all duration-300 ease-in-out`}>
                                <FontAwesomeIcon icon={link.icon} className={`mr-4 text-lg ${isActive(link.href) ? 'text-primary-text' : 'text-secondary-text group-hover:text-primary-text'}`} />
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
                        <Link href={link.href} className={`flex items-center p-3 rounded-xl text-base relative group
                            ${isActive(link.href)
                                ? 'before:bg-primary-bg before:z-20 before:w-[6px] before:h-full before:absolute before:left-0 before:rounded-l-xl ps-4 bg-accent text-primary-bg shadow-sm shadow-black/50'
                                : 'text-secondary-text hover:bg-primary-bg hover:text-primary-text'
                            }
                            transition-all duration-300 ease-in-out`}>
                            <FontAwesomeIcon icon={link.icon} className={`mr-4 text-lg ${isActive(link.href) ? 'text-primary-bg' : 'text-secondary-text group-hover:text-primary-text'}`} />
                            <span className="font-medium">{link.text}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Navbar;
