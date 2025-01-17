import { GetStaticPaths, GetStaticProps } from "next";

interface Pokemon {
  name: string;
  abilities: string[];
  type1: string;
  type2?: string;
  height_m: number;
  weight_kg: number;
  attack: number;
  defense: number;
  hp: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/data/pokemon.json`);
  const data: Pokemon[] = await res.json();
  const paths = data.map((pokemon) => ({
    params: { name: pokemon.name.toLowerCase() }, // Match the route parameter
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name } = params!;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/data/pokemon.json`);
  const data: Pokemon[] = await res.json();
  const pokemon = data.find((p) => p.name.toLowerCase() === name);

  if (!pokemon) {
    return { notFound: true };
  }

  return { props: { pokemon } };
};

const PokemonDetails = ({ pokemon }: { pokemon: Pokemon }) => {
  if (!pokemon) return <div>Pokemon not found!</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 capitalize">{pokemon.name}</h1>
      <div className="text-center">
        {/* <p>Classification: {pokemon.classfication}</p> */}
        <p>Type: {pokemon.type1} {pokemon.type2 && `/${pokemon.type2}`}</p>
        <p>Abilities: {pokemon.abilities.join(", ")}</p>
        <p>Height: {pokemon.height_m} m</p>
        <p>Weight: {pokemon.weight_kg} kg</p>
        <p>Base Stats:</p>
        <ul>
          <li>HP: {pokemon.hp}</li>
          <li>Attack: {pokemon.attack}</li>
          <li>Defense: {pokemon.defense}</li>
          <li>Speed: {pokemon.speed}</li>
          <li>Special Attack: {pokemon.sp_attack}</li>
          <li>Special Defense: {pokemon.sp_defense}</li>
        </ul>
      </div>
    </div>
  );
};

export default PokemonDetails;
