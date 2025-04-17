import { useState, useEffect } from "react";

export default function EvoCard() {
  const [speciesData, setSpeciesData] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonName, setPokemonName] = useState("pikachu");
  const [searchInput, setSearchInput] = useState("pikachu");


  const handleSearch = (e) => {
    e.preventDefault();
    setPokemonName(searchInput.toLowerCase().trim());
  };

  useEffect(() => {
    const fetchSpeciesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        if (!response.ok) {
          throw new Error(`Pokémon species not found or network error`);
        }
        const data = await response.json();
        setSpeciesData(data);
      } catch (e) {
        console.error("Error fetching Pokémon species data:", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchSpeciesData();
  }, [pokemonName]);


  useEffect(() => {
    if (!speciesData) return;

    const fetchEvolutionChain = async () => {
      try {
        const response = await fetch(speciesData.evolution_chain.url);
        if (!response.ok) {
          throw new Error(`Evolution chain not found or network error`);
        }
        const data = await response.json();
        setEvolutionChain(data);
      } catch (e) {
        console.error("Error fetching evolution chain:", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [speciesData]);


  useEffect(() => {
    if (!evolutionChain) return;

    const processEvolutionChain = async () => {
      try {

        const evoData = [];
        let currentStage = evolutionChain.chain;
        

        while (currentStage) {
          const speciesName = currentStage.species.name;
          

          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
          if (!pokemonResponse.ok) {
            throw new Error(`Pokémon data not found for ${speciesName}`);
          }
          const pokemonData = await pokemonResponse.json();
          

          evoData.push({
            id: pokemonData.id,
            name: speciesName,
            image: pokemonData.sprites?.other?.["official-artwork"]?.front_default || 
                  pokemonData.sprites?.front_default,
            level: currentStage.evolution_details[0]?.min_level || null,
            trigger: currentStage.evolution_details[0]?.trigger?.name || null,
            item: currentStage.evolution_details[0]?.item?.name || null,
            happiness: currentStage.evolution_details[0]?.min_happiness || null,
            time_of_day: currentStage.evolution_details[0]?.time_of_day || null,
            held_item: currentStage.evolution_details[0]?.held_item?.name || null,
            move: currentStage.evolution_details[0]?.known_move?.name || null,
            location: currentStage.evolution_details[0]?.location?.name || null,
          });
          
          
          if (currentStage.evolves_to.length > 0) {
            currentStage = currentStage.evolves_to[0];
          } else {
            currentStage = null;
          }
        }
        
        setEvolutions(evoData);
        setIsLoading(false);
      } catch (e) {
        console.error("Error processing evolution chain:", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    processEvolutionChain();
  }, [evolutionChain]);

  const getEvolutionMethod = (evolution) => {
    if (!evolution) return "";
    
    if (evolution.level) {
      return `Level ${evolution.level}`;
    } else if (evolution.item) {
      return `Use ${evolution.item.replace('-', ' ')}`;
    } else if (evolution.happiness) {
      return `Happiness (${evolution.happiness}+)${evolution.time_of_day ? ` during ${evolution.time_of_day}` : ''}`;
    } else if (evolution.held_item) {
      return `Level up holding ${evolution.held_item.replace('-', ' ')}`;
    } else if (evolution.move) {
      return `Learn ${evolution.move.replace('-', ' ')}`;
    } else if (evolution.location) {
      return `Level up at ${evolution.location.replace('-', ' ')}`;
    } else if (evolution.trigger === "trade") {
      return "Trade";
    } else if (evolution.trigger) {
      return evolution.trigger.replace('-', ' ');
    }
    
    return "Special condition";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 p-4 flex flex-col items-center w-full">
      <form onSubmit={handleSearch} className="w-full max-w-md mb-6 mt-4 px-2">
        <div className="flex rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter Pokémon name..."
            className="flex-grow px-4 py-3 text-white focus:outline-none w-full"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center p-8 w-full">
          <div className="text-xl text-white animate-pulse">Loading evolution data...</div>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-900/80 border border-red-700 text-red-100 p-6 rounded-lg shadow-lg w-full mx-2 sm:max-w-md">
          <p className="font-semibold text-lg mb-2">Error:</p>
          <p className="text-red-200">{error}</p>
          <p className="mt-4 text-sm">Try searching for another Pokémon.</p>
        </div>
      )}

      {evolutions.length > 0 && !isLoading && !error && (
        <div className="w-full px-0 sm:px-4 sm:max-w-2xl">
          <div className="bg-gray-800/90 backdrop-blur rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-700 to-indigo-700">
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                Evolution Chain
              </h2>
              <p className="text-center text-blue-100 mt-1 capitalize">
                {speciesData?.name} family
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center">
                {evolutions.map((evo, index) => (
                  <div key={evo.id} className="flex flex-col sm:flex-row items-center">
                    <div className="bg-gray-700/60 rounded-lg p-4 flex flex-col items-center w-full sm:w-auto">
                      <div className="bg-gray-600/50 rounded-full p-2 w-24 h-24 flex items-center justify-center">
                        {evo.image ? (
                          <img 
                            src={evo.image} 
                            alt={evo.name} 
                            className="w-20 h-20 object-contain"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-500/50 rounded-full flex items-center justify-center">
                            <span className="text-gray-300">?</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-white capitalize font-medium">
                          {evo.name.replace('-', ' ')}
                        </p>
                        <p className="text-gray-300 text-sm">
                          #{evo.id.toString().padStart(3, '0')}
                        </p>
                      </div>
                    </div>
                  
                    {index < evolutions.length - 1 && (
                      <div className="flex flex-col items-center justify-center my-4 sm:my-0 sm:mx-4">
                        <div className="hidden sm:block w-8 h-0.5 bg-blue-400"></div>
                        <div className="block sm:hidden h-8 w-0.5 bg-blue-400"></div>
                        <div className="bg-blue-500/70 rounded-lg px-3 py-1 text-xs text-white text-center mt-2 sm:mt-1 max-w-40">
                          {getEvolutionMethod(evolutions[index + 1])}
                        </div>
                        <div className="hidden sm:block w-8 h-0.5 bg-blue-400"></div>
                        <div className="block sm:hidden h-8 w-0.5 bg-blue-400"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}