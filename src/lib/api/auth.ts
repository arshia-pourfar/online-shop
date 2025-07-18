// import Cookies from 'js-cookie'; // اگه لازم نداریم فعلاً می‌تونیم حذفش کنیم

const API_BASE = 'http://localhost:5000';

export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export async function loginUser(email: string, password: string) {
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'ورود ناموفق بود');
        }

        return data; // شامل token و user است
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('خطای ناشناخته در ورود');
    }
}
