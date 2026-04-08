import './App.css';
import { useEffect, useState } from 'react';
import Card from "./components/Card/Card";
import Navbar from './components/Navbar/Navbar';
import { getAllPokemon } from "./utils/pokemon.js";

// タイプ名を日本語に変換
const typeMap = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  electric: "でんき",
  grass: "くさ",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー"
};

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData,setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      await loadPokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  // APIで日本語名取得
  const loadPokemon = async (data) => {
    const newPokemonData = await Promise.all(
      data.map(async (pokemon) => {
        const pokemonRecord = await fetch(pokemon.url).then(res => res.json());
        const speciesData = await fetch(pokemonRecord.species.url).then(res => res.json());

        // 日本語名
        const japaneseNameObj = speciesData.names.find(n => n.language.name === "ja");
        const japaneseName = japaneseNameObj ? japaneseNameObj.name : pokemonRecord.name;

        // 画像
        const image =
          pokemonRecord.sprites.front_default ??
          pokemonRecord.sprites.other?.["official-artwork"]?.front_default ??
          "";

        // タイプ名を日本語に変換
        const types = pokemonRecord.types.map(t => ({
          name: typeMap[t.type.name] ?? t.type.name
        }));

        return {
          id: pokemonRecord.id,
          name: japaneseName,
          image,
          types,
          weight: pokemonRecord.weight,
          height: pokemonRecord.height
        };
      })
    );
    setPokemonData(newPokemonData);
  };

  const handleNextPage = async () => {
    if (!nextURL) return;
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const handlePrevPage = async () => {
    if (!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  // 検索で絞り込み（日本語名）
  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.includes(searchQuery)
  );

  return (
    <>
      <Navbar />
      <input
        type="text"
        placeholder="ポケモン名で検索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "8px", margin: "16px", width: "200px" }}
      />

      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {filteredPokemon.map((pokemon, i) => (
                <Card key={i} pokemon={pokemon} />
              ))}
            </div>
            <div className='btn'>
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;