import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
class PlaidInstitution {
	@Field(() => String)
	name: string;

	@Field(() => String)
	institution_id: string;
}

@InputType()
class PlaidAccount {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	mask: string;

	@Field(() => String)
	type: string;

	@Field(() => String, { nullable: true })
	subtype?: string;

	@Field(() => String, { nullable: true })
	verification_status?: string;
}

@InputType()
export class PlaidLinkOnSuccessMetadata {
	@Field(() => PlaidInstitution, { nullable: true })
	institution?: PlaidInstitution;

	@Field(() => [PlaidAccount])
	accounts: PlaidAccount[];

	@Field(() => String)
	link_session_id: string;

	@Field(() => String, { nullable: true })
	transfer_status?: string;
}

export interface PlaidWebhook {
	environment: 'sandbox' | 'production';
	error: null;
	item_id: string;
	new_holdings: number;
	updated_holdings: number;
	webhook_code: string;
	webhook_type: string;
}

/**
 * Plaid institution information returned from the API
 */
@ObjectType()
export class PlaidInstitutionInfo {
	@Field(() => String)
	institution_id: string;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	logo?: string;

	@Field(() => String, { nullable: true })
	primary_color?: string;

	@Field(() => String, { nullable: true })
	url?: string;

	@Field(() => [String])
	products: string[];

	@Field(() => [String])
	country_codes: string[];
}
