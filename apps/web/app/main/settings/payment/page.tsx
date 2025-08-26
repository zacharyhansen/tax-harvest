import { PricingTable } from '@clerk/nextjs';

export default function PaymentSettings() {
	return (
		<PricingTable
			appearance={{
				elements: {
					drawerContent: {
						marginTop: '4rem',
					},
				},
			}}
		/>
	);
}
