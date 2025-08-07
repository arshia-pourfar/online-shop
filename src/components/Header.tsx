"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleUser,
    faShoppingCart,
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
        <header className="h-16 w-full px-6 py-8 bg-secondary-bg flex justify-between items-center shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-primary-text">
                <h2 className="flex items-center gap-8">
                    E-commerce
                    <span className=" text-base font-normal text-secondary-text">
                        /{pageName}
                    </span>
                </h2>
            </div>

            <div className="flex items-center justify-between gap-8">
                <FontAwesomeIcon icon={faShoppingCart} className="text-primary-text text-xl" />
                <a href={user ? './setting' : './login'} className="flex items-center gap-3 line-clamp-1">
                    {user ? user.name : ""}
                    <FontAwesomeIcon icon={faCircleUser} className="size-10" />
                </a>
            </div>
        </header>
    );
};

export default Header;
