"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCartShopping,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/authContext';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/lib/context/cartContext';


const Header = () => {
    const pathname = usePathname();
    const { user } = useAuth();
    const { cartItems } = useCart();

    const getPageName = (path: string) => {
        if (path === "/") return "Home";
        const name = path.slice(1).replace(/-/g, " ");
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    const pageName = getPageName(pathname);


    return (
        <header className="h-16 w-full py-8 bg-secondary-bg text-primary-text border-b border-secondary-text flex justify-between items-center shadow-sm md:pl-6 pl-16 md:pr-5 pr-2 md:z-10 z-40 md:static fixed top-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-text">
                <h2 className="flex items-center gap-8">
                    E-commerce
                    <span className="sm:inline-block hidden text-base font-normal text-secondary-text">
                        /{pageName}
                    </span>
                </h2>
            </div>

            <div className="flex items-center justify-between md:gap-3 md:text-2xl text-xl">
                <div className='sm:flex hidden mr-3'>
                    <ThemeToggle />
                </div>
                <a href={user ? '/cart' : '/login'} className="relative dark:hover:bg-primary-bg dark:hover:text-primary-text hover:bg-secondary-text hover:text-secondary-bg transition-all duration-300 flex items-center justify-center size-11 rounded-full">
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span className={`${cartItems.length ? '' : 'hidden'} absolute top-0 right-0.5 bg-accent text-white text-sm font-medium size-5 rounded-full flex items-center justify-center`}>{cartItems.length}</span>
                </a>
                <div className='border-l-2 border-secondary-text h-12'></div>
                <a href={user ? '/setting' : '/login'} className=" dark:hover:bg-primary-bg dark:hover:text-primary-text hover:bg-secondary-text hover:text-secondary-bg transition-all duration-300 flex items-center justify-center size-11 rounded-full">
                    {/* {user ? user.name : ""} */}
                    <FontAwesomeIcon icon={faUser} className='md:text-3xl text-2xl' />
                </a>
            </div>
        </header>
    );
};

export default Header;
