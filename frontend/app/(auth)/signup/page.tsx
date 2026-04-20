"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase/client';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Signup successful! Check your email for verification if enabled, or sign in.');
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col space-y-3 text-left">
        <h1 className="text-4xl font-bold tracking-tight text-white">Create an account</h1>
        <p className="text-sm text-zinc-400">
          Enter your details below to create your account.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-zinc-300 font-medium" htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  name="first-name"
                  placeholder="John"
                  disabled={isLoading}
                  className="h-11 rounded-lg bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-zinc-300 font-medium" htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  name="last-name"
                  placeholder="Doe"
                  disabled={isLoading}
                  className="h-11 rounded-lg bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-300 font-medium" htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="h-11 rounded-lg bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-300 font-medium" htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                disabled={isLoading}
                className="h-11 rounded-lg bg-zinc-900 border-zinc-800 text-white focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-300"
                required
              />
            </div>
            <Button 
              className="mt-4 h-11 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-base hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.02] transform transition-all shadow-lg shadow-indigo-600/20" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-black px-4 text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading} className="h-11 rounded-lg bg-zinc-900/50 border-zinc-800 text-white hover:bg-zinc-800 hover:text-white transition-all hover:scale-[1.02]">
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
