"use client";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialIsDark = storedTheme === "dark" || (!storedTheme && prefersDark);

        if (initialIsDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        setIsDark(initialIsDark);
    }, []);

    const toggle = () => {
        const newIsDark = !isDark;
        if (newIsDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
        setIsDark(newIsDark);
    };

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="relative w-16 h-7 cursor-pointer rounded-full text-base border border-border bg-primary-bg transition-all duration-300 ease-in-out flex items-center justify-center px-1 overflow-hidden"
        >
            {/* آیکون خورشید سمت چپ */}
            <FontAwesomeIcon icon={faSun} className="size-1 text-text" />

            {/* آیکون ماه سمت راست */}
            <FontAwesomeIcon icon={faMoon} className="size-1 text-text ml-auto" />

            {/* دایره متحرک */}
            <div
                className={`absolute top-1/2 -translate-y-1/2 bg-accent size-5 text-sm rounded-full flex items-center justify-center shadow-inner z-10 transition-all duration-300 ${isDark ? "left-[calc(100%-1.5rem)]" : "left-1"
                    }`}
            >
                <FontAwesomeIcon icon={isDark ? faMoon : faSun} className="size-4 text-white" />
            </div>
        </button>
    );
}