'use client';
import { supabase } from "@backend/SupabaseClient";
import React, { useState, useEffect } from "react";
import Link from 'next/link';

type Reading = {
  id: string;
  timestamp: string;
  duration: number;
  length: number;
  mean: number;
  variance: number;
  std: number;
  kurtosis: number;
  skew: number;
  n_peaks: number;
  smooth10_n_peaks: number;
  smooth20_n_peaks: number;
  diff_peaks: number;
  diff2_peaks: number;
  diff_var: number;
  diff2_var: number;
  gaps_squared: number;
  len_weighted: number;
  var_div_duration: number;
  var_div_len: number;
  sma: number;
  ema: number;
  energy: number;
  crest_factor: number;
  impulse_factor: number;
  prediction: string;
};

export default function History() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("health_readings")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.log("error showing history", error);
      } else {
        console.log("History displayed successfully!");
        setReadings(data as Reading[]);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#111827] text-white p-6 md:p-12 w-full">
        <nav className="flex justify-between items-center backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl py-4 px-6 mt-6">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            History
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/predict" className="hover:underline">Predict</Link>
            <Link href="/history" className='hover:underline'>History</Link> 
          </div>
        </nav>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1F2937] rounded-xl overflow-hidden text-sm">
          <thead className="bg-cyan-400/20">
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Prediction</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Length</th>
              {showAll && (
                <>
                  <th className="px-4 py-2">Mean</th>
                  <th className="px-4 py-2">Variance</th>
                  <th className="px-4 py-2">Std</th>
                  <th className="px-4 py-2">Kurtosis</th>
                  <th className="px-4 py-2">Skew</th>
                  <th className="px-4 py-2">N Peaks</th>
                  <th className="px-4 py-2">Smooth10 Peaks</th>
                  <th className="px-4 py-2">Smooth20 Peaks</th>
                  <th className="px-4 py-2">Diff Peaks</th>
                  <th className="px-4 py-2">Diff2 Peaks</th>
                  <th className="px-4 py-2">Diff Var</th>
                  <th className="px-4 py-2">Diff2 Var</th>
                  <th className="px-4 py-2">Gaps Squared</th>
                  <th className="px-4 py-2">Len Weighted</th>
                  <th className="px-4 py-2">Var/Duration</th>
                  <th className="px-4 py-2">Var/Len</th>
                  <th className="px-4 py-2">SMA</th>
                  <th className="px-4 py-2">EMA</th>
                  <th className="px-4 py-2">Energy</th>
                  <th className="px-4 py-2">Crest Factor</th>
                  <th className="px-4 py-2">Impulse Factor</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.id} className="border-b border-white/10">
                <td className="px-4 py-2">{new Date(r.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{r.prediction}</td>
                <td className="px-4 py-2">{r.duration}</td>
                <td className="px-4 py-2">{r.length}</td>
                {showAll && (
                  <>
                    <td className="px-4 py-2">{r.mean}</td>
                    <td className="px-4 py-2">{r.variance}</td>
                    <td className="px-4 py-2">{r.std}</td>
                    <td className="px-4 py-2">{r.kurtosis}</td>
                    <td className="px-4 py-2">{r.skew}</td>
                    <td className="px-4 py-2">{r.n_peaks}</td>
                    <td className="px-4 py-2">{r.smooth10_n_peaks}</td>
                    <td className="px-4 py-2">{r.smooth20_n_peaks}</td>
                    <td className="px-4 py-2">{r.diff_peaks}</td>
                    <td className="px-4 py-2">{r.diff2_peaks}</td>
                    <td className="px-4 py-2">{r.diff_var}</td>
                    <td className="px-4 py-2">{r.diff2_var}</td>
                    <td className="px-4 py-2">{r.gaps_squared}</td>
                    <td className="px-4 py-2">{r.len_weighted}</td>
                    <td className="px-4 py-2">{r.var_div_duration}</td>
                    <td className="px-4 py-2">{r.var_div_len}</td>
                    <td className="px-4 py-2">{r.sma}</td>
                    <td className="px-4 py-2">{r.ema}</td>
                    <td className="px-4 py-2">{r.energy}</td>
                    <td className="px-4 py-2">{r.crest_factor}</td>
                    <td className="px-4 py-2">{r.impulse_factor}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition"
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      </div>
    </main>
  );
}
