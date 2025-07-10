import axios from 'axios';

export async function getUsers() {
  const res = await axios.get('http://localhost:5000/api/users');
  return res.data;
}

export async function getUser(id: string) {
  const res = await axios.get(`http://localhost:5000/api/users/${id}`);
  return res.data;
}