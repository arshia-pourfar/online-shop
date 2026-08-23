"use client";

import React from 'react';
import Header from '@/components/Header';

const Home = () => {
    return (
        <div className="w-full h-full relative text-white">
            <Header />
            <div className='flex w-full h-full items-center justify-center absolute top-0'>
                <h1 className="text-4xl font-extrabold text-center mb-8 text-accent">This page is optional</h1>
            </div>
        </div>
    );
};

export default Home;
