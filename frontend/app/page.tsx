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
      setError(err.response?.data?.detail || "Failed to get prediction. Check backend connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("predict-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Red": return "bg-red-600";
      case "Yellow": return "bg-yellow-500";
      default: return "bg-green-600";
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-700">🌊 Flood Alert AI</div>
          <button 
            onClick={scrollToForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Try Prediction
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            AI-Powered Flood Early Warning System
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Predict flood risk 24-48 hours in advance using machine learning. 
            Built for communities in Sri Lanka with real-time alerts and interactive mapping.
          </p>
          <button 
            onClick={scrollToForm}
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg shadow-lg transition"
          >
            Check Your Risk Now →
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📡", title: "Data Input", desc: "Enter location coordinates and recent rainfall/river data" },
              { icon: "🤖", title: "AI Analysis", desc: "XGBoost model evaluates 4+ environmental factors in real-time" },
              { icon: "🚨", title: "Instant Alert", desc: "Receive risk level, probability score, and Telegram notifications" }
            ].map((step, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-slate-50 hover:shadow-md transition">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prediction Form Section */}
      <section id="predict-section" className="py-16 px-4 bg-slate-100">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Check Flood Risk</h2>
            <p className="text-slate-600 mt-2">Enter location and weather data to get an instant AI prediction</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                <input
                  type="number" step="0.0001" value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                <input
                  type="number" step="0.0001" value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">24h Rainfall (mm)</label>
                <input
                  type="number" step="0.1" value={formData.rainfall_24h}
                  onChange={(e) => setFormData({ ...formData, rainfall_24h: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">River Level (m)</label>
                <input
                  type="number" step="0.1" value={formData.river_level}
                  onChange={(e) => setFormData({ ...formData, river_level: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? "🔄 Analyzing..." : "🔍 Get Prediction"}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">{error}</div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className={`${getRiskColor(result.level)} text-white rounded-xl shadow-lg p-6 text-center`}>
                <div className="text-5xl mb-2">{getRiskIcon(result.level)}</div>
                <h3 className="text-3xl font-bold mb-2">{result.level} RISK</h3>
                <p className="text-2xl font-semibold">{(result.probability * 100).toFixed(1)}% Probability</p>
              </div>
              <FloodMap lat={parseFloat(formData.lat)} lng={parseFloat(formData.lng)} risk={result.level} />
              
              <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-semibold mb-3">📋 Recommendations</h4>
                <ul className="space-y-2 text-slate-700">
                  {result.level === "Red" && (<>
                    <li>🚨 Evacuate to higher ground immediately</li>
                    <li>📞 Contact emergency services</li>
                    <li>🎒 Prepare emergency kit</li>
                  </>)}
                  {result.level === "Yellow" && (<>
                    <li>⚠️ Monitor weather updates closely</li>
                    <li>🏠 Secure important documents</li>
                    <li>🚗 Plan evacuation route</li>
                  </>)}
                  {result.level === "Green" && (<>
                    <li>✅ Normal conditions</li>
                    <li>📊 Continue monitoring</li>
                    <li>🌤️ Safe for outdoor activities</li>
                  </>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { num: "94%", label: "Model Accuracy", desc: "Trained on synthetic Sri Lankan flood patterns" },
            { num: "<2s", label: "Prediction Time", desc: "Real-time AI inference via FastAPI" },
            { num: "24/7", label: "Alert Coverage", desc: "Automated Telegram notifications for high risk" }
          ].map((stat, i) => (
            <div key={i} className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.num}</div>
              <div className="font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-slate-600">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-lg font-semibold text-white">Built with ❤️ for flood-prone communities in Sri Lanka</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="https://github.com/yourusername/flood-alert-ai" target="_blank" className="hover:text-white transition">GitHub</a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" className="hover:text-white transition">LinkedIn</a>
            <span>© {new Date().getFullYear()} Flood Alert AI</span>
          </div>
        </div>
      </footer>
    </main>
  );
}