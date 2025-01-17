"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Pokedex from "../../Pokedex";
import PokeBallSpinner from "../../PokeBallSpinner";

const PokedexPage = () => {
  const params = useParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(`/data/pokemon.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPokemonList(data);
        const pokedexNumber = params.pokedex_number as string;
        if (pokedexNumber) {
          const foundPokemon = data.find(
            (pokemon: any) => pokemon.pokedex_number === parseInt(pokedexNumber)
          );
          setPokemon(foundPokemon);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.pokedex_number) {
      fetchPokemonData();
    }
  }, [params.pokedex_number]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8fb]">
        <PokeBallSpinner />
      </div>
    );
  }

  if (!pokemon || pokemonList.length === 0) {
    return <div className="min-h-screen bg-[#f8f8fb] p-6">No data available.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f8fb] p-6">
      <Pokedex pokemonData={pokemon} pokemonList={pokemonList} />
    </div>
  );
};

export default PokedexPage;
