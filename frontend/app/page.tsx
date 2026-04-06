"use client";

import { useState } from "react";
import axios from "axios";
import FloodMap from "../components/FloodMap";

export default function Home() {
  const [formData, setFormData] = useState({
    lat: "6.9271",
    lng: "79.8612",
    rainfall_24h: "50",
    river_level: "2.0",
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ probability: number; level: string } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/predict`, {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        rainfall_24h: parseFloat(formData.rainfall_24h),
        river_level: parseFloat(formData.river_level),
      });
      
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to get prediction. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Red": return "bg-red-600 hover:bg-red-700";
      case "Yellow": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-green-600 hover:bg-green-700";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "Red": return "🚨";
      case "Yellow": return "⚠️";
      default: return "✅";
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            🌊 Flood Alert AI
          </h1>
          <p className="text-lg text-slate-600">
            AI-Powered Flood Risk Prediction for Sri Lanka
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Enter Location & Weather Data
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6.9271"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="79.8612"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                24h Rainfall (mm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.rainfall_24h}
                onChange={(e) => setFormData({ ...formData, rainfall_24h: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                River Level (m)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.river_level}
                onChange={(e) => setFormData({ ...formData, river_level: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2.0"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? "🔄 Analyzing..." : "🔍 Check Flood Risk"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Risk Level Card */}
            <div className={`${getRiskColor(result.level)} text-white rounded-xl shadow-lg p-6 text-center`}>
              <div className="text-5xl mb-2">{getRiskIcon(result.level)}</div>
              <h3 className="text-3xl font-bold mb-2">{result.level} RISK</h3>
              <p className="text-2xl font-semibold">
                {(result.probability * 100).toFixed(1)}% Probability
              </p>
            </div>

            {/* Map */}
            <FloodMap 
              lat={parseFloat(formData.lat)} 
              lng={parseFloat(formData.lng)} 
              risk={result.level}
            />

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                📋 Recommendations
              </h3>
              <ul className="space-y-2 text-slate-700">
                {result.level === "Red" && (
                  <>
                    <li>🚨 Evacuate to higher ground immediately</li>
                    <li>📞 Contact emergency services</li>
                    <li> Prepare emergency kit</li>
                    <li>🚫 Avoid flood-prone areas</li>
                  </>
                )}
                {result.level === "Yellow" && (
                  <>
                    <li>⚠️ Monitor weather updates closely</li>
                    <li>🏠 Secure important documents</li>
                    <li>📱 Keep phone charged</li>
                    <li>🚗 Plan evacuation route</li>
                  </>
                )}
                {result.level === "Green" && (
                  <>
                    <li>✅ Normal conditions</li>
                    <li>📊 Continue monitoring</li>
                    <li>🌤️ Safe for outdoor activities</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}