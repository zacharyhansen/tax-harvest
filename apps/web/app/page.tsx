import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { ArrowRight, BarChart3, Bot, Shield, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { AuthInfoOverlay } from './auth/components/AuthInfoOverlay';

export default function LandingPage() {
  return (
    <MediaProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Side - Hero Content */}
            <div className="relative hidden h-full flex-col p-14 lg:flex">
              <Link href="/en" className="z-30 relative">
                <div className="relative z-20 flex items-center text-lg font-medium text-white hover:text-yellow-300 transition-colors">
                  <Bot className="mr-2 h-6 w-6" />
                  TaxHarvest.AI
                </div>
              </Link>
              <div className="absolute inset-0 m-8 rounded-3xl bg-[url('/images/coverImage.jpg')] bg-cover bg-center bg-no-repeat shadow-2xl">
                <AuthInfoOverlay />
              </div>
            </div>

            {/* Right Side - Sign Up */}
            <div className="flex flex-col justify-center px-8 py-12 lg:p-16">
              <div className="mx-auto w-full max-w-md space-y-8">
                {/* Mobile Logo */}
                <div className="flex justify-center lg:hidden">
                  <Link href="/en">
                    <div className="flex items-center text-2xl font-bold text-slate-900 dark:text-white">
                      <Bot className="mr-2 h-8 w-8 text-yellow-500" />
                      TaxHarvest.AI
                    </div>
                  </Link>
                </div>

                {/* Hero Text */}
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-5xl">
                    Smart Tax
                    <span className="text-yellow-500"> Optimization</span>
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    AI-powered tax loss harvesting that maximizes your after-tax returns
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium">Optimize tax efficiency automatically</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">Wash sale protection built-in</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                      <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">Real-time portfolio analysis</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <Link
                    href="/auth/signup"
                    className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-yellow-600 hover:to-orange-600"
                  >
                    <span>Start Optimizing Today</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/auth/signin"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 px-8 py-4 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="text-center space-y-2 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Zap className="h-4 w-4" />
                    <span>Trusted by 10,000+ investors</span>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    SEC-compliant • Bank-level security • Free to start
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MediaProvider>
  );
}
