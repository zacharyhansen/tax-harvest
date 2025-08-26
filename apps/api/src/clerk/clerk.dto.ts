/** biome-ignore-all lint/suspicious/noExplicitAny: <clerk> */
/** biome-ignore-all lint/complexity/noBannedTypes: <come back to this> */
interface EmailAddress {
	email_address: string;
	id: string;
	linked_to: any[];
	object: 'email_address';
	reserved: boolean;
	verification: Record<string, any>; // You might want to define a more specific type for verification
}

type ExternalAccount = {};

type Web3Wallet = {};

interface PhoneNumber {
	phone_number: string;
	id: string;
	linked_to: any[];
	object: 'phone_number';
	reserved: boolean;
}

export interface ClerkUser {
	birthday: string;
	created_at: number;
	email_addresses: EmailAddress[];
	external_accounts: ExternalAccount[];
	external_id: string | null;
	first_name: string | null;
	gender: string;
	id: string;
	image_url: string;
	last_name: string | null;
	last_sign_in_at: number | null;
	object: 'user';
	password_enabled: boolean;
	phone_numbers: PhoneNumber[];
	primary_email_address_id: string | null;
	primary_phone_number_id: string | null;
	primary_web3_wallet_id: string | null;
	private_metadata: Record<string, any>;
	profile_image_url: string;
	public_metadata: Record<string, any>;
	two_factor_enabled: boolean;
	unsafe_metadata: Record<string, any>;
	updated_at: number;
	username: string | null;
	web3_wallets: Web3Wallet[];
}

// Optional: Type guard to check if an object is a ClerkUser
export function isClerkUser(obj: any): obj is ClerkUser {
	return (
		obj &&
		typeof obj === 'object' &&
		'id' in obj &&
		'object' in obj &&
		obj.object === 'user'
	);
}

export interface ClerkWebHookEvent {
	data: ClerkUser;
	event_attributes: any;
	object: 'event';
	timestamp: number;
	type: string;
}
