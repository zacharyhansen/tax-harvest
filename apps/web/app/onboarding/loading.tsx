'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
	return (
		<motion.div
			className="bg-background fixed inset-0 z-50 flex items-center justify-center"
			initial={{ opacity: 1 }}
			exit={{
				opacity: 0,
				transition: { duration: 0.5, ease: 'easeInOut' },
			}}
		>
			<div className="flex flex-col items-center gap-8">
				{/* Animated Logo/Icon */}
				<motion.div
					className="relative"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<motion.div
						className="border-primary/20 h-16 w-16 rounded-full border-4"
						animate={{ rotate: 360 }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
					<motion.div
						className="border-t-primary absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent"
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'linear',
						}}
					/>
				</motion.div>

				{/* Loading Text */}
				<motion.div
					className="space-y-2 text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<h2 className="text-xl font-semibold">Setting up your dashboard</h2>
					<motion.p
						className="text-muted-foreground"
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'easeInOut',
						}}
					>
						Please wait a moment...
					</motion.p>
				</motion.div>

				{/* Progress Dots */}
				<div className="flex gap-2">
					{[0, 1, 2].map((index) => (
						<motion.div
							key={index}
							className="bg-primary h-2 w-2 rounded-full"
							animate={{
								scale: [1, 1.5, 1],
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								delay: index * 0.2,
								ease: 'easeInOut',
							}}
						/>
					))}
				</div>
			</div>
		</motion.div>
	);
}
