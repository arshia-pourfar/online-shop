"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCartShopping,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/authContext';

const Header = () => {
    const pathname = usePathname();
    const { user } = useAuth();

    const getPageName = (path: string) => {
        if (path === "/") return "Home";
        const name = path.slice(1).replace(/-/g, " ");
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const pageName = getPageName(pathname);

    return (
        <header className="h-16 w-full py-8 bg-secondary-bg text-primary-text flex justify-between items-center shadow-sm md:px-6 ps-16 md:z-10 z-40 md:static fixed top-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-text">
                <h2 className="flex items-center gap-8">
                    E-commerce
                    <span className="sm:inline-block hidden text-base font-normal text-secondary-text">
                        /{pageName}
                    </span>
                </h2>
            </div>

            <div className="flex items-center justify-between gap-4 text-2xl">
                <a href="./shop" className="hover:bg-primary-bg transition-all duration-500 flex items-center justify-center size-12 rounded-full">
                    <FontAwesomeIcon icon={faCartShopping} />
                </a>
                <a href={user ? './setting' : './login'} className="hover:bg-primary-bg transition-all duration-500 flex items-center justify-center size-12 rounded-full">
                    {/* {user ? user.name : ""} */}
                    <FontAwesomeIcon icon={faUser} className='text-3xl' />
                </a>
            </div>
        </header>
    );
};

export default Header;
