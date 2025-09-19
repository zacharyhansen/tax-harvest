/** biome-ignore-all lint/suspicious/noExplicitAny: <testing> */
'use client';

import { useChat } from '@ai-sdk/react';
import { Badge } from '@repo/ui/components/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Bot } from 'lucide-react';
import { useState } from 'react';

/**
 * AI Advisor component
 * Provides an interactive chat interface for AI-powered tax harvesting advice
 * @example
 * <AiAdvisor />
 */
export function AiAdvisor() {
	const { messages, sendMessage } = useChat();
	const [input, setInput] = useState('');

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Bot className="h-6 w-6 text-primary" />
						<div>
							<CardTitle>AI Tax Advisor</CardTitle>
							<CardDescription>
								Get personalized tax harvesting recommendations
							</CardDescription>
						</div>
					</div>
					<Badge variant="secondary">Beta</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
					{messages.map((message) => (
						<div key={message.id} className="whitespace-pre-wrap">
							{message.role === 'user' ? 'User: ' : 'AI: '}
							{message.parts.map((part, i) => {
								switch (part.type) {
									case 'text':
										return <div key={`${message.id}-${i}`}>{part.text}</div>;
								}
							})}
						</div>
					))}

					<form
						onSubmit={(e) => {
							e.preventDefault();
							sendMessage({ text: input });
							setInput('');
						}}
					>
						<input
							className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
							value={input}
							placeholder="Say something..."
							onChange={(e) => setInput(e.currentTarget.value)}
						/>
					</form>
				</div>
				<Card className="bg-muted/50">
					<CardContent className="pt-6">
						<div className="flex items-start gap-2">
							<Badge variant="outline" className="mt-0.5">
								Note
							</Badge>
							<p className="text-sm text-muted-foreground">
								This AI advisor provides general guidance based on tax
								harvesting principles. Always consult with a qualified tax
								professional before making investment decisions.
							</p>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
}
