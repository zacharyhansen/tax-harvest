'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
	useCallback,
	type ReactNode,
} from 'react';
import {
	useCreateLotModelMutation,
	useInsertLotOnLotModelMutation,
	useDeleteLotOnLotModelMutation,
	useDeleteLotModelMutation,
	useLotModelsQuery,
} from '~/generated/gql';
import { toast } from '@repo/ui/components/toast-sonner';

type ModelStateStorage = {
	isPanelOpen: boolean;
	isPanelMinimized: boolean;
	currentModelId: string | null;
};

interface ModelStateContextValue {
	modelLotIds: string[];
	addLot: (lotId: string, quantity: number) => void;
	removeLot: (lotId: string) => void;
	deleteModel: () => void;
	isInModel: (lotId: string) => boolean;
	isPanelOpen: boolean;
	setIsPanelOpen: (open: boolean) => void;
	isPanelMinimized: boolean;
	setIsPanelMinimized: (minimized: boolean) => void;
	sortedLotIds: string[];
	currentModelId: string | null;
}

const ModelStateContext = createContext<ModelStateContextValue | undefined>(
	undefined,
);

const STORAGE_KEY = 'tax-model-state';

/**
 * Provider component for model state management
 * @param children - Child components
 * @example
 * ```tsx
 * <ModelStateProvider>
 *   <App />
 * </ModelStateProvider>
 * ```
 */
export function ModelStateProvider({ children }: { children: ReactNode }) {
	// Panel UI state (persisted to localStorage)
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [isPanelMinimized, setIsPanelMinimized] = useState(false);
	const [currentModelId, setCurrentModelId] = useState<string | null>(null);

	// GraphQL mutations
	const [createLotModel] = useCreateLotModelMutation();
	const [insertLotOnLotModel] = useInsertLotOnLotModelMutation();
	const [deleteLotOnLotModel] = useDeleteLotOnLotModelMutation();
	const [deleteLotModel] = useDeleteLotModelMutation();

	// Query existing models
	const { data: modelsData } = useLotModelsQuery();

	// Load panel state and current model from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const state = JSON.parse(stored) as ModelStateStorage;
				setIsPanelOpen(state.isPanelOpen ?? false);
				setIsPanelMinimized(state.isPanelMinimized ?? false);
				setCurrentModelId(state.currentModelId ?? null);
			} catch (e) {
				console.error('Failed to parse model state from localStorage', e);
			}
		}
	}, []);

	// Load the most recent model if no model is selected and models exist
	useEffect(() => {
		if (!currentModelId && modelsData?.lotModels && modelsData.lotModels.length > 0) {
			// Models are already sorted by createdAt desc from the query
			const mostRecentModel = modelsData.lotModels[0];
			setCurrentModelId(mostRecentModel.id);
		}
	}, [currentModelId, modelsData]);

	// Save panel state to localStorage when it changes
	useEffect(() => {
		const state: ModelStateStorage = {
			isPanelOpen,
			isPanelMinimized,
			currentModelId,
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}, [isPanelOpen, isPanelMinimized, currentModelId]);

	// Get current model data from GraphQL
	const currentModel = useMemo(() => {
		if (!currentModelId || !modelsData?.lotModels) return null;
		return modelsData.lotModels.find((m) => m.id === currentModelId) ?? null;
	}, [currentModelId, modelsData]);

	// Extract lot IDs from current model
	const modelLotIds = useMemo(() => {
		return currentModel?.lotOnLotModels.map((lom) => lom.lotId) ?? [];
	}, [currentModel]);

	// Create sorted lot IDs based on order in database
	const sortedLotIds = useMemo(() => {
		return [...modelLotIds];
	}, [modelLotIds]);

	/**
	 * Add lot to the current model or create a new model if none exists
	 * @param lotId - The ID of the lot to add
	 * @param quantity - The quantity of the lot to add
	 */
	const addLot = useCallback(
		async (lotId: string, quantity: number) => {
			if (!currentModelId) {
				// Create a new model if none exists
				await toast.promise(
					createLotModel({
						variables: {
							lotOnLotModels: [{ lotId, quantity }],
						},
						refetchQueries: ['LotModels'],
						onCompleted: (data) => {
							if (data?.createLotModel) {
								setCurrentModelId(data.createLotModel.id);
							}
						},
						onError: (err) => {
							throw err;
						},
					}),
					{
						loading: 'Creating model...',
						success: 'Lot added to new model',
						error: 'Failed to create model',
					},
				);
			} else {
				// Add to existing model
				await toast.promise(
					insertLotOnLotModel({
						variables: {
							lotModelId: currentModelId,
							lotId,
							quantity,
						},
						refetchQueries: ['LotModels'],
						onCompleted: () => Promise.resolve(),
						onError: (err) => {
							throw err;
						},
					}),
					{
						loading: 'Adding lot to model...',
						success: 'Lot added to model',
						error: 'Failed to add lot',
					},
				);
			}
		},
		[currentModelId, createLotModel, insertLotOnLotModel],
	);

	/**
	 * Remove lot from the current model
	 * @param lotId - The ID of the lot to remove
	 */
	const removeLot = useCallback(
		async (lotId: string) => {
			if (!currentModelId) return;
			await toast.promise(
				deleteLotOnLotModel({
					variables: {
						lotModelId: currentModelId,
						lotId,
					},
					refetchQueries: ['LotModels'],
					onCompleted: () => Promise.resolve(),
					onError: (err) => {
						throw err;
					},
				}),
				{
					loading: 'Removing lot from model...',
					success: 'Lot removed from model',
					error: 'Failed to remove lot',
				},
			);
		},
		[currentModelId, deleteLotOnLotModel],
	);

	/**
	 * Delete the current model entirely
	 */
	const deleteModel = useCallback(async () => {
		if (!currentModelId) return;
		await toast.promise(
			deleteLotModel({
				variables: {
					lotModelId: currentModelId,
				},
				refetchQueries: ['LotModels'],
				onCompleted: () => {
					setCurrentModelId(null);
					setIsPanelOpen(false);
					return Promise.resolve();
				},
				onError: (err) => {
					throw err;
				},
			}),
			{
				loading: 'Deleting model...',
				success: 'Model deleted',
				error: 'Failed to delete model',
			},
		);
	}, [currentModelId, deleteLotModel]);

	/**
	 * Check if a lot is in the current model
	 * @param lotId - The ID of the lot to check
	 * @returns True if the lot is in the model
	 */
	const isInModel = useCallback(
		(lotId: string) => modelLotIds.includes(lotId),
		[modelLotIds],
	);

	const value = useMemo(
		() => ({
			modelLotIds,
			addLot,
			removeLot,
			deleteModel,
			isInModel,
			isPanelOpen,
			setIsPanelOpen,
			isPanelMinimized,
			setIsPanelMinimized,
			sortedLotIds,
			currentModelId,
		}),
		[
			modelLotIds,
			addLot,
			removeLot,
			deleteModel,
			isInModel,
			isPanelOpen,
			isPanelMinimized,
			sortedLotIds,
			currentModelId,
		],
	);

	return (
		<ModelStateContext.Provider value={value}>
			{children}
		</ModelStateContext.Provider>
	);
}

/**
 * Hook for accessing model state
 * @returns Model state and control functions
 * @throws Error if used outside ModelStateProvider
 * @example
 * ```tsx
 * const { addLot, isPanelOpen, setIsPanelOpen } = useModelState();
 * ```
 */
export function useModelState() {
	const context = useContext(ModelStateContext);
	if (context === undefined) {
		throw new Error('useModelState must be used within a ModelStateProvider');
	}
	return context;
}
