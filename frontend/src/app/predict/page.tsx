"use client";
import Link from 'next/link';
import { useState } from "react";
import { supabase } from "@backend/SupabaseClient";

type FormFields = {
  [key: string]: string; 
};

const featureOrder = [
  "duration",
  "length",
  "mean",
  "variance",
  "std",
  "kurtosis",
  "skew",
  "n_peaks",
  "smooth10_n_peaks",
  "smooth20_n_peaks",
  "diff_peaks",
  "diff2_peaks",
  "diff_var",
  "diff2_var",
  "gaps_squared",
  "len_weighted",
  "var_div_duration",
  "var_div_len",
  "sma",
  "ema",
  "energy",
  "crest_factor",
  "impulse_factor"
];

const initialFormData: FormFields = Object.fromEntries(
  featureOrder.map((key) => [key, ""])
) as FormFields;

const formatLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export default function Predict() {
  const [formData, setFormData] = useState<FormFields>(initialFormData);
  const [prediction, setPrediction] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputArray = featureOrder.map((key) => formData[key as keyof FormFields]);
    const features = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
    );

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: inputArray }),
    });

    const data = await response.json();
    setPrediction(data.prediction);

    const { error } = await supabase.from("health_readings").insert([{
      ...features,
      prediction: data.prediction,
    }]);

    
  };

  return (
    <main className="min-h-screen bg-[#111827] text-white p-6 md:p-12 w-full">
      <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400">
        Satellite Health Prediction
      </h1>

      <nav className="flex justify-between items-center backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl py-4 px-6 mt-6">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          NovaVitals
        </div>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/predict" className="hover:underline">Predict</Link>
          <Link href="/history" className='hover:underline'>History</Link>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-cyan-400 flex items-center gap-3 pb-4 border-b border-cyan-400/30">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm">📊</div>
            Statistical Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featureOrder.map((key) => (
              <div key={key} className="group">
                <label htmlFor={key} className="block text-sm font-medium mb-2 text-gray-200">
                  {formatLabel(key)}
                </label>
                <input
                  type="number"
                  id={key}
                  name={key}
                  value={formData[key as keyof FormFields] ?? ""}
                  onChange={handleChange}
                  step="any"
                  placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:-translate-y-0.5 group-hover:border-white/30"
                  required
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
          >
            Run Prediction
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold text-green-400">Prediction Result:</h2>
          <p className="mt-2 text-lg">{prediction}</p>
        </div>
      )}
    </main>
  );
}
