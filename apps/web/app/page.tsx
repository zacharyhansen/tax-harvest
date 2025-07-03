import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { ArrowRight, BarChart3, Shield, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { AuthInfoOverlay } from './auth/components/AuthInfoOverlay';

export default function LandingPage() {
  return (
    <MediaProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Header */}
          <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  TaxHarvest.AI
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-6">
                <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                  About
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </nav>
            </div>
          </header>

          {/* Hero Section */}
          <main className="relative pt-20">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                      <Zap className="w-4 h-4 mr-2" />
                      AI-Powered Tax Optimization
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      <span className="text-slate-900 dark:text-white">Smart Tax</span>{' '}
                      <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                        Harvesting
                      </span>{' '}
                      <span className="text-slate-900 dark:text-white">Made Simple</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      Maximize your investment returns with AI-powered tax-loss harvesting.
                      Our intelligent platform identifies optimal opportunities to minimize your tax burden
                      while maintaining portfolio balance.
                    </p>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Save thousands in taxes annually</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Automated wash sale compliance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Portfolio rebalancing included</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/auth/signup"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Start Optimizing Today
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Watch Demo
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Trusted by investors worldwide</p>
                    <div className="grid grid-cols-3 gap-6 sm:gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">$2.4B+</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Assets Optimized</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">10K+</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Uptime</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Visual */}
                <div className="relative lg:ml-8">
                  <div className="relative">
                    {/* Background decorations */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-3xl transform rotate-3 blur-sm"></div>
                    <div className="absolute -inset-4 bg-gradient-to-bl from-blue-500/15 to-indigo-500/15 rounded-3xl transform -rotate-2 blur-sm"></div>

                    {/* Main visual container */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div className="absolute inset-0 bg-[url('/images/coverImage.jpg')] bg-cover bg-center bg-no-repeat">
                        <AuthInfoOverlay />
                      </div>
                      <div className="h-96 lg:h-[500px]"></div>
                    </div>

                    {/* Floating accent elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-80 blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-60 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Why Choose TaxHarvest.AI?
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Our platform combines cutting-edge AI with deep tax expertise to deliver unmatched optimization results.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Smart Analysis</h3>
                    <p className="text-slate-600 dark:text-slate-400">AI-driven portfolio analysis identifies optimal tax-loss harvesting opportunities in real-time.</p>
                  </div>

                  <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Wash Sale Protection</h3>
                    <p className="text-slate-600 dark:text-slate-400">Built-in compliance safeguards prevent wash sale violations while maximizing tax benefits.</p>
                  </div>

                  <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Tax Optimization</h3>
                    <p className="text-slate-600 dark:text-slate-400">Maximize after-tax returns with intelligent replacement security suggestions and timing optimization.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Optimize Your Taxes?
                  </h2>
                  <p className="text-lg mb-8 opacity-90">
                    Join thousands of investors who are already saving money with intelligent tax-loss harvesting.
                  </p>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </ThemeProvider>
    </MediaProvider>
  );
}
