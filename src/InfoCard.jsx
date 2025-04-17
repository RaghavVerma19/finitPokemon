import React, { useState, useEffect } from "react";

const PokemonInfoCard = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("pikachu");
  const [searchQuery, setSearchQuery] = useState("pikachu");

  // Function to handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.toLowerCase().trim());
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`);
        if (!response.ok) {
          throw new Error(`Pokemon not found or network error`);
        }
        const data = await response.json();
        setPokemonData(data);
      } catch (e) {
        console.error("Error fetching Pokemon data:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  // Format stat names in a cleaner way
  const formatStatName = (name) => {
    const statMap = {
      "hp": "HP",
      "attack": "Attack",
      "defense": "Defense",
      "special-attack": "Sp. Atk",
      "special-defense": "Sp. Def",
      "speed": "Speed"
    };
    return statMap[name] || name;
  };

  const renderStatBar = (value) => {
    // Dynamic colors based on stat value using HSL
    const hue = Math.min(120, Math.max(0, value / 150 * 120));
    return (
      <div className="h-2 rounded-full bg-gray-700 w-full overflow-hidden">
        <div 
          className={`h-2 rounded-full`}
          style={{ 
            width: `${Math.min(100, (value / 180) * 100)}%`,
            backgroundColor: `hsl(${hue}, 80%, 45%)`
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-4 flex flex-col items-center w-full">
      {/* Search Form - Full width on mobile */}
      <form onSubmit={handleSearch} className="w-full max-w-md mb-6 mt-4 px-2">
        <div className="flex rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Pokémon..."
            className="flex-grow px-4 py-3 text-white focus:outline-none w-full"
          />
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-3 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8 w-full">
          <div className="text-xl text-white animate-pulse">Loading Pokémon data...</div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-900/80 border border-red-700 text-red-100 p-6 rounded-lg shadow-lg w-full mx-2 sm:max-w-md">
          <p className="font-semibold text-lg mb-2">Error:</p>
          <p className="text-red-200">{error}</p>
          <p className="mt-4 text-sm">Try searching for another Pokémon.</p>
        </div>
      )}

      {/* Pokemon Card - Full width on mobile */}
      {pokemonData && !isLoading && !error && (
        <div className="w-full px-0 sm:px-4 sm:max-w-2xl">
          <div className="bg-gray-800/90 backdrop-blur rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Card Header with Background */}
            <div className="relative">
              {/* Background gradient based on pokemon primary type */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90"></div>
              
              {/* Pokemon Image - Maintain aspect ratio with responsive sizing */}
              <div className="relative pt-8 pb-4 flex flex-col items-center">
                <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm mb-3">
                  <div className="w-28 h-28 sm:w-40 sm:h-40 relative">
                    <img
                      src={pokemonData.sprites?.other?.["official-artwork"]?.front_default || pokemonData.sprites?.front_default}
                      alt={pokemonData.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Pokemon Name & Number */}
                <h1 className="text-2xl sm:text-4xl font-bold text-white capitalize mt-2 text-center px-4">
                  {pokemonData.name}
                </h1>
                <p className="text-lg sm:text-xl text-white/80 font-medium">
                  #{pokemonData.id.toString().padStart(3, '0')}
                </p>

                {/* Types - Responsive layout */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 px-4">
                  {pokemonData.types.map((typeData) => (
                    <span
                      key={typeData.slot}
                      className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/30 backdrop-blur-sm text-white"
                    >
                      {typeData.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-6">
              {/* Physical Attributes */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center p-3 sm:p-4 rounded-lg bg-gray-700/50">
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Height</p>
                  <p className="text-white text-lg sm:text-xl font-semibold">{(pokemonData.height / 10).toFixed(1)} m</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-lg bg-gray-700/50">
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Weight</p>
                  <p className="text-white text-lg sm:text-xl font-semibold">{(pokemonData.weight / 10).toFixed(1)} kg</p>
                </div>
              </div>

              {/* Abilities */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2">Abilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {pokemonData.abilities.map((abilityData) => (
                    <div 
                      key={abilityData.slot}
                      className="bg-gray-700/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center justify-between"
                    >
                      <span className="text-white text-sm sm:text-base capitalize">
                        {abilityData.ability.name.replace('-', ' ')}
                      </span>
                      {abilityData.is_hidden && (
                        <span className="bg-purple-600/70 text-white text-xs px-2 py-0.5 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 border-b border-gray-700 pb-2">Base Stats</h2>
                <div className="space-y-3 sm:space-y-4">
                  {pokemonData.stats.map((statData) => (
                    <div key={statData.stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300 text-sm sm:text-base font-medium">
                          {formatStatName(statData.stat.name)}
                        </span>
                        <span className="text-white text-sm sm:text-base font-semibold">
                          {statData.base_stat}
                        </span>
                      </div>
                      {renderStatBar(statData.base_stat)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonInfoCard;