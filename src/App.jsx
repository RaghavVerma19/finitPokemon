import React, { useState } from "react";
import InfoCard from "./InfoCard.jsx";
import EvoCard from "./EvoCard.jsx";

function App() {
  const [activeView, setActiveView] = useState("info");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-gray-900/80 backdrop-blur shadow-lg">
        <div className="w-screen px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
            Pokédex App
          </h1>
        </div>
      </header>

      <div className="w-full px-4 pt-6">
        <div className="bg-gray-800/70 rounded-lg p-2 flex shadow-lg mb-6">
          <button
            onClick={() => setActiveView("info")}
            className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all ${
              activeView === "info"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            Pokémon Info
          </button>
          <button
            onClick={() => setActiveView("evolution")}
            className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all ${
              activeView === "evolution"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            Evolution Chain
          </button>
        </div>
      </div>
      <div className="w-full px-4 pb-12">
        
        <div className="w-full relative min-h-screen md:min-h-0 md:h-96 lg:h-128">
      
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeView === "info" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            
            <div className="w-full h-full overflow-y-auto">
              <InfoCard />
            </div>
          </div>
          
          <div className={`absolute inset-0 transition-opacity duration-300 ${activeView === "evolution" ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div className="w-full h-full overflow-y-auto">
              <EvoCard />
            </div>
          </div>
        </div>
      </div>

  
      <footer className="bg-gray-900/80 backdrop-blur py-4 mt-6">
        <div className="w-full text-center text-gray-400 text-sm">
          <p>Powered by PokéAPI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;