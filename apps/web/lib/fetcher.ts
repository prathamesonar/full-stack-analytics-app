import axios from 'axios';

console.log("Fetcher Base URL:", process.env.NEXT_PUBLIC_API_BASE);

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
});

export const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};