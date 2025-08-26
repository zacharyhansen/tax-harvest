import type { ClerkClient } from '@clerk/backend';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ClerkService {
	constructor(
		@Inject('CLERK_CLIENT') private readonly clerkClient: ClerkClient,
	) {}

	updatePublicMetaData(
		clerkUserId: string,
		publicMetadata: UserPublicMetadata,
	) {
		return this.clerkClient.users.updateUser(clerkUserId, {
			publicMetadata,
		});
	}

	user(id: string) {
		return this.clerkClient.users.getUser(id);
	}

	inviteUserToPlatform(emails: string[]) {
		const emailAddresses = emails.map((emailAddress) =>
			this.clerkClient.invitations.createInvitation({
				emailAddress,
				ignoreExisting: true,
			}),
		);
		return Promise.all(emailAddresses);
	}
}
