"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@backend/SupabaseClient";

type FormFields = Record<string, string>;
type PredictionResponse = {
  prediction: "Healthy" | "Critical";
  probability_critical: number;
  confidence: number;
  threshold_used: number;

  explanation: [string, number][];
  plot?: string; // SHAP waterfall image
};

export default function Predict() {
  const [featureOrder, setFeatureOrder] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormFields>({});
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // Fetch feature order from backend
  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/feature-order`
      );

      const data: { feature_order: string[] } = await res.json();

      setFeatureOrder(data.feature_order);

      const initialData: FormFields = {};
      data.feature_order.forEach((key) => {
        initialData[key] = "";
      });

      setFormData(initialData);
    };

    fetchFeatures();
  }, []);

  const formatLabel = (key: string) => {
  return featureLabels[key] || key;
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  

  try {
 
    const numericFeatures = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
    );

    const featureToColumnMap: Record<string, string> = {
      len: "length",
      var: "variance",
      duration: "duration",
      mean: "mean",
      std: "std",
      kurtosis: "kurtosis",
      skew: "skew",
      n_peaks: "n_peaks",
      smooth10_n_peaks: "smooth10_n_peaks",
      smooth20_n_peaks: "smooth20_n_peaks",
      diff_peaks: "diff_peaks",
      diff2_peaks: "diff2_peaks",
      diff_var: "diff_var",
      diff2_var: "diff2_var",
      gaps_squared: "gaps_squared",
      len_weighted: "len_weighted",
      var_div_duration: "var_div_duration",
      var_div_len: "var_div_len",
    };

    const supabaseData = Object.fromEntries(
      Object.entries(numericFeatures).map(([mlKey, value]) => [
        featureToColumnMap[mlKey] ?? mlKey,
        value,
      ])
    );

    // =========================
    // 3️⃣ Call ML API
    // =========================
    const inputArray: number[] = featureOrder.map(
      (key) => parseFloat(formData[key] ?? "0")
    );

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: inputArray }),
    });

    const data: PredictionResponse = await response.json();
    setResult(data);

    // =========================
    // 4️⃣ Normalize prediction to match Supabase CHECK constraint
    // =========================
    const normalizePrediction = (pred: string) => {
  switch (pred.toLowerCase().trim()) {
    case "healthy": return "Normal";
    case "moderate": return "Warning";
    case "critical": return "Critical";
    default: return "Normal";
  }
};

    const finalPrediction = normalizePrediction(data.prediction);


    const { error } = await supabase.from("health_readings").insert([
      {
        ...supabaseData,
        prediction: finalPrediction,
        confidence: data.confidence,
        // probability_critical is omitted since your table doesn't have it
      },
    ]);

    if (error) console.error("❌ Supabase insert failed:", error.message);
  } catch (err) {
    console.error("❌ Prediction failed:", err);
  }
};

const featureLabels: Record<string, string> = {
  duration: "Signal Duration",
  len: "Signal Length",
  length: "Signal Length",

  mean: "Average Signal Value",
  variance: "Signal Variability",
  var: "Signal Variability",

  std: "Signal Standard Deviation",
  kurtosis: "Signal Tail Distribution",
  skew: "Signal Asymmetry",

  n_peaks: "Peak Count",
  smooth10_n_peaks: "Short Window Peak Activity",
  smooth20_n_peaks: "Long Window Peak Activity",

  diff_peaks: "Signal Change Peaks",
  diff2_peaks: "Acceleration Peaks",

  diff_var: "Signal Change Variability",
  diff2_var: "Signal Acceleration Variability",

  gaps_squared: "Peak Gap Energy",
  len_weighted: "Length Weighted Variance",

  var_div_duration: "Variance per Duration",
  var_div_len: "Variance per Length",
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
          <Link href="/">Home</Link>
          <Link href="/predict">Predict</Link>
          <Link href="/history">History</Link>
        </div>
      </nav>

      {featureOrder.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-12 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featureOrder.map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2">
                  {formatLabel(key)}
                </label>
                <input
                  type="number"
                  name={key}
                  value={formData[key] ?? ""}
                  onChange={handleChange}
                  step="any"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
                />
                
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
            >
              Run Prediction
            </button>
          </div>
        </form>
      )}
      {result && (
  <>
    <div className="mt-12 text-center">
      <h2 className="text-xl font-bold text-green-400">
        Prediction Result
      </h2>

      <p className="mt-4 text-2xl font-bold">
        {result.prediction}
      </p>

      <p className="mt-2">
        Probability (Critical):{" "}
        {(result.probability_critical * 100).toFixed(2)}%
      </p>

      <p className="text-gray-400 mt-1">
        Confidence: {(result.confidence * 100).toFixed(2)}%
      </p>
    </div>

    {Array.isArray(result.explanation) && (
  <div className="mt-6 text-left max-w-md mx-auto">
    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
      Key Factors Influencing Prediction
    </h3>

    {result.explanation.map(([feature, value], i) => (
      <p key={i} className="text-gray-300">
        {formatLabel(feature)} : {value.toFixed(3)}
      </p>
    ))}
  </div>
)}

    {result.plot && (
      <div className="mt-10 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          SHAP Model Explanation
        </h3>

       <img src={`data:image/png;base64,${result.plot}`} 
          alt="SHAP Waterfall Plot"
          className="rounded-lg shadow-xl border border-white/10"
        />
      </div>
    )}
  </>
)}
    </main>
  );
}