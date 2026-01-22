/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import Link from "next/link";
import { Sparkles, Clapperboard, Zap, ArrowRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center">
        {/* Animated Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-4 h-4 fill-current" /> Powered by Veo 3.1 & Kie.ai
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            CINEMATIC <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              IMAGINATION.
            </span>
          </h1>

          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed opacity-0 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards delay-500">
            Transform scripts into high-fidelity 4K sequences or replicate existing scenes with neural precision. The ultimate studio for AI video creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-in fade-in slide-in-from-bottom-16 duration-1000 fill-mode-forwards delay-700 pt-4">
            <Link href="/studio">
              <Button className="h-16 px-10 bg-white text-black hover:bg-gray-200 rounded-[2rem] font-black text-lg transition-transform hover:scale-105 active:scale-95 group">
                Enter Studio <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/lab">
              <Button variant="outline" className="h-16 px-10 border-gray-800 bg-transparent hover:bg-gray-900 rounded-[2rem] font-bold text-lg text-white">
                Open AI Lab
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 w-full opacity-0 animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-forwards delay-1000">
          <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] backdrop-blur-xl group hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Clapperboard className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-black mb-3 italic">Director Agent</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Replicate complex motion and transform aesthetics while preserving spatial consistency.</p>
          </div>

          <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] backdrop-blur-xl group hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-black mb-3 italic">Cinematic 4K</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Render stunning high-resolution output with professional-grade aspect ratios (16:9, 9:16).</p>
          </div>

          <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black mb-3 italic">Neural Synth</h3>
            <p className="text-gray-500 leading-relaxed font-medium">Next-gen lightning-fast rendering models for rapid prototyping and storyboard iterations.</p>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-gray-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">VEO STUDIO • 2025 • THE FUTURE OF VIDEO</p>
        </div>
      </footer>
    </main>
  );
}
