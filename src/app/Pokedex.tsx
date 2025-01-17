"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Import useRouter
import NavBar from "./NavBar"; // Import Navbar component

interface PokemonData {
  abilities: string;
  pokedex_number: number;
  name: string;
  type1: string;
  type2: string;
  height_m: number;
  weight_kg: number;
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

interface PokedexProps {
  pokemonData: PokemonData;
  pokemonList: Array<{
    name: string;
    pokedex_number: number;
  }>;
}

const Pokedex: React.FC<PokedexProps> = ({ pokemonData, pokemonList }) => {
  const router = useRouter(); 
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const maxImages = 6; 

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 500);

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % maxImages);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const abilities = JSON.parse(
    pokemonData.abilities.replace(/'/g, '"')
  ) as string[];

  const getPokemonImagePath = () => {
    return `/data/Pokemon_Image/images/${pokemonData.name}/${currentImageIndex}.jpg`;
  };
  const handleCardClick = () => {
    router.push(`/pokedex/${pokemonData.pokedex_number}`); 
  };

  return (
    <div>
      <NavBar pokemonList={pokemonList} currentPokemon={pokemonData.name} />

      <div className="flex justify-center items-center min-h-screen bg-[#f8f8fb] p-6 mt-16">
        <div
          className="w-full max-w-5xl shadow-2xl rounded-lg overflow-hidden border-4 border-red-500 flex"
          onClick={handleCardClick} // Add the click handler here
        >
          <div className="flex flex-col justify-center items-center bg-red-500 p-4 space-y-4">
            <motion.button
              className="w-8 h-8 bg-blue-500 rounded-full shadow-lg hover:scale-110 transition-transform"
              whileTap={{ scale: 0.9 }}
            />
            <motion.button
              className="w-6 h-6 bg-yellow-500 rounded-full shadow-lg hover:scale-110 transition-transform"
              whileTap={{ scale: 0.9 }}
            />
            <motion.button
              className="w-10 h-10 bg-green-500 rounded-full shadow-lg hover:scale-110 transition-transform"
              whileTap={{ scale: 0.9 }}
            />
            <motion.button
              className="w-8 h-8 bg-white rounded-full shadow-lg border border-gray-300 hover:scale-110 transition-transform"
              whileTap={{ scale: 0.9 }}
            />
          </div>

          <motion.div
            className="flex flex-col md:flex-row bg-white rounded-lg w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-full md:w-1/2 p-6 bg-white flex items-center justify-center relative"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.img
                src={getPokemonImagePath()}
                alt={pokemonData.name}
                className="max-w-full h-auto object-contain bg-transparent"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `/data/Pokemon_Image/images/${pokemonData.name}/0.jpg`;
                }}
                whileHover={{
                  y: -20, 
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="absolute top-2 left-2">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              </div>
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 bg-gray-100 p-8"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {pokemonData.name}
              </h2>
              <p className="text-gray-600 mb-6">
                <span className="font-semibold">Pokedex Number:</span> #
                {pokemonData.pokedex_number}
              </p>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-700">Type</h3>
                <p className="capitalize text-gray-600">
                  {pokemonData.type1} / {pokemonData.type2}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Height</h3>
                  <p className="text-gray-600">{pokemonData.height_m} m</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-700">Weight</h3>
                  <p className="text-gray-600">{pokemonData.weight_kg} kg</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Base Stats
                </h3>
                {(
                  [
                    "hp",
                    "attack",
                    "defense",
                    "sp_attack",
                    "sp_defense",
                    "speed",
                  ] as const
                ).map((stat) => (
                  <div key={stat} className="flex items-center mb-2">
                    <span className="w-24 capitalize text-black">
                      {stat.replace("_", " ")}:
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mx-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(pokemonData[stat] / 255) * 100}%`,
                        }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-gray-600">{pokemonData[stat]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-700">Abilities</h3>
                <ul className="list-disc pl-6">
                  {abilities.map((ability, index) => (
                    <li key={index} className="text-gray-600">
                      {ability}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
