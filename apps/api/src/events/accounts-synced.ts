export class AccountsSyncedEvent {
	constructor(
		public readonly portfolioId: string,
		public readonly accountIds: string[],
	) {}
}
