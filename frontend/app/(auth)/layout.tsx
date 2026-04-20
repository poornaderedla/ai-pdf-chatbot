import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-black text-white selection:bg-purple-500/30">
      {/* Left side: branding/gradient */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-950 p-10 lg:flex md:w-5/12 xl:w-1/2 rounded-r-3xl border-r border-white/5 shadow-2xl">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/30 via-purple-900/30 to-black"></div>
        
        {/* Glassmorphic decorative circles */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl mix-blend-screen"></div>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl mix-blend-screen"></div>

        <div className="relative z-10 font-bold text-3xl tracking-tighter flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          LexiFlow AI
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed tracking-tight text-zinc-100">
              "This platform completely transformed how we interact with our extensive PDF documentation. The insights are instant, and the interface is an absolute joy to use."
            </p>
            <footer className="text-sm">
              <div className="font-semibold text-white">Alex Chen</div>
              <div className="text-indigo-300">Head of Research at FutureTech</div>
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex w-full flex-col justify-center px-4 md:px-10 lg:w-1/2 lg:px-20 relative bg-black">
        <Link 
          href="/" 
          className="absolute right-6 top-6 md:right-10 md:top-10 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Back to Home &rarr;
        </Link>
        <div className="mx-auto w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
