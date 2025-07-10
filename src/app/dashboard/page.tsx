'use client';

// import { useEffect, useState } from 'react';
// import { getUsers } from '@/lib/api/users';

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// };

export default function UsersPage() {
  // const [users, setUsers] = useState<User[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
    // getUsers().then(setUsers).catch(console.error);
    // setLoading(false)
  // }, []);

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="">

      {/* <ul className="space-y-2">
         {users.map((user) => (
          <li key={user.id} className="p-4 bg-gray-100 rounded-md shadow">
            <strong>{user.name}</strong> - {user.email} - <em>{user.role}</em>
          </li>
        ))} 
      </ul> */}
    </div>
  );
}
