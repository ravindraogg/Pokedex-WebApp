"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Search } from 'lucide-react';

interface PokemonData {
  abilities: string;
  pokedex_number: number;
  name: string;
  type1: string;
  type2?: string;
}

const HomePage: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch("/data/pokemon.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPokemonList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPokemonData();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              Pokédex
            </Link>
            <div className="flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="w-full px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Pokémon Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pokemonList.map((pokemon) => (
            <div
              key={pokemon.pokedex_number}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-bold mb-2">{pokemon.name}</h2>
              <p>Type: {pokemon.type1}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;