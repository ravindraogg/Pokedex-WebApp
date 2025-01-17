"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";

interface Pokemon {
  name: string;
  pokedex_number: number;
}

interface NavBarProps {
  pokemonList: Pokemon[] | undefined;
  currentPokemon: string;
}

const NavBar: React.FC<NavBarProps> = ({ pokemonList = [], currentPokemon }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>(pokemonList || []);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (pokemonList) {
        const sortedPokemon = pokemonList.sort((a, b) => a.name.localeCompare(b.name));
        const results = sortedPokemon.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPokemon(results);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, pokemonList]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('pokemon-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPokemon = (pokemonName: string, pokedexNumber: number) => {
    router.push(`/pokedex/${pokedexNumber}`);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const getPokemonImagePath = (pokemonName: string) =>
    `/data/Pokemon_Image/images/${pokemonName}/0.jpg`;

  return (
<div className="fixed top-0 left-0 right-0 bg-custom-red shadow-lg z-50">      
    <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl">
            Pokédex
          </Link>
          <div className="relative flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-white/70" />
            </div>
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 max-h-64 overflow-y-auto">
                {filteredPokemon.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    No Pokémon found
                  </div>
                ) : (
                  filteredPokemon.map((pokemon) => (
                    <div
                      key={pokemon.pokedex_number}
                      onClick={() =>
                        handleSelectPokemon(pokemon.name, pokemon.pokedex_number)
                      }
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center"
                    >
                      <img
                        src={getPokemonImagePath(pokemon.name)}
                        alt={pokemon.name}
                        className="h-6 w-6 rounded-full mr-3"
                      />
                      <span className="text-gray-800">
                        #{pokemon.pokedex_number.toString().padStart(3, "0")}{" "}
                        {pokemon.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative" id="pokemon-dropdown">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <span>{currentPokemon ? currentPokemon : "Select Pokémon"}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <div className="max-h-96 overflow-y-auto">
                  {pokemonList && pokemonList.length > 0 ? (
                    pokemonList
                      .sort((a, b) => a.pokedex_number - b.pokedex_number)
                      .map((pokemon) => (
                        <div
                          key={pokemon.pokedex_number}
                          onClick={() => handleSelectPokemon(pokemon.name, pokemon.pokedex_number)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <img
                            src={getPokemonImagePath(pokemon.name)}
                            alt={pokemon.name}
                            className="h-8 w-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {pokemon.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{pokemon.pokedex_number.toString().padStart(3, "0")}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No Pokémon available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;