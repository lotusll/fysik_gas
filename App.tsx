
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center font-sans">
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

        {/* Info and AI Tutor Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Experiment Box (Balloon Example) - Made Shorter */}
          <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-blue-200" />
                <h2 className="text-lg font-bold">Experiment-tips</h2>
              </div>
              <p className="text-blue-50 text-base leading-snug mb-4">
                "Om du blåser upp en ballong med luft och lägger den i frysen, kan du se hur mycket gasens volym minskar när den blir kall."
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setTemperature(-18)}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-white/20"
                >
                  <Thermometer className="w-3.5 h-3.5" /> Simulera frys (-18°C)
                </button>
                <button 
                  onClick={() => setTemperature(20)}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 border border-white/20"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> Rumstemp (20°C)
                </button>
              </div>
            </div>
            {/* Visual Flair - Scaled down */}
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Zap className="w-32 h-32" />
            </div>
          </div>

          {/* AI Tutor Panel */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Labbassistenten förklarar</h2>
              </div>
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {explanation ? (
                <>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sammanfattning</h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">{explanation.summary}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Molekylnivå</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{explanation.molecularDetail}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jämförelse</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{explanation.comparison}</p>
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="text-white font-bold mb-4">Om Gasers Utvidgning</h4>
            <p className="leading-relaxed">
              Anledningen till att gaser påverkas mest av värme är att deras molekyler rör sig fritt och oberoende av varandra. I fasta ämnen och vätskor håller kemiska krafter ihop molekylerna mer bestämt.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Interaktionsguide</h4>
            <ul className="space-y-2">
              <li>• Dra i temperaturskjutaren för att se förändringen live.</li>
              <li>• Notera hur molekylernas hastighet ökar med värmen.</li>
              <li>• Jämför den procentuella ökningen i volym-etiketterna.</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Energinivå</span>
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
