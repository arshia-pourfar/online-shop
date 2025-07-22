"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleUser,
} from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();

    // Convert path to page name as desired
    const getPageName = (path: string) => {
        if (path === "/") return "Home";
        const name = path.slice(1).replace(/-/g, " ");
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const pageName = getPageName(pathname);

    return (
        <header className="h-16 w-full p-6 bg-secondary-bg flex justify-between items-center" >
            <div className="text-2xl sm:text-3xl font-bold text-primary-text">
                <h2>E-commerce <span className='ml-2 text-base font-normal text-muted-foreground'>/{pageName}</span></h2>
            </div>
            <div>
                <FontAwesomeIcon icon={faCircleUser} className='size-10' />
            </div>
        </header>
    );
};

export default Header;
