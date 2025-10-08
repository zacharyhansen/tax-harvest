'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { toast } from '@repo/ui/components/toast-sonner';
import { Building2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useMemo, useState } from 'react';

import {
	useAdminRefreshPlaidInstitutionsMutation,
	usePlaidInstitutionsQuery,
} from '~/generated/gql';
import { TypedRoutes } from '~/lib/routes';
import { PageWrapper } from '~/modules/layout';
import { ErrorPage, LoadingPage } from '~/modules/utility-components';

/**
 * Memoized institutions grid to prevent re-renders on search input changes
 */
const InstitutionsGrid = memo<{
	// biome-ignore lint/suspicious/noExplicitAny: <adminok>
	institutions: any[];
	onClick: (institutionId: string) => void;
}>(({ institutions, onClick }) => {
	if (institutions.length === 0) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				No institutions found. Try adjusting your search.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{institutions.map((institution) => (
				<Card
					key={institution.id}
					className="cursor-pointer hover:shadow-lg transition-shadow"
					onClick={() => onClick(institution.institutionId)}
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between mb-3">
							{institution.logo ? (
								<div
									className="h-12 w-12 rounded-full flex items-center justify-center p-1"
									style={{
										backgroundColor: institution.primaryColor
											? `${institution.primaryColor}15`
											: '#f5f5f5',
									}}
								>
									<Image
										src={`data:image/jpeg;base64,${institution.logo}`}
										alt={institution.name}
										className="h-full w-full object-contain rounded-full"
										unoptimized
										width={48}
										height={48}
									/>
								</div>
							) : (
								<div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
									<Building2 className="h-6 w-6 text-muted-foreground" />
								</div>
							)}
							<Badge variant={institution.oauth ? 'default' : 'secondary'}>
								{institution.oauth ? 'OAuth' : 'Credentials'}
							</Badge>
						</div>
						<CardTitle className="text-base line-clamp-2">
							{institution.name}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Products</span>
								<span className="font-medium">
									{institution.products?.length || 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Countries</span>
								<div className="flex gap-1">
									{institution.countryCode?.map((code: string) => (
										<Badge key={code} variant="outline" className="text-xs">
											{code}
										</Badge>
									))}
								</div>
							</div>
							<div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
								Last synced:{' '}
								{new Date(institution.lastSyncedAt).toLocaleDateString()}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
});
InstitutionsGrid.displayName = 'InstitutionsGrid';

const PAGE_SIZE = 500;

/**
 * Admin page displaying all Plaid institutions in a bento-style grid
 * Allows searching and manual refresh of institution data
 */
export default function InstitutionsPage() {
	const router = useRouter();
	const [searchInput, setSearchInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [page, setPage] = useState(0);

	const { data, loading, error, refetch } = usePlaidInstitutionsQuery({
		variables: {
			where: searchQuery ? { name: { contains: searchQuery } } : undefined,
			skip: page * PAGE_SIZE,
			take: PAGE_SIZE,
		},
	});

	const handleSearch = () => {
		setSearchQuery(searchInput);
		setPage(0); // Reset to first page on new search
	};

	const totalPages = Math.ceil((data?.plaidInstitutionsCount || 0) / PAGE_SIZE);
	const canGoPrevious = page > 0;
	const canGoNext = page < totalPages - 1;

	const [refreshMutation, { loading: refreshing }] =
		useAdminRefreshPlaidInstitutionsMutation();

	const handleRefresh = async () => {
		await toast.promise(
			refreshMutation().then(() => refetch()),
			{
				loading: 'Refreshing institutions from Plaid...',
				success: 'Institutions refreshed successfully',
				error: 'Failed to refresh institutions',
			},
		);
	};

	const institutions = useMemo(() => {
		return data?.plaidInstitutions || [];
	}, [data]);

	const handleInstitutionClick = (institutionId: string) => {
		router.push(TypedRoutes.institution({ institutionId }));
	};

	if (error) {
		return <ErrorPage message="Failed to load institutions" />;
	}

	if (loading && !data) {
		return <LoadingPage />;
	}

	return (
		<PageWrapper
			title="Plaid Institutions"
			description={`${data?.plaidInstitutionsCount || 0} supported institutions`}
			cornerElement={
				<Button
					onClick={handleRefresh}
					disabled={refreshing}
					variant="outline"
					size="sm"
				>
					<RefreshCw
						className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
					/>
					Refresh
				</Button>
			}
		>
			<div className="space-y-4">
				{/* Search Bar and Pagination */}
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="flex gap-2 flex-1">
						<Input
							placeholder="Search institutions..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSearch();
								}
							}}
							className="max-w-sm"
						/>
						<Button onClick={handleSearch} variant="outline">
							Search
						</Button>
					</div>

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p - 1)}
								disabled={!canGoPrevious || loading}
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>
							<span className="text-sm text-muted-foreground whitespace-nowrap">
								Page {page + 1} of {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={!canGoNext || loading}
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</div>

				{/* Bento Grid */}
				<InstitutionsGrid
					institutions={institutions}
					onClick={handleInstitutionClick}
				/>
			</div>
		</PageWrapper>
	);
}
