"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../backend/SupabaseClient';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const starsContainer = document.querySelector(".stars");
    if (starsContainer && starsContainer.children.length === 0) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    }
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    setLoading(false);

    setMsg("You have signed up, check your email!");
    
  };

  const handleLogin = async () => {
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    setMsg("You are logged in!");
    router.push("/home");
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white font-sans relative overflow-hidden">
      <div className="stars absolute inset-0 pointer-events-none z-0"></div>

      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl w-96">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              NovaVitals
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isSignUp ? "Sign Up" : "Login"}
            </h2>
          </div>

          {isSignUp && (
            <input
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg mb-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg mb-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg mb-6 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            disabled={loading} // ✅ disable button while loading
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:translate-y-[-2px] transition-all duration-300 disabled:opacity-50"
            onClick={isSignUp ? handleSignup : handleLogin}
          >
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Create account"
              : "Login"}
          </button>

          {msg && <p className="mt-4 text-center text-sm text-cyan-600">{msg}</p>}

          <p className="mt-6 text-center">
            {isSignUp ? (
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Already have an account? Log in
              </button>
            ) : (
              <button
  type="button"
  onClick={() => setIsSignUp(true)}
  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
>
  Don&apos;t have an account? Sign up
</button>

            )}
          </p>
        </div>
      </div>

      <style jsx>{`
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
