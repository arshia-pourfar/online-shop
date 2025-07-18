"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleUser,
} from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <header className="h-16 w-full p-6 bg-secondary-bg flex justify-between items-center" >
            <div className="text-secondary-text text-3xl font-bold">
                <h2>E-commerce <span className='text-2xl inline-block ms-2'>shop</span></h2>
            </div>
            <div>
                <FontAwesomeIcon icon={faCircleUser} className='size-10' />
            </div>
        </header>
    );
};

export default Header;
