"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "./NavBar";
import PokeBallSpinner from "./PokeBallSpinner";

interface PokemonData {
  abilities: string;
  pokedex_number: number;
  name: string;
  type1: string;
  type2?: string;
}

const HomePage: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  const handleCardClick = (pokedex_number: number, name: string) => {
    setCurrentPokemon(name);
    const selectedPokemon = pokemonList.find((pokemon) => pokemon.pokedex_number === pokedex_number);
    if (selectedPokemon) {
      router.push(`/pokedex/${pokedex_number}`);
    }
  };

  const PokemonCard = ({ pokemon }: { pokemon: PokemonData }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const abilities = JSON.parse(pokemon.abilities.replace(/'/g, '"')) as string[];

    return (
      <div
        key={pokemon.pokedex_number}
        className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex flex-col items-center hover:shadow-xl cursor-pointer transform transition-transform duration-200 hover:scale-105"
        onClick={() => handleCardClick(pokemon.pokedex_number, pokemon.name)}
      >
        <div className="relative w-32 h-32 mb-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PokeBallSpinner />
            </div>
          )}
          <img
            src={`/data/Pokemon_Image/images/${pokemon.name}/0.jpg`}
            alt={pokemon.name}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `/data/Pokemon_Image/images/default.jpg`;
              setImageLoading(false);
            }}
          />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">{pokemon.name}</h2>
        <div className="flex gap-2 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
            {pokemon.type1}
          </span>
          {pokemon.type2 && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">
              {pokemon.type2}
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {abilities.map((ability, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
            >
              {ability}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      <NavBar 
        pokemonList={pokemonList.map(pokemon => ({
          name: pokemon.name,
          pokedex_number: pokemon.pokedex_number
        }))} 
        currentPokemon={currentPokemon} 
      />
      
      <main className="min-h-screen bg-[#f8f8fb] p-6 pt-20 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <PokeBallSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.pokedex_number} pokemon={pokemon} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;