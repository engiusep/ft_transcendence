"use client";

import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Record<string, any> | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    try {
      console.log(process.env.NEXT_PUBLIC_API_URL)
      const response = await api.post('/api/auth/login/',{email, password});
    
      const data = await response.data;

      if (!response) {
        setError(data);
      } else {
        console.log(data)
        await fetch('/api/set-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            access: data.access,
            refresh: data.refresh 
          }),
        });
        router.push('/dashboard');
      }
    } catch (err) {
      setError({ detail: "Impossible de joindre le serveur Django." });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Se connecter</h2>

      {error && (
        <div className="p-4 mb-6 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 p-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}