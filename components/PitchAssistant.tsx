
import React, { useState } from 'react';
import { analyzePitch } from '../services/geminiService';
import { AIPitchResponse } from '../types';

const PitchAssistant: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [pitchText, setPitchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIPitchResponse | null>(null);

  const handleAnalyze = async () => {
    if (!productName || !pitchText) return;
    setLoading(true);
    try {
      const response = await analyzePitch(pitchText, productName);
      setResult(response);
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the AI evaluation. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 neon-glow">AI Pitch Assistant</h2>
          <p className="text-gray-400 text-lg">Hone your pitch before the big day. Let our AI give you a critique.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border-cyan-500/20 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2 uppercase tracking-wider">Product Name</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. EcoSphere Smart Bin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2 uppercase tracking-wider">Your Pitch (2-3 sentences)</label>
              <textarea 
                rows={4}
                value={pitchText}
                onChange={(e) => setPitchText(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                placeholder="Describe your innovation and why it matters..."
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={loading || !productName || !pitchText}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ANALYZING PITCH...</span>
                </>
              ) : (
                <span>GET AI FEEDBACK</span>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="text-xs text-gray-400 mb-1 uppercase">AI Score</div>
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-500 flex items-center justify-center text-3xl font-bold text-cyan-400">
                    {result.score}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Evaluation</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">{result.feedback}</p>
                  <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-2">Suggestions</h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                        <span className="text-cyan-500 mt-1">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchAssistant;
