"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  time: string;
  league: string;
}

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/api/matches/today/');
        setMatches(response.data);
      } catch (err) {
        console.error("Erreur matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <div className="p-8 text-center text-foreground">Chargement des matchs...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Matchs du jour ⚽</h1>
      
      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
            {/* Équipe Domicile */}
            <div className="flex flex-col items-center w-1/3">
              <img src={match.homeLogo} alt={match.homeTeam} className="w-12 h-12 mb-2 object-contain" />
              <span className="text-sm font-semibold text-center">{match.homeTeam}</span>
            </div>

            {/* Heure / Score */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-neutral-500 mb-1">{match.league}</span>
              <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded text-lg font-bold">
                {match.time}
              </div>
            </div>

            {/* Équipe Extérieur */}
            <div className="flex flex-col items-center w-1/3">
              <img src={match.awayLogo} alt={match.awayTeam} className="w-12 h-12 mb-2 object-contain" />
              <span className="text-sm font-semibold text-center">{match.awayTeam}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}