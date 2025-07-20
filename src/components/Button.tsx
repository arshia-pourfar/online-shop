// فایل: src/components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
    <button
        {...props}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
        {children}
    </button>
);
