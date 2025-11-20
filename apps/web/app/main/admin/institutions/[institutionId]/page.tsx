'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@repo/ui/components/tabs';
import { toast } from '@repo/ui/components/toast-sonner';
import {
	ArrowLeft,
	Building2,
	CheckCircle,
	Copy,
	ExternalLink,
	XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use } from 'react';

import { usePlaidInstitutionQuery } from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

/**
 * Admin page displaying detailed information about a single Plaid institution
 * Shows comprehensive data including products, status, routing numbers, and raw API data
 */
export default function InstitutionDetailPage(props: {
	params: Promise<typeof TypedRoutes.institution.params>;
}) {
	const router = useRouter();
	const params = use(props.params);
	const safeParams = TypedRoutes.institution.parse(params);

	const { data, error, loading } = usePlaidInstitutionQuery({
		variables: { institutionId: safeParams.institutionId },
	});

	if (loading) {
		return <LoadingPage />;
	}

	if (error || !data?.plaidInstitution) {
		return <ErrorPage message="Failed to load institution" />;
	}

	const institution = data.plaidInstitution;

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'HEALTHY':
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'DEGRADED':
			case 'DOWN':
				return <XCircle className="h-4 w-4 text-red-600" />;
			default:
				return null;
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard');
	};

	return (
		<PageWrapper
			title={institution.name}
			className="h-screen pb-20"
			description={
				<div className="flex items-center gap-4">
					<Button
						onClick={() => router.push(TypedRoutes.institutions())}
						variant="outline"
						size="sm"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to List
					</Button>
					<span className="text-sm text-muted-foreground">
						ID: {institution.id}
					</span>
				</div>
			}
		>
			<div className="space-y-6">
				{/* Header Card */}
				<Card>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								{institution.logo ? (
									<div
										className="h-16 w-16 rounded-lg flex items-center justify-center p-2"
										style={{
											backgroundColor: institution.primaryColor
												? `${institution.primaryColor}15`
												: '#f5f5f5',
										}}
									>
										<Image
											src={institution.logo}
											alt={institution.name}
											className="h-full w-full object-contain"
										/>
									</div>
								) : (
									<div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
										<Building2 className="h-10 w-10 text-muted-foreground" />
									</div>
								)}
								<div>
									<CardTitle className="text-2xl">{institution.name}</CardTitle>
									{institution.url && (
										<CardDescription className="flex items-center gap-1 mt-1">
											<a
												href={institution.url}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline"
											>
												{institution.url}
											</a>
											<ExternalLink className="h-3 w-3" />
										</CardDescription>
									)}
								</div>
							</div>
							<Badge variant={institution.oauth ? 'default' : 'secondary'}>
								{institution.oauth ? 'OAuth' : 'Credentials'}
							</Badge>
						</div>
					</CardHeader>
				</Card>

				{/* Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">
								Country Codes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-1 flex-wrap">
								{institution.countryCode?.map((code) => (
									<Badge key={code} variant="outline">
										{code}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">Products</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{institution.products?.length || 0}
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								Supported products
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">
								Routing Numbers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{institution.routingNumbers?.length || 0}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-sm font-medium">DTC Numbers</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{institution.dtcNumbers?.length || 0}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Products List */}
				<Card>
					<CardHeader>
						<CardTitle>Supported Products</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2 flex-wrap">
							{institution.products?.map((product) => (
								<Badge key={product} variant="secondary">
									{product}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Status Information */}
				{institution.status && typeof institution.status === 'object' && (
					<Card>
						<CardHeader>
							<CardTitle>Product Status</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{Object.entries(institution.status).map(
									// biome-ignore lint/suspicious/noExplicitAny: <admin stuff>
									([key, value]: [string, any]) => (
										<div key={key} className="border-b pb-3 last:border-b-0">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-2">
													{getStatusIcon(value.status)}
													<span className="font-medium capitalize">
														{key.replace(/_/g, ' ')}
													</span>
												</div>
												<Badge
													variant={
														value.status === 'HEALTHY'
															? 'default'
															: value.status === 'DEGRADED'
																? 'secondary'
																: 'destructive'
													}
												>
													{value.status}
												</Badge>
											</div>
											{value.breakdown && (
												<div className="text-sm text-muted-foreground space-y-1 ml-6">
													<div>
														Success:{' '}
														{((value.breakdown.success || 0) * 100).toFixed(1)}%
													</div>
													{value.breakdown.error_plaid && (
														<div>
															Plaid Errors:{' '}
															{(
																(value.breakdown.error_plaid || 0) * 100
															).toFixed(1)}
															%
														</div>
													)}
													{value.breakdown.error_institution && (
														<div>
															Institution Errors:{' '}
															{(
																(value.breakdown.error_institution || 0) * 100
															).toFixed(1)}
															%
														</div>
													)}
												</div>
											)}
										</div>
									),
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Tabs for Additional Data */}
				<Tabs defaultValue="routing" className="w-full">
					<TabsList>
						<TabsTrigger value="routing">Routing Numbers</TabsTrigger>
						<TabsTrigger value="dtc">DTC Numbers</TabsTrigger>
						<TabsTrigger value="raw">Raw Data</TabsTrigger>
					</TabsList>

					<TabsContent value="routing">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>Routing Numbers</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(
											institution.routingNumbers?.join(', ') || '',
										)
									}
								>
									<Copy className="h-4 w-4 mr-2" />
									Copy All
								</Button>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-3 gap-2">
									{institution.routingNumbers?.map((number) => (
										<Badge key={number} variant="outline">
											{number}
										</Badge>
									))}
								</div>
								{!institution.routingNumbers ||
									(institution.routingNumbers.length === 0 && (
										<p className="text-muted-foreground">
											No routing numbers available
										</p>
									))}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="dtc">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>DTC Numbers</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(institution.dtcNumbers?.join(', ') || '')
									}
								>
									<Copy className="h-4 w-4 mr-2" />
									Copy All
								</Button>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-3 gap-2">
									{institution.dtcNumbers?.map((number) => (
										<Badge key={number} variant="outline">
											{number}
										</Badge>
									))}
								</div>
								{!institution.dtcNumbers ||
									(institution.dtcNumbers.length === 0 && (
										<p className="text-muted-foreground">
											No DTC numbers available
										</p>
									))}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="raw">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle>Raw JSON Data</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										copyToClipboard(JSON.stringify(institution.raw, null, 2))
									}
								>
									<Copy className="h-4 w-4 mr-2" />
									Copy JSON
								</Button>
							</CardHeader>
							<CardContent>
								{institution.raw ? (
									<pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
										{JSON.stringify(institution.raw, null, 2)}
									</pre>
								) : (
									<p className="text-muted-foreground">No raw data available</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Metadata */}
				<Card>
					<CardHeader>
						<CardTitle>Metadata</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-medium text-muted-foreground">
									Created At:
								</span>
								<p>{new Date(institution.createdAt).toLocaleString()}</p>
							</div>
							<div>
								<span className="font-medium text-muted-foreground">
									Updated At:
								</span>
								<p>{new Date(institution.updatedAt).toLocaleString()}</p>
							</div>
							<div>
								<span className="font-medium text-muted-foreground">
									Last Synced:
								</span>
								<p>{new Date(institution.lastSyncedAt).toLocaleString()}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageWrapper>
	);
}
