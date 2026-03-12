"use client";

import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Record<string, any> | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);
    try {
      const response = await api.post('/api/auth/login/', { email, password });
      const data = response.data;
      if (!response) {
        setError(data);
      } else {
        await fetch('/api/set-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access: data.access, refresh: data.refresh }),
        });
        router.push('/dashboard');
      }
    } catch (err) {
      setError({ detail: "Impossible de joindre le serveur Django." });
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await api.post('/api/auth/social/google/', {
        access_token: tokenResponse.access_token,
      });
      await fetch('/api/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access: res.data.access, refresh: res.data.refresh }),
      });
      router.push('/dashboard');
    },
    onError: () => setError({ detail: "Erreur Google" }),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">

        <div className="flex justify-center mb-8">
          <Image src="/full-logo.png" alt="Logo" width={160} height={48} priority />
        </div>

        <h2 className="text-xl font-semibold mb-6 text-foreground text-center">Se connecter</h2>

        {error && (
          <div className="p-4 mb-6 rounded-md bg-red-100 text-red-800 border border-red-200">
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded-md border border-neutral-300 bg-white text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-md border border-neutral-300 bg-white text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-1 p-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200"
          >
            Se connecter
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-neutral-300" />
            <span className="text-xs text-neutral-500">ou</span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>

          <button
            onClick={() => loginWithGoogle()}
            className="w-full p-3 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-medium transition duration-200 flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Se connecter avec Google
          </button>
        </div>
      </div>
    </div>
  );
}