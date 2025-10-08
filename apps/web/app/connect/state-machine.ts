import { type ActorRefFrom, setup } from 'xstate';
import type { PortfolioConnectItemDetailFragment } from '~/generated/gql';

export const machine = setup({
	types: {
		context: {} as {
			portfolioConnect: PortfolioConnectItemDetailFragment;
		},
		input: {} as {
			portfolioConnect: PortfolioConnectItemDetailFragment;
		},
		events: {} as
			| { type: 'back' }
			| { type: 'submit' }
			| { type: 'cancel' }
			| { type: 'link.created' }
			| { type: 'connect_plaid' }
			| { type: 'etrade.submit' }
			| { type: 'schwab.submit' }
			| { type: 'plaid.connected' }
			| { type: 'plaid.sync_retry' }
			| { type: 'plaid.sync_error' }
			| { type: 'calculating_complete' },
	},
	actions: {
		deletePortfolioConnect: ({ context }) => {
			console.log('deletePortfolioConnect', context.portfolioConnect.id);
		},
		completePortfolioConnect: ({ context }) => {
			console.log('completePortfolioConnect', context.portfolioConnect.id);
		},
	},
	guards: {
		etrade: ({ context }) => {
			return context.portfolioConnect?.plaidInstitution.id === 'ins_129473';
		},
		schwab: ({ context }) => {
			return context.portfolioConnect?.plaidInstitution.id === 'ins_11';
		},
	},
}).createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QGED2A7dYDGAXAdAJbqG4DEA2gAwC6ioADqrKYRvSAB6ICMATAFZ8AFgCc40WIE8qfHqIBsAGhABPXlTH5RVKqJ7S+mgOyKAvmZVpMOAsVKUedJCCYtcbdB24J+QsRJSMnKKKuoIwjwK+ALGABxRsqJxAMzGCgIWVhhYeEQk5BR8zozMrOwuPn4iEpKi0rLyymq8xsYx8TwpAgpxRsIpXVkg1rkEAGaEEGAANqSqZLAArgBGALak1CWuZR4VoD7GafgpfW0GegJUp2G8fR1xenECwnHpPG3Do7b4k9NzuAWKwAhtgANZbDhucpeSqIaTtARxZIXaRxSICW4IBI1CTGKIpYTCWIKL45H5gXAAJ2B0wA+ksGDNULSyJSadN8Mt1ptaFDdp5vPCFNE+Ap6lR0Wl0rEsTIXtpdG9TG95KkyTY8uzaWAGUyWRAyCDwZCXNC9rCDogUrJ8KZekiBJIPsjmuF6il8H0+G0RVQeHE+ikNWN8EzgVM6dhyXgyHN0GD8NgqWBgbhIKbSu5BXCED1ReKrlLfbKWtjTCddKJBjaBD1YiGfuHI9HNeRjRC+WaBfsuNbbfbns9nfFQmWUkYYrpGm1RLOeI28s2IFGY+3QRCnPzs72fIZtAJBrJA5FjJiy8I+MJ8FROnxBhlLgvLCM10ngTNsEsZmniFA6QAFsCVIAG5wOQ2Afl+P4eOg-7RmsTKUmAmY7Dulp9r4Z48Pgfr8HE4pvIefByiYuFFkcJ7CO8i4EAwKYgYQYAAO6AcBYGwLgsBkK2Yx0suqHmjmVpYdIuEKP6fAEckZ4TliNqehOCQyM84pScStFhgxTGsUBoHgdxvG2PxP5TBQW7duhQoICEVAnHWxKpLeKS9MY8n3GI1EDPmOhUJkL7fEu2ksWx+mcdx3IbLggk9hhPi2fZLxIjaRyuViAx8NokjpAkqT3ikoiacudKwKo6DYGQy5JmuGZdlmMLWYGnqjv6wgSdWBHCFidbNUS8SaPowi6P52RtmGpkrqV5WVRN1VthmFn1RajVirhbxEvm4oyViGSZUkZ7XIIxJtUVE0lWVFVVVN2B0mAVJUqgVIxVZuZNXayKte1pwKF1ZbVp6FySHw1Y+t6p0RpNF23fdj0zRDXJQym1KqM9DW5uIcQPJK3S7ZobqIIGmWPvoqRRESgbg5G13Qw9VI8cC5WzKjy25jwHyKToSJXviD4pFiqTXrE6kGF5Ip8JpsDYABzHAiserMrSdLMlxixSzLKxcqsUXM8JmFdOi+BGFtbO6FJBFYm0QhC8ikTok1wgS2rsvywaSuoCrkGMzMOu7rwHzXn5t5tQkSRSTtxjXp5pg+uIPTGOLwzoKg0zwC4gW4NuaMiQAtPjCC5ze04kpeOiPNRmn2BnllZ5hl7pTw159Ak5NdAo97PqNoZ-LM8yZyzImxHZOht0bfkZXKqQ3p0Z6PII-CXpp2r0oyCsQH3us+Ep2jAyKZyyFQCgGKRdYiFWdZXnoryFQFb7FUZeDr77CApDaN7IgkvT8C5v3hJee3xEYTQAZ0SxGMJpBCSF0yPziogK8+gvQEjqG3SUh5ur+hiJIVUBV1IDHAVBb8v44KhQ4lXJaG9eB1miLoU48dD4HwKqRV4+ALhvFOOiaih8irBV0uxAy0DrJGBkCcBQE41LUWeC5dKPop59F0LbEBnwb5jWKtdfhuYjjtFOD6fEVwJQ3DLG8UQXp-RKjrNWKICdO5NjOtTO6tM1EiTZjoL0Ij7zGDHkkLE1ZogGGCP6AixE4iO2ls7FertlapzIU-Nm8QTicz6NRLoBILbpCnsDfEAwCIv2vhYIAA */
	context: ({ input }) => {
		console.log({ statemachine: input });
		return {
			portfolioConnect: input.portfolioConnect,
		};
	},
	id: 'Connect',
	initial: 'init',
	states: {
		init: {
			always: [
				{
					guard: {
						type: 'etrade',
					},
					target: 'etrade_upload',
				},
				{
					guard: {
						type: 'schwab',
					},
					target: 'plaid_connect',
				},
				{
					target: 'fidelity',
				},
			],
		},
		fidelity: {
			on: {
				submit: {
					target: 'complete',
				},
				back: [
					{
						actions: {
							type: 'deletePortfolioConnect',
						},
					},
				],
			},
		},
		etrade_upload: {
			on: {
				'etrade.submit': {
					target: 'calculating_harvest',
				},
				back: [
					{
						guard: {
							type: 'etrade',
						},
						actions: {
							type: 'deletePortfolioConnect',
						},
					},
				],
			},
		},
		plaid_connect: {
			on: {
				'link.created': {
					target: 'plaid_sync',
				},
				back: [
					{
						guard: {
							type: 'schwab',
						},
						actions: {
							type: 'deletePortfolioConnect',
						},
					},
					{
						guard: {
							type: 'etrade',
						},
						target: 'preview_harvests',
					},
				],
			},
		},
		complete: {
			type: 'final',
			entry: [
				{
					type: 'completePortfolioConnect',
				},
			],
		},
		calculating_harvest: {
			on: {
				calculating_complete: {
					target: 'preview_harvests',
				},
			},
		},
		preview_harvests: {
			on: {
				connect_plaid: [
					{
						target: 'plaid_connect',
						guard: {
							type: 'etrade',
						},
					},
					{
						target: 'complete',
					},
				],
				submit: {
					target: 'complete',
				},
			},
		},
		plaid_sync: {
			on: {
				'plaid.connected': [
					{
						target: 'complete',
						guard: {
							type: 'etrade',
						},
					},
					{
						target: 'schwab_upload_lots',
					},
				],
				'plaid.sync_error': {
					target: 'plaid_sync_error',
				},
			},
		},
		plaid_sync_error: {
			on: {
				'plaid.sync_retry': [
					{
						target: 'plaid_sync',
					},
				],
				cancel: [
					{
						actions: {
							type: 'deletePortfolioConnect',
						},
					},
				],
			},
		},
		schwab_upload_lots: {
			on: {
				'schwab.submit': {
					target: 'calculating_harvest',
				},
				cancel: [
					{
						actions: {
							type: 'deletePortfolioConnect',
						},
					},
				],
			},
		},
	},
});

export type ConnectActorRef = ActorRefFrom<typeof machine>;
