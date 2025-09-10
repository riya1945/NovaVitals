'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from "@backend/SupabaseClient";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      } else {
        setUser(data.session.user.user_metadata); 
      }
    };
    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] text-white font-sans relative overflow-hidden">
      <div className="stars absolute inset-0 pointer-events-none z-0"></div>
      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        <nav className="flex justify-between items-center backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl py-4 px-6 mt-6">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            NovaVitals
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/predict" className="hover:underline">Predict</Link>
            <Link href="/history" className='hover:underline'>History</Link> 
          </div>
        </nav>

        {user && (
          <p className="text-white/80 text-xl mt-8">
            Welcome, {user.name || user.email}!
          </p>
        )}

        <section className="text-center py-24">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-cyan-400 to-blue-500 text-transparent bg-clip-text mb-6 animate-fadeInUp">
            Next-Gen Satellite Health Prediction
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8 animate-fadeInUp delay-300">
            Harness the power of AI to predict, monitor, and optimize satellite
            performance with unprecedented accuracy and reliability.
          </p>
          <a
            href="#features"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full font-semibold text-lg shadow-lg hover:translate-y-[-2px] transition-all duration-300"
          >
            Launch Dashboard
          </a>
        </section>

        <section
          id="features"
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 py-16 px-6"
        >
          <h2 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-12">
            Advanced Capabilities
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Real-Time Monitoring',
                icon: '🛰',
                desc: 'Continuous surveillance of satellite health metrics with instant anomaly detection and automated alerting systems.',
              },
              {
                title: 'Predictive Analytics',
                icon: '🔮',
                desc: 'Machine learning algorithms analyze patterns to predict potential failures before they occur, minimizing downtime.',
              },
              {
                title: 'Advanced Dashboard',
                icon: '📊',
                desc: 'Intuitive visualization of satellite health data with customizable alerts and comprehensive reporting tools.',
              },
              {
                title: 'Early Warning System',
                icon: '🚨',
                desc: '48-hour advance notifications for potential issues, enabling proactive maintenance and mission planning.',
              },
              {
                title: 'Maintenance Optimization',
                icon: '🔧',
                desc: 'AI-driven recommendations for maintenance schedules and resource allocation to maximize satellite lifespan.',
              },
              {
                title: 'Global Coverage',
                icon: '🌍',
                desc: 'Support for satellites in all orbital configurations with seamless integration across multiple ground stations.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:shadow-xl hover:border-cyan-400 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto text-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm opacity-80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-white/70 mt-20 py-8 border-t border-white/10">
          © 2025 NovaVitals. Advancing space technology through intelligent
          prediction systems.
        </footer>
      </div>
    </main>
  );
}
