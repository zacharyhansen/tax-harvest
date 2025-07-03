import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import { Tractor, TrendingUp, Shield, Zap, Brain, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <MediaProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
          {/* Header */}
          <header className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Tractor className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  TaxHarvest.AI
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </header>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-green-600 to-blue-600 bg-clip-text text-transparent dark:from-white dark:via-green-400 dark:to-blue-400">
                AI-Powered Tax Optimization
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Maximize your tax savings with cutting-edge artificial intelligence.
                TaxHarvest.AI identifies optimal strategies and automates complex tax planning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/auth/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ChevronRight className="inline ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="border-2 border-slate-300 hover:border-green-600 text-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:border-green-400 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
                >
                  Learn More
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-2">Trusted by 10,000+ tax professionals</span>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Why Choose TaxHarvest.AI?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Advanced AI technology meets tax expertise
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <Brain className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">AI-Powered Analysis</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our advanced AI analyzes your financial data to identify tax-saving opportunities you might miss.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Maximize Savings</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Automatically identify tax-loss harvesting opportunities and optimize your portfolio for tax efficiency.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <Shield className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Secure & Compliant</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Bank-level security with full compliance to tax regulations and data protection standards.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Real-time Monitoring</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Continuous monitoring of your investments with instant alerts for tax-saving opportunities.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <Tractor className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Automated Execution</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Set it and forget it. Our AI executes tax strategies automatically based on your preferences.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <Star className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Expert Support</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Access to certified tax professionals and financial advisors when you need human expertise.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6 py-20">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Optimize Your Taxes?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of smart investors who are already saving more with AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-green-600 hover:bg-slate-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  Start Your Free Trial
                </Link>
                <Link
                  href="/auth/signin"
                  className="border-2 border-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-sm mt-4 opacity-75">
                No credit card required • 30-day free trial • Cancel anytime
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="container mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Tractor className="h-6 w-6 text-green-600" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">TaxHarvest.AI</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                © 2024 TaxHarvest.AI. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </MediaProvider>
  );
}
