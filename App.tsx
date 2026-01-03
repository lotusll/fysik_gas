
import React, { useState, useEffect, useCallback } from 'react';
import { Simulation } from './components/Simulation';
import { getTutorExplanation } from './services/geminiService';
import { ExplanationResponse } from './types';
import { Thermometer, Zap, Info, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(20);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExplanation = useCallback(async () => {
    setLoading(true);
    const data = await getTutorExplanation(temperature);
    if (data) setExplanation(data);
    setLoading(false);
  }, [temperature]);

  useEffect(() => {
    // Debounced effect for AI explanation to avoid excessive calls
    const timer = setTimeout(() => {
      fetchExplanation();
    }, 1500);
    return () => clearTimeout(timer);
  }, [fetchExplanation]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-6 px-4 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Termisk Utvidgning
            </h1>
            <p className="text-slate-500 font-medium">Varför expanderar gaser mer?</p>
          </div>
          
          <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temperatur</span>
              <div className="text-3xl font-mono font-bold text-orange-500">{temperature}°C</div>
            </div>
            <div className="w-48">
              <input 
                type="range" 
                min="-50" 
                max="200" 
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                <span>-50°C</span>
                <span>200°C</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl flex flex-col gap-12 pb-24 px-4">
        {/* Main Simulation */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <Simulation temperature={temperature} />
        </section>

        {/* Experiment Box (Balloon Example) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6" />
                <h2 className="text-xl font-bold italic">Tänk på detta...</h2>
              </div>
              <p className="text-blue-50 text-lg leading-relaxed mb-6">
                "Om du blåser upp en ballong med luft och sedan lägger in den i frysen, så kan du se hur mycket gasens volym minskar när den blir kall."
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTemperature(-18)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Thermometer className="w-4 h-4" /> Simulera frys (-18°C)
                </button>
                <button 
                  onClick={() => setTemperature(20)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" /> Rumstemp (20°C)
                </button>
              </div>
            </div>
            {/* Visual Flair */}
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Zap className="w-64 h-64" />
            </div>
          </div>

          {/* AI Tutor Panel */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Labbassistenten förklarar</h2>
              </div>
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>}
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {explanation ? (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Sammanfattning</h4>
                    <p className="text-slate-700 leading-relaxed font-medium">{explanation.summary}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Molekylnivå</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{explanation.molecularDetail}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Jämförelse</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{explanation.comparison}</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                  <p className="text-sm font-medium">Analyserar fysiken vid {temperature}°C...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="w-full bg-slate-900 text-slate-400 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-white font-bold mb-4">Om Gasers Utvidgning</h4>
            <p className="text-sm leading-relaxed">
              Anledningen till att gaser påverkas mest av värme är att deras molekyler rör sig fritt och oberoende av varandra. I fasta ämnen och vätskor håller kemiska krafter ihop molekylerna mer bestämt.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Interaktionsguide</h4>
            <ul className="text-sm space-y-2">
              <li>• Dra i temperaturskjutaren för att se förändringen live.</li>
              <li>• Notera hur molekylernas hastighet ökar med värmen.</li>
              <li>• Jämför den procentuella ökningen i volym-etiketterna.</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-2xl">
            <span className="text-xs font-bold text-slate-500 uppercase mb-2">Nuvarande Energi</span>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
               <div 
                className="h-full bg-orange-500 transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, (temperature + 50) / 2.5))}%` }}
               ></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
