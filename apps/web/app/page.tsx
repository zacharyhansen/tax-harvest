import MediaProvider from '@repo/ui/providers/media-provider';
import { ThemeProvider } from '@repo/ui/providers/theme-provider';
import {
	ArrowRight,
	BarChart3,
	Shield,
	Tractor,
	TrendingUp,
	Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
	return (
		<MediaProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<div className="relative min-h-screen">
					{/* Background with overlay */}
					<div className="absolute inset-0 bg-[url('/images/coverImage.jpg')] bg-cover bg-center bg-no-repeat" />
					<div className="absolute inset-0 bg-black/50" />
					{/* Dark overlay for better text readability */}
					<div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
						{/* Logo */}
						<Link href="/en" className="mb-12">
							<div className="flex items-center text-2xl font-bold text-white">
								<Tractor className="mr-2 h-8 w-8 text-yellow-500" />
								TaxHarvest.AI
							</div>
						</Link>

						{/* Main Content */}
						<div className="w-full max-w-md space-y-8">
							{/* Hero Text */}
							<div className="space-y-4 text-center">
								<h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
									Smart Tax
									<span className="text-yellow-500"> Optimization</span>
								</h1>
								<p className="text-lg text-slate-200">
									AI-powered tax loss harvesting that maximizes your after-tax
									returns
								</p>
							</div>

							{/* Key Features */}
							<div className="space-y-4">
								<div className="flex items-center gap-3 text-white">
									<div className="rounded-full bg-green-100/20 p-2">
										<TrendingUp className="h-4 w-4 text-green-400" />
									</div>
									<span className="text-sm font-medium">
										Optimize tax efficiency automatically
									</span>
								</div>
								<div className="flex items-center gap-3 text-white">
									<div className="rounded-full bg-blue-100/20 p-2">
										<Shield className="h-4 w-4 text-blue-400" />
									</div>
									<span className="text-sm font-medium">
										Wash sale protection built-in
									</span>
								</div>
								<div className="flex items-center gap-3 text-white">
									<div className="rounded-full bg-purple-100/20 p-2">
										<BarChart3 className="h-4 w-4 text-purple-400" />
									</div>
									<span className="text-sm font-medium">
										Real-time portfolio analysis
									</span>
								</div>
							</div>

							{/* CTA Buttons */}
							<div className="space-y-4">
								<Link
									href="/auth/signup"
									className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl"
								>
									<span>Start Optimizing Today</span>
									<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
								</Link>

								<Link
									href="/auth/signin"
									className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
								>
									<span>Sign In</span>
								</Link>
							</div>

							{/* Trust Indicators */}
							<div className="space-y-2 border-t border-white/20 pt-6 text-center">
								<div className="flex items-center justify-center gap-2 text-sm text-slate-200">
									<Zap className="h-4 w-4" />
									<span>Trusted by 10,000+ investors</span>
								</div>
								<div className="text-xs text-slate-300">
									SEC-compliant • Bank-level security • Free to start
								</div>
							</div>
						</div>
					</div>
				</div>
			</ThemeProvider>
		</MediaProvider>
	);
}
