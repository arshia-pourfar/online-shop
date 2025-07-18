"use client";

import React, { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    role: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            setUser(JSON.parse(userJson));
        }
    }, []);

    if (!user) {
        return <div>لطفا وارد شوید.</div>;
    }

    return (
        <div className="p-6">
            <h1>خوش آمدید، {user.name}</h1>

            {user.role === "admin" ? (
                <>
                    <h2>پنل مدیریت</h2>
                    <ul>
                        <li><a href="/admin/users">مدیریت کاربران</a></li>
                        <li><a href="/admin/products">مدیریت محصولات</a></li>
                    </ul>
                </>
            ) : (
                <>
                    <h2>کاربر عادی</h2>
                    <ul>
                        <li><a href="/profile">پروفایل من</a></li>
                        <li><a href="/orders">سفارش‌ها</a></li>
                    </ul>
                </>
            )}
        </div>
    );
}
